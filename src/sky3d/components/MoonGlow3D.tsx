"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSkyboxStore, computeSunDirection } from '../store/useSkyboxStore';

// Vertex shader
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Fragment shader: rim glow effect
const fragmentShader = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uCameraPos;
  uniform float uGlowIntensity;
  uniform float uGlowRadius;
  uniform float uMoonPhase;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(uCameraPos - vWorldPos);

    // Only glow on lit side
    float NdotL = dot(N, L);
    float lit = smoothstep(-0.1, 0.1, NdotL);

    // Rim/Fresnel effect
    float NdotV = dot(N, V);
    float rim = pow(1.0 - clamp(NdotV, 0.0, 1.0), uGlowRadius);

    // Moon illumination affects glow intensity
    float moonIllum = 1.0 - abs(uMoonPhase - 0.5) * 2.0;
    float glowScale = 0.3 + moonIllum * 0.7; // Stronger glow at full moon

    float glow = lit * rim * uGlowIntensity * glowScale;

    // Warm golden glow color
    vec3 glowColor = vec3(1.0, 0.95, 0.85);

    gl_FragColor = vec4(glowColor * glow, glow);
  }
`;

export function MoonGlow3D() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { moonPhase, moonPosition, moonGlowIntensity, moonGlowRadius, skyDarkness } =
    useSkyboxStore();

  const sunDir = useMemo(() => computeSunDirection(moonPhase), [moonPhase]);

  const uniforms = useMemo(
    () => ({
      uSunDir: { value: new THREE.Vector3(...sunDir) },
      uCameraPos: { value: new THREE.Vector3(0, 0, 3) },
      uGlowIntensity: { value: moonGlowIntensity },
      uGlowRadius: { value: moonGlowRadius },
      uMoonPhase: { value: moonPhase },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMoonPhase.value = moonPhase;
      materialRef.current.uniforms.uGlowIntensity.value = moonGlowIntensity;
      materialRef.current.uniforms.uGlowRadius.value = moonGlowRadius;
      (materialRef.current.uniforms.uSunDir.value as THREE.Vector3).set(...sunDir);
      // Update camera position from state
      (materialRef.current.uniforms.uCameraPos.value as THREE.Vector3).copy(
        state.camera.position
      );
    }
  });

  // Only show glow in dark mode
  if (skyDarkness < 0.5) return null;

  return (
    <mesh position={moonPosition}>
      <sphereGeometry args={[0.85, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
