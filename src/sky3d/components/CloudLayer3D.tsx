"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSkyboxStore } from '../store/useSkyboxStore';
import { fbmGLSL } from '../shaders/shared.glsl';

// Vertex shader
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

// Fragment shader: clouds on a dome
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSkyDarkness;
  uniform float uCloudDensity;
  uniform float uCloudSpeed;
  uniform float uCloudMode; // 0 = artistic, 1 = realistic

  varying vec3 vDir;
  varying vec2 vUv;

  const float PI = 3.14159265359;

  const float cloudscale = 1.1;
  const float clouddark = 0.5;
  const float cloudlight = 0.3;
  const float cloudcover = 0.2;
  const float cloudalpha = 8.0;
  const float skytint = 0.5;

  ${fbmGLSL}

  void main() {
    vec3 dir = normalize(vDir);

    // Map direction to cloud UV
    float u = atan(dir.x, dir.z) / (2.0 * PI) + 0.5;
    float v = dir.y * 0.5 + 0.5;
    vec2 cloudUv = vec2(u * 2.0, v); // Stretch for dome coverage

    // Cloud speed varies per area
    float speedVariation = noise(cloudUv * 0.5) * 0.5 + 0.5;
    float speed = mix(0.005, 0.01, speedVariation) * uCloudSpeed / 0.008;
    float time = uTime * speed;

    // Select transform matrix based on mode
    mat2 cloudMatrix = uCloudMode > 0.5 ? mRealistic : mArtistic;

    // Horizontal drift
    vec2 drift = vec2(time, 0.0);

    float q = fbm((cloudUv + drift * 0.5) * cloudscale * 0.5);

    // Ridged noise
    float r = 0.0;
    vec2 cuv = (cloudUv + drift) * cloudscale;
    cuv -= q;
    float weight = 0.8;
    for (int i = 0; i < 8; i++) {
      r += abs(weight * noise(cuv));
      cuv = cloudMatrix * cuv;
      weight *= 0.7;
    }

    // Noise shape
    float f = 0.0;
    cuv = (cloudUv + drift) * cloudscale;
    cuv -= q;
    weight = 0.7;
    for (int i = 0; i < 8; i++) {
      f += weight * noise(cuv);
      cuv = cloudMatrix * cuv;
      weight *= 0.6;
    }
    f *= r + f;

    // Noise colour
    float c = 0.0;
    vec2 drift2 = vec2(time * 1.2, 0.0);
    cuv = (cloudUv + drift2) * cloudscale * 2.0;
    cuv -= q;
    weight = 0.4;
    for (int i = 0; i < 7; i++) {
      c += weight * noise(cuv);
      cuv = cloudMatrix * cuv;
      weight *= 0.6;
    }

    float c1 = 0.0;
    vec2 drift3 = vec2(time * 1.5, 0.0);
    cuv = (cloudUv + drift3) * cloudscale * 3.0;
    cuv -= q;
    weight = 0.4;
    for (int i = 0; i < 7; i++) {
      c1 += abs(weight * noise(cuv));
      cuv = cloudMatrix * cuv;
      weight *= 0.6;
    }
    c += c1;

    // Cloud colour
    vec3 dayCloudColor = vec3(0.95, 0.97, 1.0);
    vec3 nightCloudColor = vec3(0.08, 0.10, 0.15);
    vec3 cloudcolour = mix(dayCloudColor, nightCloudColor, uSkyDarkness);
    cloudcolour *= clamp((clouddark + cloudlight * c), 0.0, 1.0);

    // Coverage
    float cover = mix(cloudcover, cloudcover * 0.7, uSkyDarkness);
    cover *= uCloudDensity;
    f = cover + cloudalpha * f * r;

    float cloudDensity = clamp(f + c, 0.0, 1.0);
    float cloudOpacity = smoothstep(0.0, 0.6, cloudDensity);

    // Fade clouds near horizon (bottom of dome)
    float horizonFade = smoothstep(0.1, 0.4, v);
    cloudOpacity *= horizonFade;

    gl_FragColor = vec4(cloudcolour, cloudOpacity * 0.85);
  }
`;

export function CloudLayer3D() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { skyDarkness, cloudDensity, cloudSpeed, cloudMode } = useSkyboxStore();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSkyDarkness: { value: skyDarkness },
      uCloudDensity: { value: cloudDensity },
      uCloudSpeed: { value: cloudSpeed },
      uCloudMode: { value: cloudMode === 'realistic' ? 1.0 : 0.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth lerp
      const lerpSpeed = delta * 2.0;
      materialRef.current.uniforms.uSkyDarkness.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uSkyDarkness.value,
        skyDarkness,
        lerpSpeed
      );
      materialRef.current.uniforms.uCloudDensity.value = cloudDensity;
      materialRef.current.uniforms.uCloudSpeed.value = cloudSpeed;
      materialRef.current.uniforms.uCloudMode.value =
        cloudMode === 'realistic' ? 1.0 : 0.0;
    }
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[45, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
