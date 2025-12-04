"use client";

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, SMAA } from '@react-three/postprocessing';
import { SMAAPreset } from 'postprocessing';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

// ============================================
// IQ's 2D CLOUDS SHADER - Adapted for Day/Night
// Original: https://www.shadertoy.com/view/4tdSWr
// ============================================

const cloudShaderCode = /* glsl */`
  // Original shader by iq (Inigo Quilez) - "2D Clouds"
  // https://www.shadertoy.com/view/4tdSWr
  // Adapted for day/night theming

  const float cloudscale = 1.1;
  const float clouddark = 0.5;
  const float cloudlight = 0.3;
  const float cloudcover = 0.2;
  const float cloudalpha = 8.0;
  const float skytint = 0.5;

  const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(in vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2
    const float K2 = 0.211324865; // (3-sqrt(3))/6
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 n) {
    float total = 0.0, amplitude = 0.1;
    for (int i = 0; i < 7; i++) {
      total += noise(n) * amplitude;
      n = m * n;
      amplitude *= 0.4;
    }
    return total;
  }

  // Star field function with realistic twinkling
  float stars(vec2 uv, float density, float time) {
    vec2 id = floor(uv * density);
    vec2 gv = fract(uv * density) - 0.5;

    // Random position within cell
    vec2 rnd = hash(id);
    vec2 offset = rnd * 0.4;

    float d = length(gv - offset);

    // Random size and brightness
    float size = 0.015 + fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;
    float baseBrightness = fract(sin(dot(id, vec2(93.9898, 67.345))) * 43758.5453);

    // Realistic twinkling - each star has unique frequency and phase
    float twinkleSpeed = 1.5 + fract(sin(dot(id, vec2(45.233, 89.112))) * 43758.5453) * 3.0;
    float twinklePhase = fract(sin(dot(id, vec2(78.456, 23.789))) * 43758.5453) * 6.28318;
    float twinkle = sin(time * twinkleSpeed + twinklePhase) * 0.4 + 0.6;

    // Add occasional intense flicker
    float flicker = sin(time * twinkleSpeed * 3.7 + twinklePhase * 2.0) * 0.15;
    twinkle += flicker * step(0.85, baseBrightness); // Only bright stars flicker intensely

    // Only show ~30% of potential stars
    float show = step(0.7, baseBrightness);

    float brightness = baseBrightness * twinkle;

    return show * smoothstep(size, 0.0, d) * brightness;
  }

  // Moon function with phase support
  // phase: 0.0 = new moon, 0.5 = full moon, 1.0 = new moon again
  float moon(vec2 uv, vec2 center, float radius, float phase) {
    float d = length(uv - center);
    float moonDisc = smoothstep(radius, radius - 0.003, d);

    // Convert phase to illumination amount
    // 0 = new (0% lit), 0.5 = full (100% lit), 1.0 = new again
    float illum = 1.0 - abs(phase - 0.5) * 2.0; // 0 at new, 1 at full

    // Shadow terminator position (-1 = full shadow on right, 0 = full moon, 1 = full shadow on left)
    float terminator;
    if (phase < 0.5) {
      // Waxing: shadow on left side, shrinking
      terminator = -1.0 + phase * 4.0; // -1 to 1
    } else {
      // Waning: shadow on right side, growing
      terminator = 1.0 - (phase - 0.5) * 4.0; // 1 to -1
    }

    // Calculate shadow using ellipse intersection
    vec2 localUV = (uv - center) / radius;

    // The terminator creates shadow based on x position
    float shadowEdge = terminator;
    float shadow = 1.0;

    if (phase < 0.5) {
      // Waxing: lit from right, shadow on left
      shadow = smoothstep(shadowEdge - 0.1, shadowEdge + 0.1, localUV.x);
    } else {
      // Waning: lit from left, shadow on right
      shadow = smoothstep(shadowEdge + 0.1, shadowEdge - 0.1, localUV.x);
    }

    // Near full moon (illum > 0.9), reduce shadow effect
    shadow = mix(shadow, 1.0, smoothstep(0.85, 1.0, illum));

    // New moon visibility
    float visibility = smoothstep(0.0, 0.1, illum);

    return moonDisc * shadow * visibility;
  }

  // Moon surface texture - procedural craters and maria
  float moonSurface(vec2 uv, vec2 center, float radius) {
    vec2 localUV = (uv - center) / radius;

    // Large dark patches (maria/seas)
    float maria = 0.0;
    maria += smoothstep(0.3, 0.0, length(localUV - vec2(-0.2, 0.1))) * 0.15;
    maria += smoothstep(0.25, 0.0, length(localUV - vec2(0.15, -0.2))) * 0.12;
    maria += smoothstep(0.2, 0.0, length(localUV - vec2(-0.1, -0.25))) * 0.1;
    maria += smoothstep(0.15, 0.0, length(localUV - vec2(0.25, 0.2))) * 0.08;

    // Medium craters
    float craters = 0.0;
    craters += smoothstep(0.08, 0.05, length(localUV - vec2(0.3, 0.1))) * 0.2;
    craters += smoothstep(0.06, 0.03, length(localUV - vec2(-0.35, -0.1))) * 0.18;
    craters += smoothstep(0.07, 0.04, length(localUV - vec2(0.1, 0.35))) * 0.15;
    craters += smoothstep(0.05, 0.02, length(localUV - vec2(-0.2, 0.3))) * 0.12;
    craters += smoothstep(0.04, 0.02, length(localUV - vec2(0.2, -0.35))) * 0.1;

    // Small craters using noise
    float smallCraters = 0.0;
    vec2 craterUV = localUV * 8.0;
    smallCraters += noise(craterUV) * 0.08;
    smallCraters += noise(craterUV * 2.0) * 0.04;

    // Combine: darken for maria/craters
    float surface = 1.0 - maria - craters * 0.5 - max(0.0, smallCraters) * 0.3;

    // Add subtle brightness variation
    float variation = noise(localUV * 3.0) * 0.05 + 0.975;
    surface *= variation;

    return clamp(surface, 0.7, 1.0);
  }

  // Moon glow
  float moonGlow(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    return exp(-d * 3.0 / radius) * 0.5;
  }
`;

