"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MoonData } from '@/services/moonApi';

// Vertex shader for glow shell
const glowVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// Fragment shader for crescent-shaped glow
const glowFragmentShader = /* glsl */`
  uniform vec3 uSunDir;
  uniform vec3 uCameraPos;
  uniform float uMoonPhase;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(uCameraPos - vWorldPos);

    // Moon illumination
    float moonIllum = 1.0 - abs(uMoonPhase - 0.5) * 2.0;

    // Where the sphere is lit (N·L > 0)
    float NdotL = dot(N, L);
    float lit = smoothstep(-0.05, 0.1, NdotL);

    // Rim term: strongest where view is tangent to sphere
    float NdotV = dot(N, V);
    float rim = pow(1.0 - clamp(NdotV, 0.0, 1.0), 3.0);

    // Glow = lit side * rim
    // This creates crescent-shaped glow automatically!
    float glow = lit * rim;

    // Scale by overall illumination (less glow near new moon)
    glow *= moonIllum;

    // Glow color (slightly warm white)
    vec3 glowColor = vec3(1.0, 0.98, 0.95);

    // Output with alpha for additive blending
    gl_FragColor = vec4(glowColor * glow, glow);
  }
`;

interface MoonGlowProps {
  moonData: MoonData;
  position: [number, number, number];
  radius: number;
}

export function MoonGlow({ moonData, position, radius }: MoonGlowProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Calculate sun direction from phase
  const sunDir = useMemo(() => {
    const sunAngle = (moonData.phase - 0.5) * 2 * Math.PI;
    return new THREE.Vector3(Math.sin(sunAngle), 0, Math.cos(sunAngle)).normalize();
  }, [moonData.phase]);

  const uniforms = useMemo(() => ({
    uSunDir: { value: sunDir },
    uCameraPos: { value: new THREE.Vector3(0, 0, 5) },
    uMoonPhase: { value: moonData.phase },
  }), []);

  useFrame(({ camera }) => {
    if (materialRef.current) {
      // Update sun direction
      const sunAngle = (moonData.phase - 0.5) * 2 * Math.PI;
      materialRef.current.uniforms.uSunDir.value.set(
        Math.sin(sunAngle), 0, Math.cos(sunAngle)
      ).normalize();

      // Update camera position
      materialRef.current.uniforms.uCameraPos.value.copy(camera.position);

      // Update phase
      materialRef.current.uniforms.uMoonPhase.value = moonData.phase;
    }
  });

  // Glow shell is slightly larger than moon
  const glowRadius = radius * 1.15;

  return (
    <mesh position={position}>
      <sphereGeometry args={[glowRadius, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        transparent={true}
        depthWrite={false}
        depthTest={true}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default MoonGlow;
