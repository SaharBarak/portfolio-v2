"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSkyboxStore } from '../store/useSkyboxStore';
import { noiseGLSL, starsGLSL } from '../shaders/shared.glsl';

// Vertex shader: output direction vector from center to vertex
const vertexShader = /* glsl */ `
  varying vec3 vDir;
  varying vec2 vUv;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vDir = normalize(worldPos.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Fragment shader: map direction to UV and sample sky + stars
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSkyDarkness;
  uniform vec3 uSkyTopColor;
  uniform vec3 uSkyBottomColor;
  uniform float uStarDensity;
  uniform float uStarBrightness;
  uniform float uMoonPhase;

  varying vec3 vDir;
  varying vec2 vUv;

  const float PI = 3.14159265359;

  ${noiseGLSL}
  ${starsGLSL}

  void main() {
    vec3 dir = normalize(vDir);

    // Map direction to sky UV
    float u = atan(dir.x, dir.z) / (2.0 * PI) + 0.5;
    float v = dir.y * 0.5 + 0.5;
    vec2 skyUv = vec2(u, v);

    // Sky gradient based on vertical position
    float gradientT = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);

    // Day colors
    vec3 dayTop = vec3(0.18, 0.45, 0.85);
    vec3 dayBottom = vec3(0.55, 0.78, 0.95);
    vec3 dayGradient = mix(dayBottom, dayTop, gradientT);

    // Night colors (from store)
    vec3 nightGradient = mix(uSkyBottomColor, uSkyTopColor, gradientT);

    // Interpolate based on darkness
    vec3 skyColor = mix(dayGradient, nightGradient, uSkyDarkness);

    // Stars (night only)
    vec3 starColor = vec3(0.0);
    if (uSkyDarkness > 0.01) {
      // Moon illumination affects star visibility
      float moonIllum = 1.0 - abs(uMoonPhase - 0.5) * 2.0;
      float starVisibilityFactor = 1.0 - moonIllum * 0.6;

      // Multiple star layers
      vec2 starUv = skyUv * vec2(2.0, 1.0); // Stretch horizontally for dome
      float bgField = 0.0;
      bgField += bgStars(starUv + vec2(0.0), 80.0 * uStarDensity, uTime) * 0.8;
      bgField += bgStars(starUv + vec2(30.0), 120.0 * uStarDensity, uTime) * 0.5;
      bgField += bgStars(starUv + vec2(60.0), 180.0 * uStarDensity, uTime) * 0.3 * starVisibilityFactor;
      bgField += bgStars(starUv + vec2(90.0), 250.0 * uStarDensity, uTime) * 0.15 * starVisibilityFactor;

      starColor = vec3(bgField * 0.9, bgField * 0.95, bgField * 1.05) * uStarBrightness;
      starColor *= uSkyDarkness;
    }

    vec3 result = skyColor + starColor;
    gl_FragColor = vec4(result, 1.0);
  }
`;

export function SkyDome3D() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const {
    skyDarkness,
    skyTopColor,
    skyBottomColor,
    starDensity,
    starBrightness,
    moonPhase,
  } = useSkyboxStore();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSkyDarkness: { value: skyDarkness },
      uSkyTopColor: { value: new THREE.Color(...skyTopColor) },
      uSkyBottomColor: { value: new THREE.Color(...skyBottomColor) },
      uStarDensity: { value: starDensity },
      uStarBrightness: { value: starBrightness },
      uMoonPhase: { value: moonPhase },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth lerp for all uniforms
      const lerpSpeed = delta * 2.0;
      materialRef.current.uniforms.uSkyDarkness.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uSkyDarkness.value,
        skyDarkness,
        lerpSpeed
      );
      materialRef.current.uniforms.uStarDensity.value = starDensity;
      materialRef.current.uniforms.uStarBrightness.value = starBrightness;
      materialRef.current.uniforms.uMoonPhase.value = moonPhase;

      // Update colors
      (materialRef.current.uniforms.uSkyTopColor.value as THREE.Color).setRGB(
        ...skyTopColor
      );
      (materialRef.current.uniforms.uSkyBottomColor.value as THREE.Color).setRGB(
        ...skyBottomColor
      );
    }
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