// ============================================
// MAIN SKY + CLOUDS COMPONENT
// ============================================
// Calculate moon phase (0-1) based on current date
// 0 = new moon, 0.5 = full moon
function getMoonPhase(): number {
  const now = new Date();
  // Known new moon date: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const lunarCycle = 29.53058867; // days

  const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

  return phase;
}

function IQClouds({ isDark }: { isDark: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const moonPhase = useMemo(() => getMoonPhase(), []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uIsDark.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uIsDark.value,
        isDark ? 1.0 : 0.0,
        delta * 2.0
      );
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIsDark: { value: isDark ? 1.0 : 0.0 },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uMoonPhase: { value: moonPhase },
  }), [moonPhase]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(viewport.width, viewport.height);
    }
  }, [viewport]);

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uIsDark;
          uniform vec2 uResolution;
          uniform float uMoonPhase;
          varying vec2 vUv;

          ${cloudShaderCode}

          void main() {
            vec2 p = vUv;
            vec2 uv = p * vec2(uResolution.x / uResolution.y, 1.0);

            // Random speed variation per cloud area (0.005 to 0.01)
            float speedVariation = noise(uv * 0.5) * 0.5 + 0.5; // 0 to 1
            float speed = mix(0.005, 0.01, speedVariation);
            float time = uTime * speed;

            // === SKY GRADIENT ===
            // Day: Original blue sky from portfolio
            vec3 daySkyColor1 = vec3(0.494, 0.784, 0.890);  // #7EC8E3 - Top
            vec3 daySkyColor2 = vec3(0.616, 0.835, 0.929);  // #9DD5ED
            vec3 daySkyColor3 = vec3(0.722, 0.886, 0.961);  // #B8E2F5
            vec3 daySkyColor4 = vec3(0.831, 0.933, 0.984);  // #D4EEFB
            vec3 daySkyColor5 = vec3(0.918, 0.965, 0.988);  // #EAF6FC - Bottom

            // Night: Original night sky from portfolio (full moon brightness)
            vec3 nightFullColor1 = vec3(0.043, 0.043, 0.102);  // #0B0B1A - Top
            vec3 nightFullColor2 = vec3(0.059, 0.082, 0.145);  // #0F1525
            vec3 nightFullColor3 = vec3(0.075, 0.106, 0.188);  // #131B30
            vec3 nightFullColor4 = vec3(0.094, 0.133, 0.251);  // #182240
            vec3 nightFullColor5 = vec3(0.118, 0.165, 0.290);  // #1E2A4A - Bottom

            // New moon: Much darker sky
            vec3 nightNewColor1 = vec3(0.01, 0.01, 0.03);   // Almost black - Top
            vec3 nightNewColor2 = vec3(0.02, 0.025, 0.05);
            vec3 nightNewColor3 = vec3(0.03, 0.04, 0.07);
            vec3 nightNewColor4 = vec3(0.04, 0.05, 0.09);
            vec3 nightNewColor5 = vec3(0.05, 0.06, 0.11);   // Bottom

            // Moon illumination (0 at new moon, 1 at full moon)
            float moonIllum = 1.0 - abs(uMoonPhase - 0.5) * 2.0;

            // Interpolate night colors based on moon phase
            vec3 nightSkyColor1 = mix(nightNewColor1, nightFullColor1, moonIllum);
            vec3 nightSkyColor2 = mix(nightNewColor2, nightFullColor2, moonIllum);
            vec3 nightSkyColor3 = mix(nightNewColor3, nightFullColor3, moonIllum);
            vec3 nightSkyColor4 = mix(nightNewColor4, nightFullColor4, moonIllum);
            vec3 nightSkyColor5 = mix(nightNewColor5, nightFullColor5, moonIllum);

            // 5-stop gradient interpolation
            vec3 dayGradient, nightGradient;
            if (p.y > 0.75) {
              float t = (p.y - 0.75) / 0.25;
              dayGradient = mix(daySkyColor2, daySkyColor1, t);
              nightGradient = mix(nightSkyColor2, nightSkyColor1, t);
            } else if (p.y > 0.5) {
              float t = (p.y - 0.5) / 0.25;
              dayGradient = mix(daySkyColor3, daySkyColor2, t);
              nightGradient = mix(nightSkyColor3, nightSkyColor2, t);
            } else if (p.y > 0.25) {
              float t = (p.y - 0.25) / 0.25;
              dayGradient = mix(daySkyColor4, daySkyColor3, t);
              nightGradient = mix(nightSkyColor4, nightSkyColor3, t);
            } else {
              float t = p.y / 0.25;
              dayGradient = mix(daySkyColor5, daySkyColor4, t);
              nightGradient = mix(nightSkyColor5, nightSkyColor4, t);
            }

            vec3 skycolour = mix(dayGradient, nightGradient, uIsDark);

            // === STARS (night only) ===
            float starField = 0.0;
            if (uIsDark > 0.01) {
              // Multiple star layers for depth - each with independent twinkling
              starField += stars(uv + vec2(0.0), 50.0, uTime);           // Bright stars
              starField += stars(uv + vec2(100.0), 80.0, uTime) * 0.7;   // Medium stars
              starField += stars(uv + vec2(200.0), 120.0, uTime) * 0.5;  // Dim distant stars
              starField += stars(uv + vec2(300.0), 200.0, uTime) * 0.3;  // Very faint stars

              starField *= uIsDark; // Fade with theme
            }

            // === MOON (night only) ===
            vec2 moonPos = vec2(0.75, 0.75); // Top right
            float moonRadius = 0.06;
            float moonShape = 0.0;
            float moonGlowEffect = 0.0;

            if (uIsDark > 0.01) {
              moonShape = moon(uv, moonPos, moonRadius, uMoonPhase);
              moonGlowEffect = moonGlow(uv, moonPos, moonRadius);
              // Reduce glow for new moon phases
              float glowIntensity = 1.0 - abs(uMoonPhase - 0.5) * 1.5;
              glowIntensity = clamp(glowIntensity, 0.1, 1.0);
              moonGlowEffect *= glowIntensity;
              moonShape *= uIsDark;
              moonGlowEffect *= uIsDark;
            }

            // === CLOUDS (iq's algorithm) ===
            float q = fbm(uv * cloudscale * 0.5);

            // Ridged noise shape
            float r = 0.0;
            vec2 cloudUv = uv * cloudscale;
            cloudUv -= q - time;
            float weight = 0.8;
            for (int i = 0; i < 8; i++) {
              r += abs(weight * noise(cloudUv));
              cloudUv = m * cloudUv + time;
              weight *= 0.7;
            }

            // Noise shape
            float f = 0.0;
            cloudUv = uv * cloudscale;
            cloudUv -= q - time;
            weight = 0.7;
            for (int i = 0; i < 8; i++) {
              f += weight * noise(cloudUv);
              cloudUv = m * cloudUv + time;
              weight *= 0.6;
            }

            f *= r + f;

            // Noise colour
            float c = 0.0;
            float time2 = uTime * speed * 2.0;
            cloudUv = uv * cloudscale * 2.0;
            cloudUv -= q - time2;
            weight = 0.4;
            for (int i = 0; i < 7; i++) {
              c += weight * noise(cloudUv);
              cloudUv = m * cloudUv + time2;
              weight *= 0.6;
            }

            // Noise ridge colour
            float c1 = 0.0;
            float time3 = uTime * speed * 3.0;
            cloudUv = uv * cloudscale * 3.0;
            cloudUv -= q - time3;
            weight = 0.4;
            for (int i = 0; i < 7; i++) {
              c1 += abs(weight * noise(cloudUv));
              cloudUv = m * cloudUv + time3;
              weight *= 0.6;
            }

            c += c1;

            // Cloud colour - white for day, dark blue-gray for night
            vec3 dayCloudColor = vec3(1.1, 1.1, 0.9);
            vec3 nightCloudColor = vec3(0.08, 0.10, 0.15);
            vec3 cloudcolour = mix(dayCloudColor, nightCloudColor, uIsDark);
            cloudcolour *= clamp((clouddark + cloudlight * c), 0.0, 1.0);

            // Cloud coverage - slightly less at night
            float coverDay = cloudcover;
            float coverNight = cloudcover * 0.7;
            float cover = mix(coverDay, coverNight, uIsDark);

            f = cover + cloudalpha * f * r;

            // === FINAL COMPOSITION ===
            float cloudDensity = clamp(f + c, 0.0, 1.0);
            float cloudOpacity = smoothstep(0.0, 0.6, cloudDensity);

            // Cloud blocking - gradual for thin clouds, full block for thick clouds
            float cloudBlock = smoothstep(0.1, 0.6, cloudDensity); // 0 = clear, 1 = blocked

            // Base sky
            vec3 result = skycolour;

            // === STARS - fade through thin clouds, blocked by thick ===
            float starVisibility = 1.0 - cloudBlock;
            result += vec3(starField) * starVisibility;

            // === MOON ===
            vec3 baseMoonColor = vec3(0.95, 0.95, 0.85);
            vec3 moonGlowColor = vec3(0.9, 0.9, 0.8);

            if (uIsDark > 0.01) {
              // Get moon surface texture
              float surface = moonSurface(uv, moonPos, moonRadius);
              vec3 moonColor = baseMoonColor * surface;

              // Add slight color variation to maria (darker, slightly blue-gray)
              vec2 localMoonUV = (uv - moonPos) / moonRadius;
              float mariaColor = smoothstep(0.3, 0.0, length(localMoonUV - vec2(-0.2, 0.1)));
              mariaColor += smoothstep(0.25, 0.0, length(localMoonUV - vec2(0.15, -0.2)));
              moonColor = mix(moonColor, moonColor * vec3(0.85, 0.87, 0.9), mariaColor * 0.3);

              // Moon fades through thin clouds, blocked by thick
              float moonVis = moonShape * (1.0 - cloudBlock);
              result = mix(result, moonColor, moonVis);

              // Moon glow - fades with clouds
              float glowVis = moonGlowEffect * (1.0 - cloudBlock) * 0.3;
              result += moonGlowColor * glowVis;
            }

            // === CLOUDS rendered ON TOP of everything ===
            if (uIsDark > 0.01) {
              // Night clouds - use skytint
              vec3 nightCloudFinal = clamp(skytint * skycolour + cloudcolour, 0.0, 1.0);
              result = mix(result, nightCloudFinal, cloudOpacity);
            } else {
              // Day clouds - pure bright white
              vec3 pureWhite = vec3(1.0, 1.0, 0.98);
              result = mix(result, pureWhite, cloudOpacity * 0.9);
            }

            // Global darkening - only for night, none for day
            float darkenFactor = mix(1.0, 0.6, uIsDark);
            result *= darkenFactor;

            gl_FragColor = vec4(result, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// ============================================
// POST-PROCESSING EFFECTS
// ============================================
function PostProcessing({ isDark }: { isDark: boolean }) {
  return (
    <EffectComposer multisampling={8}>
      {/* SMAA Antialiasing - high quality */}
      <SMAA preset={SMAAPreset.ULTRA} />
    </EffectComposer>
  );
}

// ============================================
// MAIN EXPORT - Fullscreen fixed
// ============================================
export default function SkyBackground() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className="sky-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          antialias: false, // Handled by SMAA
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={[1, 2]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <IQClouds isDark={isDarkMode} />
        <PostProcessing isDark={isDarkMode} />
      </Canvas>
    </div>
  );
}
