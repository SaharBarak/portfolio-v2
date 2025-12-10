"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSkyboxStore, computeSunDirection } from '../store/useSkyboxStore';
import { noiseGLSL } from '../shaders/shared.glsl';

// Vertex shader for 3D moon sphere
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Fragment shader: 3D moon with phase-based lighting
const fragmentShader = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uMoonPhase;
  uniform float uTime;
  uniform float uLibrationLon;
  uniform float uLibrationLat;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  ${noiseGLSL}

  // Compute moon surface albedo with maria and craters
  vec3 computeMoonAlbedo(vec3 normal, float time) {
    // Use spherical coords for surface features
    float u = atan(normal.x, normal.z) / 6.28318 + 0.5;
    float v = asin(clamp(normal.y, -1.0, 1.0)) / 3.14159 + 0.5;
    vec2 surfaceUV = vec2(u - 0.5, v - 0.5) * 2.0;

    // Apply subtle libration offset
    float libScale = 0.055;
    surfaceUV += vec2(-uLibrationLon * libScale, -uLibrationLat * libScale);

    // Base moon color
    vec3 baseColor = vec3(0.85, 0.82, 0.78);

    // Maria (dark seas) - procedural placement
    float maria = 0.0;
    maria += smoothstep(0.35, 0.0, length(surfaceUV - vec2(0.15, 0.0))) * 0.18;
    maria += smoothstep(0.25, 0.0, length(surfaceUV - vec2(0.22, 0.22))) * 0.15;
    maria += smoothstep(0.30, 0.0, length(surfaceUV - vec2(-0.22, 0.12))) * 0.17;
    maria += smoothstep(0.38, 0.0, length(surfaceUV - vec2(-0.38, -0.12))) * 0.16;
    maria += smoothstep(0.20, 0.0, length(surfaceUV - vec2(0.05, -0.28))) * 0.12;

    // Maria color (darker, slightly blue)
    vec3 mariaColor = vec3(0.55, 0.54, 0.52);
    vec3 albedo = mix(baseColor, mariaColor, maria);

    // Small surface noise for texture
    float surfNoise = noise(surfaceUV * 12.0) * 0.05;
    albedo *= (1.0 - surfNoise);

    // Crater noise
    float craterNoise = noise(surfaceUV * 25.0) * 0.03;
    albedo *= (1.0 - max(0.0, craterNoise));

    return albedo;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDir);

    // Lambertian diffuse
    float NdotL = dot(N, L);

    // Sharp terminator (day/night boundary on moon)
    float sunlit = smoothstep(-0.02, 0.02, NdotL);

    // 3D shading
    float diffuse = max(0.0, NdotL);
    float shading = mix(0.7, 1.0, diffuse);

    // Limb darkening (edges appear darker)
    // Use view direction approximation
    vec3 V = normalize(-vWorldPos);
    float NdotV = dot(N, V);
    float limbDarkening = pow(max(0.0, NdotV), 0.4);
    limbDarkening = mix(0.6, 1.0, limbDarkening);

    // Get moon surface albedo
    vec3 albedo = computeMoonAlbedo(N, uTime);

    // Sunlit portion
    vec3 litColor = albedo * shading * limbDarkening * 1.25;

    // Earthshine on dark side
    float moonIllum = 1.0 - abs(uMoonPhase - 0.5) * 2.0;
    float crescentFactor = 1.0 - moonIllum;
    float esIntensity = crescentFactor * smoothstep(0.0, 0.15, moonIllum) * smoothstep(0.7, 0.3, moonIllum);
    esIntensity = max(esIntensity, 0.08);

    // Earth-light direction (opposite sun)
    vec3 earthDir = normalize(vec3(-L.x, L.y * 0.3, -L.z * 0.5 + 0.5));
    float earthNdotL = max(0.0, dot(N, earthDir));
    float earthShading = mix(0.4, 1.0, earthNdotL);

    vec3 earthshineBase = vec3(0.25, 0.30, 0.38);
    vec3 earthshineColor = earthshineBase * albedo * limbDarkening * earthShading * esIntensity;

    // Final blend: sunlit vs earthshine
    vec3 finalColor = mix(earthshineColor, litColor, sunlit);

    // Alpha: lit side fully opaque, dark side semi-transparent
    float darkSideAlpha = 0.18 + esIntensity * 0.7;
    darkSideAlpha = clamp(darkSideAlpha, 0.15, 0.5);
    float alpha = mix(darkSideAlpha, 1.0, sunlit);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function Moon3D() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const { moonPhase, moonPosition, skyDarkness } = useSkyboxStore();

  const sunDir = useMemo(() => computeSunDirection(moonPhase), [moonPhase]);

  const uniforms = useMemo(
    () => ({
      uSunDir: { value: new THREE.Vector3(...sunDir) },
      uMoonPhase: { value: moonPhase },
      uTime: { value: 0 },
      uLibrationLon: { value: 0 },
      uLibrationLat: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMoonPhase.value = moonPhase;
      (materialRef.current.uniforms.uSunDir.value as THREE.Vector3).set(...sunDir);
    }
  });

  // Only show moon in dark mode
  if (skyDarkness < 0.5) return null;

  return (
    <mesh ref={meshRef} position={moonPosition}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
