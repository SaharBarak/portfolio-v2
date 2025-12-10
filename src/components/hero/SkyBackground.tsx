"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { EffectComposer, SMAA, Bloom } from '@react-three/postprocessing';
import { SMAAPreset } from 'postprocessing';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import StarMap from './StarMap';
import SkyToolbar from './SkyToolbar';
import SocialButton from './SocialButton';
import { getMoonData, type MoonData } from '@/services/moonApi';
import type { CloudMode } from '@/contexts/ThemeContext';

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

  // Artistic mode: rotation + scale matrix (creates swirling artistic clouds)
  const mat2 mArtistic = mat2(1.6, 1.2, -1.2, 1.6);
  // Realistic mode: pure scale matrix (creates natural horizontal clouds)
  const mat2 mRealistic = mat2(2.0, 0.0, 0.0, 2.0);

  // Legacy alias - will be overridden by cloudMatrix in main
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

  // Background procedural stars - plain points, no glow (not interactive)
  float bgStars(vec2 uv, float density, float time) {
    vec2 id = floor(uv * density);
    vec2 gv = fract(uv * density) - 0.5;
    vec2 rnd = hash(id);
    vec2 offset = rnd * 0.4;
    float d = length(gv - offset);
    float size = 0.02 + fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453) * 0.03;
    float baseBrightness = fract(sin(dot(id, vec2(93.9898, 67.345))) * 43758.5453);

    // Subtle twinkle
    float twinkleSpeed = 1.0 + fract(sin(dot(id, vec2(45.233, 89.112))) * 43758.5453) * 2.0;
    float twinklePhase = fract(sin(dot(id, vec2(78.456, 23.789))) * 43758.5453) * 6.28318;
    float twinkle = sin(time * twinkleSpeed + twinklePhase) * 0.15 + 0.85;

    // Show 50% of stars - denser field
    float show = step(0.5, baseBrightness);

    // Plain star point - brighter
    float star = smoothstep(size, 0.0, d) * baseBrightness * twinkle * 1.8;

    return show * star;
  }

  // Distance from point to line segment
  float distToLine(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  // Bright catalog star - tiny point with 4-point tessellation twinkle
  vec3 brightStar(vec2 uv, vec2 pos, float brightness, vec3 color, float size, float time, float phase) {
    vec2 delta = uv - pos;
    float d = length(delta);

    // Twinkle animation
    float twinkle = sin(time * 2.0 + phase) * 0.12 + 0.88;
    twinkle *= sin(time * 3.1 + phase * 1.7) * 0.08 + 0.92;

    // Tiny star core
    float core = smoothstep(size * 0.5, 0.0, d) * brightness * twinkle;

    // 4-point star rays (very subtle tessellation)
    float rayIntensity = brightness * 0.06 * twinkle;
    float rayLength = size * 4.0;
    float rayWidth = size * 0.3;

    // Horizontal and vertical rays
    float hRay = exp(-abs(delta.y) / rayWidth) * exp(-abs(delta.x) / rayLength);
    float vRay = exp(-abs(delta.x) / rayWidth) * exp(-abs(delta.y) / rayLength);
    float rays = (hRay + vRay) * rayIntensity;

    // Tiny soft glow (much smaller)
    float glow = exp(-d * 200.0) * brightness * 0.08 * twinkle;

    return color * (core + rays + glow);
  }

  // Catalog stars rendered in shader (so clouds can occlude them)
  // starOffset: 0-1 value that shifts stars horizontally based on date
  // Positions from Celestial Data Project (HYG Database) - astronomical accuracy
  vec3 shaderCatalogStars(vec2 uv, float time, float starOffset) {
    vec3 result = vec3(0.0);

    // Spectral colors
    vec3 colO = vec3(0.61, 0.69, 1.0);  // O-type blue
    vec3 colB = vec3(0.67, 0.75, 1.0);  // B-type blue-white
    vec3 colA = vec3(0.79, 0.84, 1.0);  // A-type white
    vec3 colF = vec3(0.97, 0.97, 1.0);  // F-type yellow-white
    vec3 colG = vec3(1.0, 0.96, 0.92);  // G-type yellow
    vec3 colK = vec3(1.0, 0.82, 0.63);  // K-type orange
    vec3 colM = vec3(1.0, 0.80, 0.44);  // M-type red-orange

    #define STAR_POS(x, y) vec2(fract((x) + starOffset), (y))

    // === BRIGHTEST STARS (mag < 2) ===
    result += brightStar(uv, STAR_POS(0.781, 0.407), 1.00, colA, 0.0020, time, 0.0);  // Sirius
    result += brightStar(uv, STAR_POS(0.767, 0.207), 1.00, colA, 0.0020, time, 0.3);  // Canopus
    result += brightStar(uv, STAR_POS(0.094, 0.607), 1.00, colK, 0.0020, time, 0.6);  // Arcturus
    result += brightStar(uv, STAR_POS(0.276, 0.715), 0.90, colA, 0.0018, time, 1.2);  // Vega
    result += brightStar(uv, STAR_POS(0.720, 0.756), 0.90, colG, 0.0018, time, 1.5);  // Capella
    result += brightStar(uv, STAR_POS(0.718, 0.454), 0.90, colB, 0.0018, time, 1.8);  // Rigel
    result += brightStar(uv, STAR_POS(0.819, 0.529), 0.90, colF, 0.0018, time, 2.1);  // Procyon
    result += brightStar(uv, STAR_POS(0.747, 0.541), 0.90, colM, 0.0018, time, 2.7);  // Betelgeuse
    result += brightStar(uv, STAR_POS(0.327, 0.549), 0.90, colA, 0.0018, time, 3.3);  // Altair
    result += brightStar(uv, STAR_POS(0.692, 0.592), 0.90, colM, 0.0018, time, 3.9);  // Aldebaran
    result += brightStar(uv, STAR_POS(0.059, 0.438), 0.90, colB, 0.0018, time, 4.2);  // Spica
    result += brightStar(uv, STAR_POS(0.187, 0.353), 0.70, colM, 0.0014, time, 4.5);  // Antares
    result += brightStar(uv, STAR_POS(0.823, 0.656), 0.70, colK, 0.0014, time, 4.8);  // Pollux
    result += brightStar(uv, STAR_POS(0.457, 0.335), 0.70, colA, 0.0014, time, 5.1);  // Fomalhaut
    result += brightStar(uv, STAR_POS(0.362, 0.752), 0.70, colA, 0.0014, time, 5.7);  // Deneb
    result += brightStar(uv, STAR_POS(0.922, 0.566), 0.70, colB, 0.0014, time, 0.3);  // Regulus
    result += brightStar(uv, STAR_POS(0.816, 0.677), 0.70, colA, 0.0014, time, 0.9);  // Castor
    result += brightStar(uv, STAR_POS(0.232, 0.294), 0.70, colB, 0.0014, time, 1.5);  // Shaula
    result += brightStar(uv, STAR_POS(0.726, 0.535), 0.70, colB, 0.0014, time, 1.8);  // Bellatrix
    result += brightStar(uv, STAR_POS(0.727, 0.659), 0.70, colB, 0.0014, time, 2.1);  // Elnath
    result += brightStar(uv, STAR_POS(0.733, 0.493), 0.70, colB, 0.0014, time, 2.7);  // Alnilam
    result += brightStar(uv, STAR_POS(0.737, 0.489), 0.70, colB, 0.0014, time, 3.3);  // Alnitak
    result += brightStar(uv, STAR_POS(0.038, 0.811), 0.70, colB, 0.0014, time, 3.9);  // Alioth
    result += brightStar(uv, STAR_POS(0.642, 0.777), 0.70, colF, 0.0014, time, 4.2);  // Mirfak
    result += brightStar(uv, STAR_POS(0.961, 0.843), 0.70, colK, 0.0014, time, 4.8);  // Dubhe
    result += brightStar(uv, STAR_POS(0.075, 0.774), 0.70, colB, 0.0014, time, 5.4);  // Alkaid
    result += brightStar(uv, STAR_POS(0.750, 0.750), 0.70, colA, 0.0014, time, 0.3);  // Menkalinan
    result += brightStar(uv, STAR_POS(0.776, 0.591), 0.70, colA, 0.0014, time, 0.9);  // Alhena
    result += brightStar(uv, STAR_POS(0.605, 0.996), 0.70, colG, 0.0014, time, 1.8);  // Polaris

    // === MEDIUM BRIGHT STARS (mag 2-3) ===
    result += brightStar(uv, STAR_POS(0.588, 0.630), 0.50, colK, 0.0010, time, 2.7);  // Hamal
    result += brightStar(uv, STAR_POS(0.931, 0.610), 0.50, colK, 0.0010, time, 3.0);  // Algieba
    result += brightStar(uv, STAR_POS(0.506, 0.662), 0.50, colB, 0.0010, time, 4.2);  // Alpheratz
    result += brightStar(uv, STAR_POS(0.548, 0.698), 0.50, colM, 0.0010, time, 4.5);  // Mirach
    result += brightStar(uv, STAR_POS(0.741, 0.446), 0.50, colB, 0.0010, time, 4.8);  // Saiph
    result += brightStar(uv, STAR_POS(0.119, 0.912), 0.50, colM, 0.0010, time, 5.1);  // Kochab
    result += brightStar(uv, STAR_POS(0.233, 0.570), 0.50, colA, 0.0010, time, 5.7);  // Rasalhague
    result += brightStar(uv, STAR_POS(0.631, 0.728), 0.50, colA, 0.0010, time, 0.0);  // Algol
    result += brightStar(uv, STAR_POS(0.992, 0.581), 0.50, colA, 0.0010, time, 0.6);  // Denebola
    result += brightStar(uv, STAR_POS(0.539, 0.837), 0.50, colB, 0.0010, time, 0.9);  // Navi (Cassiopeia)
    result += brightStar(uv, STAR_POS(0.149, 0.648), 0.50, colA, 0.0010, time, 2.1);  // Alphecca
    result += brightStar(uv, STAR_POS(0.058, 0.805), 0.50, colA, 0.0010, time, 2.7);  // Mizar
    result += brightStar(uv, STAR_POS(0.349, 0.724), 0.50, colG, 0.0010, time, 3.0);  // Sadr
    result += brightStar(uv, STAR_POS(0.528, 0.814), 0.50, colK, 0.0010, time, 3.3);  // Shedar
    result += brightStar(uv, STAR_POS(0.248, 0.786), 0.50, colM, 0.0010, time, 3.6);  // Eltanin
    result += brightStar(uv, STAR_POS(0.731, 0.498), 0.50, colB, 0.0010, time, 3.9);  // Mintaka
    result += brightStar(uv, STAR_POS(0.506, 0.829), 0.50, colF, 0.0010, time, 4.2);  // Caph
    result += brightStar(uv, STAR_POS(0.960, 0.813), 0.50, colA, 0.0010, time, 5.4);  // Merak
    result += brightStar(uv, STAR_POS(0.115, 0.650), 0.50, colK, 0.0010, time, 5.7);  // Izar
    result += brightStar(uv, STAR_POS(0.406, 0.555), 0.50, colM, 0.0010, time, 0.0);  // Enif
    result += brightStar(uv, STAR_POS(0.996, 0.798), 0.50, colA, 0.0010, time, 0.9);  // Phecda
    result += brightStar(uv, STAR_POS(0.461, 0.656), 0.50, colM, 0.0010, time, 1.5);  // Scheat
    result += brightStar(uv, STAR_POS(0.462, 0.584), 0.50, colA, 0.0010, time, 3.0);  // Markab
    result += brightStar(uv, STAR_POS(0.968, 0.614), 0.50, colA, 0.0010, time, 4.2);  // Zosma
    result += brightStar(uv, STAR_POS(0.509, 0.584), 0.50, colB, 0.0010, time, 2.1);  // Algenib
    result += brightStar(uv, STAR_POS(0.658, 0.634), 0.50, colB, 0.0010, time, 3.3);  // Alcyone
    result += brightStar(uv, STAR_POS(0.043, 0.561), 0.50, colK, 0.0010, time, 3.6);  // Vindemiatrix

    // === DIMMER STARS (mag 3-3.5) ===
    result += brightStar(uv, STAR_POS(0.291, 0.682), 0.35, colB, 0.0007, time, 0.3);  // Sulafat
    result += brightStar(uv, STAR_POS(0.313, 0.655), 0.35, colK, 0.0007, time, 0.3);  // Albireo
    result += brightStar(uv, STAR_POS(0.324, 0.559), 0.50, colM, 0.0010, time, 3.3);  // Tarazed
    result += brightStar(uv, STAR_POS(0.029, 0.492), 0.50, colF, 0.0010, time, 4.2);  // Porrima
    result += brightStar(uv, STAR_POS(0.011, 0.817), 0.35, colA, 0.0007, time, 2.1);  // Megrez
    result += brightStar(uv, STAR_POS(0.560, 0.835), 0.50, colA, 0.0010, time, 1.5);  // Ruchbah
    result += brightStar(uv, STAR_POS(0.080, 0.602), 0.50, colG, 0.0010, time, 1.8);  // Muphrid
    result += brightStar(uv, STAR_POS(0.579, 0.854), 0.35, colB, 0.0007, time, 3.3);  // Segin
    result += brightStar(uv, STAR_POS(0.229, 0.791), 0.50, colK, 0.0010, time, 0.6);  // Rastaban
    result += brightStar(uv, STAR_POS(0.142, 0.828), 0.35, colK, 0.0007, time, 1.2);  // Edasich
    result += brightStar(uv, STAR_POS(0.066, 0.497), 0.35, colA, 0.0007, time, 5.1);  // Heze
    result += brightStar(uv, STAR_POS(0.039, 0.519), 0.35, colM, 0.0007, time, 5.7);  // Minelauva
    result += brightStar(uv, STAR_POS(0.126, 0.724), 0.35, colK, 0.0007, time, 4.2);  // Nekkar

    #undef STAR_POS

    return result;
  }

  // Moon function with phase support, 3D spherical shading
  // phase: 0.0 = new moon, 0.5 = full moon, 1.0 = new moon again
  // Returns vec4: x = sunlit portion brightness, y = dark side mask (for earthshine), z = limb darkening, w = moon disc mask
  vec4 moonWith3D(vec2 uv, vec2 center, float radius, float phase) {
    float d = length(uv - center);
    float moonDisc = smoothstep(radius, radius - 0.002, d);

    if (moonDisc < 0.001) {
      return vec4(0.0, 0.0, 1.0, 0.0); // Outside moon
    }

    // Convert phase to illumination amount
    float illum = 1.0 - abs(phase - 0.5) * 2.0; // 0 at new, 1 at full

    vec2 localUV = (uv - center) / radius;

    // === 3D SPHERE GEOMETRY ===
    float r2 = dot(localUV, localUV);
    if (r2 > 1.0) {
      return vec4(0.0, 0.0, 1.0, 0.0); // Outside moon
    }
    float z = sqrt(1.0 - r2);

    // Sphere normal
    vec3 normal = vec3(localUV.x, localUV.y, z);

    // === SUN DIRECTION based on phase ===
    float sunAngle = (phase - 0.5) * 2.0 * 3.14159;
    vec3 sunDir = normalize(vec3(sin(sunAngle), 0.0, cos(sunAngle)));

    // Dot product for lighting
    float NdotL = dot(normal, sunDir);

    // === TERMINATOR (day/night line) ===
    float sunlit = smoothstep(-0.02, 0.02, NdotL);

    // === 3D SHADING for lit side ===
    float diffuse = max(0.0, NdotL);
    float shading3D = mix(0.7, 1.0, diffuse);

    // === LIMB DARKENING ===
    float limbDarkening = pow(z, 0.4);
    limbDarkening = mix(0.6, 1.0, limbDarkening);

    // Subtle rim highlight on lit side
    float rim = pow(1.0 - z, 2.5) * max(0.0, NdotL) * 0.15;

    // Final sunlit brightness
    float sunlitBrightness = sunlit * shading3D * limbDarkening + rim;

    // Dark side mask (inverse of sunlit, with soft edge)
    float darkSide = (1.0 - sunlit) * moonDisc;

    return vec4(sunlitBrightness * moonDisc, darkSide, limbDarkening, moonDisc);
  }

  // Moon surface texture - procedural craters and maria
  // Now with libration offset and light-responsive crater shadows
  // Returns vec2: x = surface albedo, y = normal perturbation for shadows
  vec2 moonSurfaceWithNormal(vec2 uv, vec2 center, float radius, float libLon, float libLat, float posAngle, vec3 sunDir) {
    vec2 localUV = (uv - center) / radius;

    // Apply position angle rotation (rotate the moon's orientation as seen from Earth)
    float angleRad = posAngle * 3.14159 / 180.0;
    float cosA = cos(angleRad);
    float sinA = sin(angleRad);
    vec2 rotatedUV = vec2(
      localUV.x * cosA - localUV.y * sinA,
      localUV.x * sinA + localUV.y * cosA
    );

    // Apply libration offset
    float libScale = 0.055;
    vec2 librationOffset = vec2(
      -libLon * libScale,
      -libLat * libScale
    );

    vec2 surfaceUV = rotatedUV + librationOffset;

    // === MARIA (dark seas) ===
    float maria = 0.0;
    maria += smoothstep(0.3, 0.0, length(surfaceUV - vec2(0.15, 0.0))) * 0.15;   // Tranquillitatis
    maria += smoothstep(0.22, 0.0, length(surfaceUV - vec2(0.2, 0.2))) * 0.12;   // Serenitatis
    maria += smoothstep(0.28, 0.0, length(surfaceUV - vec2(-0.2, 0.15))) * 0.14; // Imbrium
    maria += smoothstep(0.35, 0.0, length(surfaceUV - vec2(-0.35, -0.1))) * 0.13; // Procellarum
    maria += smoothstep(0.18, 0.0, length(surfaceUV - vec2(0.05, -0.25))) * 0.10; // Nectaris

    // === MAJOR CRATERS with 3D relief ===
    float craterShading = 0.0;
    float craterAlbedo = 0.0;
    vec2 shadowDir = vec2(-sunDir.x, -sunDir.y);

    // Tycho (large southern crater with rays)
    vec2 tychoPos = vec2(-0.05, -0.45);
    float tychoDist = length(surfaceUV - tychoPos);
    float tychoRim = smoothstep(0.09, 0.07, tychoDist) * smoothstep(0.05, 0.07, tychoDist);
    float tychoFloor = smoothstep(0.05, 0.02, tychoDist);
    float tychoShadowDist = length(surfaceUV - tychoPos + shadowDir * 0.015);
    float tychoShadow = smoothstep(0.08, 0.04, tychoShadowDist) * 0.4;
    craterShading += tychoRim * 0.15 - tychoShadow;
    craterAlbedo += tychoFloor * 0.08;

    // Copernicus
    vec2 copPos = vec2(-0.15, 0.05);
    float copDist = length(surfaceUV - copPos);
    float copRim = smoothstep(0.08, 0.06, copDist) * smoothstep(0.04, 0.06, copDist);
    float copFloor = smoothstep(0.04, 0.015, copDist);
    float copShadowDist = length(surfaceUV - copPos + shadowDir * 0.012);
    float copShadow = smoothstep(0.07, 0.03, copShadowDist) * 0.35;
    craterShading += copRim * 0.12 - copShadow;
    craterAlbedo += copFloor * 0.06;

    // Kepler
    vec2 kepPos = vec2(-0.35, 0.05);
    float kepDist = length(surfaceUV - kepPos);
    float kepRim = smoothstep(0.06, 0.045, kepDist) * smoothstep(0.03, 0.045, kepDist);
    float kepFloor = smoothstep(0.03, 0.01, kepDist);
    float kepShadowDist = length(surfaceUV - kepPos + shadowDir * 0.01);
    float kepShadow = smoothstep(0.055, 0.025, kepShadowDist) * 0.3;
    craterShading += kepRim * 0.1 - kepShadow;
    craterAlbedo += kepFloor * 0.05;

    // Plato region
    vec2 platoPos = vec2(0.3, 0.25);
    float platoDist = length(surfaceUV - platoPos);
    float platoRim = smoothstep(0.07, 0.055, platoDist) * smoothstep(0.035, 0.055, platoDist);
    float platoFloor = smoothstep(0.035, 0.015, platoDist);
    float platoShadowDist = length(surfaceUV - platoPos + shadowDir * 0.01);
    float platoShadow = smoothstep(0.06, 0.03, platoShadowDist) * 0.25;
    craterShading += platoRim * 0.08 - platoShadow;
    craterAlbedo += platoFloor * 0.04;

    // === SMALL CRATERS (noise-based) ===
    vec2 craterUV = surfaceUV * 8.0;
    float n1 = noise(craterUV);
    float n2 = noise(craterUV * 2.0);
    float smallCraterNoise = n1 * 0.06 + n2 * 0.03;

    // === COMBINE SURFACE ===
    float surface = 1.0 - maria - craterAlbedo - max(0.0, smallCraterNoise) * 0.2;

    // Add brightness variation
    float variation = noise(surfaceUV * 3.0) * 0.04 + 0.98;
    surface *= variation;

    // Normal perturbation for 3D shading (crater shadows)
    float normalPerturb = craterShading;

    return vec2(clamp(surface, 0.65, 1.0), normalPerturb);
  }

  // Legacy wrapper for compatibility
  float moonSurface(vec2 uv, vec2 center, float radius, float libLon, float libLat, float posAngle) {
    vec3 defaultSunDir = vec3(0.0, 0.0, 1.0);
    return moonSurfaceWithNormal(uv, center, radius, libLon, libLat, posAngle, defaultSunDir).x;
  }

  // Moon glow - intense halo
  float moonGlow(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    // Multiple glow layers for more intensity
    float innerGlow = exp(-d * 4.0 / radius) * 0.8;
    float outerGlow = exp(-d * 1.5 / radius) * 0.4;
    float wideGlow = exp(-d * 0.8 / radius) * 0.2;
    return innerGlow + outerGlow + wideGlow;
  }

`;

// ============================================
// MAIN SKY + CLOUDS COMPONENT
// ============================================

interface IQCloudsProps {
  isDark: boolean;
  moonData: MoonData;
  currentDate: Date;
  constellationLines: { x1: number; y1: number; x2: number; y2: number }[];
  constellationStars: { x: number; y: number }[];
  constellationFade: number;
  cloudMode: 'artistic' | 'realistic';
  isMobile: boolean;
}

function IQClouds({ isDark, moonData, currentDate, constellationLines, constellationStars, constellationFade, cloudMode, isMobile }: IQCloudsProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Smooth interpolation refs for moon and star positions
  const smoothMoonDataRef = useRef({
    phase: moonData.phase,
    librationLon: moonData.librationLon,
    librationLat: moonData.librationLat,
    positionAngle: moonData.positionAngle,
    altitude: moonData.altitude,
    azimuth: moonData.azimuth,
    hourAngle: moonData.hourAngle,
  });
  const smoothStarOffsetRef = useRef(0);

  // Calculate star offset based on date
  // Stars move ~1 degree per day (360/365), normalized to 0-1 range
  const referenceDate = new Date('2024-01-01').getTime();
  const daysSinceRef = (currentDate.getTime() - referenceDate) / (1000 * 60 * 60 * 24);
  const starOffset = (daysSinceRef / 365) % 1; // Full cycle per year

  // Prepare constellation line data for shader (max 10 lines)
  const lineData = new Float32Array(40); // 10 lines * 4 floats (x1, y1, x2, y2)
  constellationLines.slice(0, 10).forEach((line, i) => {
    lineData[i * 4] = line.x1;
    lineData[i * 4 + 1] = line.y1;
    lineData[i * 4 + 2] = line.x2;
    lineData[i * 4 + 3] = line.y2;
  });

  // Prepare constellation star data for shader (max 10 stars)
  const starData = new Float32Array(20); // 10 stars * 2 floats (x, y)
  constellationStars.slice(0, 10).forEach((star, i) => {
    starData[i * 2] = star.x;
    starData[i * 2 + 1] = star.y;
  });

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smooth transition over ~2-3 seconds
      materialRef.current.uniforms.uIsDark.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uIsDark.value,
        isDark ? 1.0 : 0.0,
        delta * 0.8
      );

      // Smooth interpolation for moon data (prevents jumping when toolbar changes)
      const lerpSpeed = delta * 3.0; // Smooth ~0.3s transition
      const smooth = smoothMoonDataRef.current;

      smooth.phase = THREE.MathUtils.lerp(smooth.phase, moonData.phase, lerpSpeed);
      smooth.librationLon = THREE.MathUtils.lerp(smooth.librationLon, moonData.librationLon, lerpSpeed);
      smooth.librationLat = THREE.MathUtils.lerp(smooth.librationLat, moonData.librationLat, lerpSpeed);
      smooth.positionAngle = THREE.MathUtils.lerp(smooth.positionAngle, moonData.positionAngle, lerpSpeed);
      smooth.altitude = THREE.MathUtils.lerp(smooth.altitude, moonData.altitude, lerpSpeed);
      smooth.azimuth = THREE.MathUtils.lerp(smooth.azimuth, moonData.azimuth, lerpSpeed);
      smooth.hourAngle = THREE.MathUtils.lerp(smooth.hourAngle, moonData.hourAngle, lerpSpeed);

      // Smooth star offset (handle wrap-around for 0-1 range)
      let targetOffset = starOffset;
      let currentOffset = smoothStarOffsetRef.current;
      // Handle wrap-around (e.g., 0.95 -> 0.05 should go forward, not backward)
      let diff = targetOffset - currentOffset;
      if (diff > 0.5) diff -= 1;
      if (diff < -0.5) diff += 1;
      smoothStarOffsetRef.current = (currentOffset + diff * lerpSpeed + 1) % 1;

      // Update uniforms with smoothed values
      materialRef.current.uniforms.uMoonPhase.value = smooth.phase;
      materialRef.current.uniforms.uLibrationLon.value = smooth.librationLon;
      materialRef.current.uniforms.uLibrationLat.value = smooth.librationLat;
      materialRef.current.uniforms.uPositionAngle.value = smooth.positionAngle;
      materialRef.current.uniforms.uMoonAltitude.value = smooth.altitude;
      materialRef.current.uniforms.uMoonAzimuth.value = smooth.azimuth;
      materialRef.current.uniforms.uMoonHourAngle.value = smooth.hourAngle;
      materialRef.current.uniforms.uStarOffset.value = smoothStarOffsetRef.current;
    }
  });

  // Create uniforms - only initialized once, updated via useEffect
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIsDark: { value: isDark ? 1.0 : 0.0 },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uMoonPhase: { value: moonData.phase },
    uLibrationLon: { value: moonData.librationLon },
    uLibrationLat: { value: moonData.librationLat },
    uPositionAngle: { value: moonData.positionAngle },
    uMoonAltitude: { value: moonData.altitude },
    uMoonAzimuth: { value: moonData.azimuth },
    uMoonHourAngle: { value: moonData.hourAngle },
    uStarOffset: { value: starOffset },
    uConstellationLines: { value: lineData },
    uConstellationStars: { value: starData },
    uConstellationFade: { value: constellationFade },
    uConstellationLineCount: { value: constellationLines.length },
    uConstellationStarCount: { value: constellationStars.length },
    uCloudMode: { value: cloudMode === 'realistic' ? 1.0 : 0.0 },
    uIsMobile: { value: isMobile ? 1.0 : 0.0 },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  // Note: Moon data and star offset are now smoothly interpolated in useFrame
  // No need for direct useEffect update - the smooth interpolation handles it

  // Update constellation uniforms
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uConstellationLines.value = lineData;
      materialRef.current.uniforms.uConstellationStars.value = starData;
      materialRef.current.uniforms.uConstellationFade.value = constellationFade;
      materialRef.current.uniforms.uConstellationLineCount.value = constellationLines.length;
      materialRef.current.uniforms.uConstellationStarCount.value = constellationStars.length;
      materialRef.current.uniformsNeedUpdate = true;
    }
  }, [lineData, starData, constellationFade, constellationLines.length, constellationStars.length]);

  // Update cloud mode uniform
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uCloudMode.value = cloudMode === 'realistic' ? 1.0 : 0.0;
      materialRef.current.uniformsNeedUpdate = true;
    }
  }, [cloudMode]);

  // Update mobile uniform
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0;
      materialRef.current.uniformsNeedUpdate = true;
    }
  }, [isMobile]);

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
          uniform float uLibrationLon;  // Sub-observer longitude (-8 to +8 deg)
          uniform float uLibrationLat;  // Sub-observer latitude (-7 to +7 deg)
          uniform float uPositionAngle; // Rotation of moon's north pole (0-360)
          uniform float uMoonAltitude;  // Moon altitude above horizon (-90 to 90 deg)
          uniform float uMoonAzimuth;   // Moon azimuth from north (0-360 deg)
          uniform float uMoonHourAngle; // Normalized hour angle (-1 to 1)
          uniform float uStarOffset;    // Star position offset based on date (0-1)
          uniform float uConstellationLines[40]; // 10 lines * 4 floats (x1,y1,x2,y2)
          uniform float uConstellationStars[20]; // 10 stars * 2 floats (x,y)
          uniform float uConstellationFade;      // 0-1 fade amount
          uniform int uConstellationLineCount;   // Number of active lines
          uniform int uConstellationStarCount;   // Number of active stars
          uniform float uCloudMode;              // 0 = artistic (spiral), 1 = realistic (horizontal)
          uniform float uIsMobile;               // 1 = mobile device, 0 = desktop
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
            // Day: Deep saturated blue sky - vivid and rich
            vec3 daySkyColor1 = vec3(0.18, 0.45, 0.85);   // Deep azure - Top
            vec3 daySkyColor2 = vec3(0.25, 0.55, 0.90);   // Rich cerulean
            vec3 daySkyColor3 = vec3(0.35, 0.65, 0.92);   // Vibrant sky blue
            vec3 daySkyColor4 = vec3(0.45, 0.72, 0.94);   // Clear blue
            vec3 daySkyColor5 = vec3(0.55, 0.78, 0.95);   // Light azure - Bottom (distinctly blue)

            // Night: Deep blue night sky (full moon brightness)
            vec3 nightFullColor1 = vec3(0.02, 0.03, 0.12);   // Deep blue - Top
            vec3 nightFullColor2 = vec3(0.03, 0.05, 0.16);
            vec3 nightFullColor3 = vec3(0.04, 0.07, 0.20);
            vec3 nightFullColor4 = vec3(0.05, 0.09, 0.26);
            vec3 nightFullColor5 = vec3(0.06, 0.11, 0.30);   // Deep blue - Bottom

            // New moon: Much darker but still blue
            vec3 nightNewColor1 = vec3(0.005, 0.008, 0.04);  // Almost black blue - Top
            vec3 nightNewColor2 = vec3(0.008, 0.012, 0.06);
            vec3 nightNewColor3 = vec3(0.01, 0.02, 0.08);
            vec3 nightNewColor4 = vec3(0.015, 0.025, 0.10);
            vec3 nightNewColor5 = vec3(0.02, 0.03, 0.12);    // Bottom

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
            vec3 starColor = vec3(0.0);
            if (uIsDark > 0.01) {
              // Catalog stars (bright named stars)
              starColor += shaderCatalogStars(p, uTime, uStarOffset);

              // Background star field - 4 layers max, varies with moon brightness
              // Full moon = fewer visible stars (light pollution), new moon = more stars
              float starVisibilityFactor = 1.0 - moonIllum * 0.6; // Full moon sees 40% of stars

              float bgField = 0.0;
              bgField += bgStars(uv + vec2(0.0), 80.0, uTime) * 0.8;   // Sparse layer
              bgField += bgStars(uv + vec2(30.0), 120.0, uTime) * 0.5; // Medium layer
              bgField += bgStars(uv + vec2(60.0), 180.0, uTime) * 0.3 * starVisibilityFactor; // Dim - hidden by moonlight
              bgField += bgStars(uv + vec2(90.0), 250.0, uTime) * 0.15 * starVisibilityFactor; // Faint - only on dark nights

              // Subtle blue tint
              starColor += vec3(bgField * 0.9, bgField * 0.95, bgField * 1.05);

              starColor *= uIsDark;
            }

            // === CONSTELLATION LINES (when hovering) ===
            vec3 constellationColor = vec3(0.0);
            if (uConstellationFade > 0.01 && uIsDark > 0.01) {
              vec3 lineColor = vec3(0.6, 0.7, 1.0); // Soft blue-white

              // Draw constellation lines (up to 10)
              for (int i = 0; i < 10; i++) {
                if (i >= uConstellationLineCount) break;
                vec2 lineStart = vec2(uConstellationLines[i * 4], uConstellationLines[i * 4 + 1]);
                vec2 lineEnd = vec2(uConstellationLines[i * 4 + 2], uConstellationLines[i * 4 + 3]);

                float dist = distToLine(p, lineStart, lineEnd);
                float lineWidth = 0.002;
                float line = smoothstep(lineWidth, lineWidth * 0.3, dist);

                // Soft glow around line
                float glow = exp(-dist * 150.0) * 0.3;

                constellationColor += lineColor * (line * 0.5 + glow) * uConstellationFade;
              }

              // Highlight constellation stars with soft circles (up to 10)
              for (int i = 0; i < 10; i++) {
                if (i >= uConstellationStarCount) break;
                vec2 starPos = vec2(uConstellationStars[i * 2], uConstellationStars[i * 2 + 1]);

                float dist = length(p - starPos);
                float highlight = exp(-dist * 60.0) * 0.4;

                constellationColor += lineColor * highlight * uConstellationFade;
              }

              constellationColor *= uIsDark;
            }

            // === MOON (night only) ===
            // Calculate moon position based on altitude and hour angle
            // Hour angle: -1 (east/rising) to +1 (west/setting), 0 at meridian (south)
            // Altitude: -90 to 90 degrees, affects vertical position

            // Base position - center of arc path
            float moonArcCenterX = 0.5;
            float moonArcCenterY = 0.4; // Lower center for arc
            float moonArcRadius = 0.4;  // How high the arc goes

            // Calculate position along the arc based on hour angle
            // When hour angle is 0 (meridian), moon is at highest point
            // When hour angle is -1 or +1, moon is near horizon
            float hourAngleNorm = clamp(uMoonHourAngle, -1.0, 1.0);

            // Arc angle: hour angle maps to arc position (-PI/2 to PI/2 for visible arc)
            float arcAngle = hourAngleNorm * 1.3; // ~75 degree range each side

            // X position: moves east to west (left to right)
            float moonX = moonArcCenterX + sin(arcAngle) * 0.35;

            // Y position: always keep moon visible in sky
            // If altitude is negative (below horizon), use a default elevated position
            float effectiveAlt = max(uMoonAltitude, 30.0); // Minimum 30 degrees
            float altNorm = clamp(effectiveAlt / 90.0, 0.3, 1.0);
            // Combine arc shape with altitude
            float arcHeight = cos(arcAngle) * moonArcRadius;
            float moonY = moonArcCenterY + arcHeight * altNorm;

            // Clamp to visible area with margins
            moonX = clamp(moonX, 0.1, 0.9);
            moonY = clamp(moonY, 0.35, 0.85);

            // Always show moon in night mode (portfolio decorative element)
            // Use altitude to influence position but always keep visible
            float horizonFade = 1.0; // Always fully visible

            vec2 moonPos = vec2(moonX, moonY);
            float moonRadius = 0.055;
            float moonSunlitBrightness = 0.0;
            float moonDarkSide = 0.0;
            float moonLimbDarkening = 1.0;
            float moonDiscMask = 0.0;
            float moonGlowEffect = 0.0;

            if (uIsDark > 0.01 && horizonFade > 0.01) {
              // Get 3D moon data: x=sunlit brightness, y=dark side mask, z=limb darkening, w=disc mask
              vec4 moon3DData = moonWith3D(uv, moonPos, moonRadius, uMoonPhase);
              moonSunlitBrightness = moon3DData.x * horizonFade * uIsDark;
              moonDarkSide = moon3DData.y * horizonFade * uIsDark;
              moonLimbDarkening = moon3DData.z;
              moonDiscMask = moon3DData.w;
              moonGlowEffect = moonGlow(uv, moonPos, moonRadius) * horizonFade;

              // Scale glow by moon illumination (full moon = max)
              float glowIntensity = clamp(moonIllum, 0.05, 1.0);
              moonGlowEffect *= glowIntensity * uIsDark;
            }

            // === CLOUDS (modified for horizontal drift) ===
            // Horizontal drift offset
            vec2 drift = vec2(time, 0.0);

            // Select matrix based on cloud mode (0 = artistic/spiral, 1 = realistic/horizontal)
            mat2 cloudMatrix = uCloudMode > 0.5 ? mRealistic : mArtistic;

            float q = fbm((uv + drift * 0.5) * cloudscale * 0.5);

            // Ridged noise shape
            float r = 0.0;
            vec2 cloudUv = (uv + drift) * cloudscale;
            cloudUv -= q;
            float weight = 0.8;
            for (int i = 0; i < 8; i++) {
              r += abs(weight * noise(cloudUv));
              cloudUv = cloudMatrix * cloudUv;
              weight *= 0.7;
            }

            // Noise shape
            float f = 0.0;
            cloudUv = (uv + drift) * cloudscale;
            cloudUv -= q;
            weight = 0.7;
            for (int i = 0; i < 8; i++) {
              f += weight * noise(cloudUv);
              cloudUv = cloudMatrix * cloudUv;
              weight *= 0.6;
            }

            f *= r + f;

            // Noise colour
            float c = 0.0;
            vec2 drift2 = vec2(time * 1.2, 0.0);
            cloudUv = (uv + drift2) * cloudscale * 2.0;
            cloudUv -= q;
            weight = 0.4;
            for (int i = 0; i < 7; i++) {
              c += weight * noise(cloudUv);
              cloudUv = cloudMatrix * cloudUv;
              weight *= 0.6;
            }

            // Noise ridge colour
            float c1 = 0.0;
            vec2 drift3 = vec2(time * 1.5, 0.0);
            cloudUv = (uv + drift3) * cloudscale * 3.0;
            cloudUv -= q;
            weight = 0.4;
            for (int i = 0; i < 7; i++) {
              c1 += abs(weight * noise(cloudUv));
              cloudUv = cloudMatrix * cloudUv;
              weight *= 0.6;
            }

            c += c1;

            // Cloud colour - soft white/blue for day, dark blue-gray for night
            vec3 dayCloudColor = vec3(0.95, 0.97, 1.0);  // Slightly blue-tinted white clouds
            vec3 nightCloudColor = vec3(0.08, 0.10, 0.15);

            vec3 cloudcolour = mix(dayCloudColor, nightCloudColor, uIsDark);
            cloudcolour *= clamp((clouddark + cloudlight * c), 0.0, 1.0);

            // Cloud coverage - slightly less at night
            float cover = mix(cloudcover, cloudcover * 0.7, uIsDark);

            f = cover + cloudalpha * f * r;

            // === FINAL COMPOSITION ===
            float cloudDensity = clamp(f + c, 0.0, 1.0);
            float cloudOpacity = smoothstep(0.0, 0.6, cloudDensity);

            // Cloud blocking - gradual for thin clouds, full block for thick clouds
            float cloudBlock = smoothstep(0.1, 0.6, cloudDensity); // 0 = clear, 1 = blocked

            // Base sky
            vec3 result = skycolour;

            // === STARS - blocked by clouds ===
            float starVisibility = 1.0 - cloudBlock;
            result += starColor * starVisibility;

            // Constellation lines will be added AFTER clouds (see below)

            // === MOON - Prepare combined color (lit + earthshine) ===
            vec3 baseMoonColor = vec3(1.25, 1.18, 1.05); // Warm bright for bloom
            vec3 moonGlowColor = vec3(1.0, 1.0, 0.95);

            // Combined moon color (will include both lit and dark sides)
            vec3 moonFinalColor = vec3(0.0);
            float moonFinalAlpha = 0.0; // Track overall moon alpha (dark side can be transparent)
            float surface = 1.0;
            float craterShading = 0.0;

            if (uIsDark > 0.01 && moonDiscMask > 0.001) {
              // Calculate sun direction for crater shadows
              float sunAngle = (uMoonPhase - 0.5) * 2.0 * 3.14159;
              vec3 moonSunDir = normalize(vec3(sin(sunAngle), 0.0, cos(sunAngle)));

              // Get moon surface texture with crater shadows
              vec2 surfaceData = moonSurfaceWithNormal(uv, moonPos, moonRadius, uLibrationLon, uLibrationLat, uPositionAngle, moonSunDir);
              surface = surfaceData.x;
              craterShading = surfaceData.y;

              // === SUNLIT PORTION ===
              vec3 litColor = baseMoonColor * surface * moonLimbDarkening;
              litColor *= (1.0 + craterShading);

              // Maria color tinting
              vec2 localMoonUV = (uv - moonPos) / moonRadius;
              float angleRad = uPositionAngle * 3.14159 / 180.0;
              float cosA = cos(angleRad);
              float sinA = sin(angleRad);
              vec2 rotMoonUV = vec2(
                localMoonUV.x * cosA - localMoonUV.y * sinA,
                localMoonUV.x * sinA + localMoonUV.y * cosA
              );
              float libScale = 0.055;
              vec2 libOffset = vec2(-uLibrationLon * libScale, -uLibrationLat * libScale);
              vec2 surfMoonUV = rotMoonUV + libOffset;

              float mariaColor = smoothstep(0.3, 0.0, length(surfMoonUV - vec2(0.15, 0.0)));
              mariaColor += smoothstep(0.28, 0.0, length(surfMoonUV - vec2(-0.2, 0.15)));
              litColor = mix(litColor, litColor * vec3(0.82, 0.85, 0.9), mariaColor * 0.35);

              // === DARK SIDE WITH EARTHSHINE ===
              // Calculate sunlit factor (0 = dark side, 1 = lit side)
              float sunlitFactor = moonSunlitBrightness / max(moonDiscMask, 0.001);
              sunlitFactor = clamp(sunlitFactor, 0.0, 1.0);

              // Earthshine intensity curve - peaks at crescent phases (0.1-0.4 and 0.6-0.9)
              // When we see crescent moon, Moon sees nearly full Earth = max earthshine
              float crescentFactor = 1.0 - moonIllum; // 1 at new moon, 0 at full
              // Bell curve: peak at ~0.2 illumination (crescent), drops at new and full
              float esIntensity = crescentFactor * smoothstep(0.0, 0.15, moonIllum) * smoothstep(0.7, 0.3, moonIllum);
              esIntensity = max(esIntensity, 0.08); // Minimum visibility for dark side

              // Earth-light direction (opposite to sun - Earth is behind us)
              vec3 earthDir = normalize(vec3(-moonSunDir.x, moonSunDir.y * 0.3, -moonSunDir.z * 0.5 + 0.5));

              // Calculate earthshine illumination on the 3D sphere
              vec2 localUV = (uv - moonPos) / moonRadius;
              float r2 = dot(localUV, localUV);
              float z = sqrt(max(0.0, 1.0 - r2));
              vec3 normal = vec3(localUV.x, localUV.y, z);

              // Lambertian shading from Earth-light
              float earthNdotL = max(0.0, dot(normal, earthDir));
              float earthShading = mix(0.4, 1.0, earthNdotL); // Soft shading, not harsh

              // Earthshine color - bluish tint from Earth's oceans/atmosphere
              // Apply the SAME surface texture so maria and craters show
              vec3 earthshineBase = vec3(0.25, 0.30, 0.38); // Blue-gray Earth light
              vec3 earthshineColor = earthshineBase * surface * moonLimbDarkening * earthShading * esIntensity;

              // Add subtle maria tinting to earthshine too
              earthshineColor = mix(earthshineColor, earthshineColor * vec3(0.85, 0.88, 0.95), mariaColor * 0.3);

              // === MOON ALPHA: Dark side always slightly visible ===
              // Base visibility for dark side (the "ashen glow" visible in photos)
              float darkSideBaseAlpha = 0.18; // Always see the disc outline
              float darkSideEarthshineAlpha = esIntensity * 0.7; // Earthshine adds more
              float darkSideAlpha = darkSideBaseAlpha + darkSideEarthshineAlpha;
              darkSideAlpha = clamp(darkSideAlpha, 0.15, 0.5); // Keep it subtle

              moonFinalAlpha = mix(darkSideAlpha, 1.0, sunlitFactor);

              // Final color: blend earthshine into dark side, sunlit stays bright
              moonFinalColor = mix(earthshineColor, litColor, sunlitFactor);
            }

            // === MOONLIGHT ON CLOUDS ===
            // Calculate how much the moon illuminates nearby clouds
            float moonDistForLight = length(uv - moonPos);
            float moonLightOnClouds = 0.0;
            vec3 moonlitCloudColor = cloudcolour;

            if (uIsDark > 0.01 && moonIllum > 0.1) {
              // Light falloff from moon position
              float lightFalloff = exp(-moonDistForLight * 2.5);

              // Cloud edges facing the moon get lit up
              // Use cloud density gradient to find edges
              vec2 cloudGradient = vec2(
                noise((uv + vec2(0.01, 0.0) + drift) * cloudscale) - noise((uv - vec2(0.01, 0.0) + drift) * cloudscale),
                noise((uv + vec2(0.0, 0.01) + drift) * cloudscale) - noise((uv - vec2(0.0, 0.01) + drift) * cloudscale)
              );

              // Direction from cloud to moon
              vec2 toMoon = normalize(moonPos - uv);

              // How much the cloud edge faces the moon (rim lighting)
              float rimLight = max(0.0, dot(cloudGradient * 10.0, toMoon));

              // Combine for moonlit cloud effect
              moonLightOnClouds = lightFalloff * rimLight * moonIllum * cloudOpacity;

              // Moonlit clouds get a warm silver/gold edge
              vec3 moonlightTint = vec3(1.0, 0.95, 0.85) * moonIllum;
              moonlitCloudColor = mix(cloudcolour, moonlightTint, moonLightOnClouds * 0.6);

              // Add subtle glow to clouds near moon
              float nearMoonGlow = exp(-moonDistForLight * 4.0) * moonIllum * 0.15;
              moonlitCloudColor += vec3(0.8, 0.85, 1.0) * nearMoonGlow * cloudOpacity;
            }

            // === CLOUDS rendered with moonlight ===
            vec3 cloudFinal = clamp(skytint * skycolour + moonlitCloudColor, 0.0, 1.0);
            result = mix(result, cloudFinal, cloudOpacity);

            // === MOON rendered with cloud occlusion (NIGHT ONLY) ===
            // Moon is hidden during day - only visible in dark mode
            if (uIsDark > 0.5) {
              float moonDist = length(uv - moonPos);

              // Dynamic cloud thickness variation - simulates patches of thick/thin clouds
              float slowWave = sin(uTime * 0.12) * 0.5 + 0.5;  // ~52s cycle - major cloud banks
              float medWave = sin(uTime * 0.45 + 2.1) * 0.35 + 0.5;  // ~14s cycle - texture
              float fastWave = sin(uTime * 1.2 + 0.7) * 0.15 + 0.5;  // ~5s cycle - shimmer
              float cloudThicknessVar = slowWave * 0.5 + medWave * 0.35 + fastWave * 0.15;

              // Sample noise at moon position for spatial cloud variation
              float localCloudNoise = noise((moonPos + drift * 0.4) * 2.5) * 0.4 + 0.6;
              cloudThicknessVar *= localCloudNoise;

              // === OUTER GLOW (penetrates most clouds) ===
              float glowThreshold = mix(0.5, 0.95, cloudThicknessVar);
              float glowBlock = smoothstep(glowThreshold * 0.5, glowThreshold, cloudOpacity);
              float scatter = cloudOpacity * (1.0 - cloudOpacity) * 2.5;
              float glowMod = (1.0 + scatter * 0.3) * (1.0 - glowBlock);
              result += moonGlowColor * moonGlowEffect * glowMod * 0.5 * uIsDark;

              // === CORONA effect in partial clouds ===
              float coronaLow = mix(0.1, 0.3, cloudThicknessVar);
              float coronaHigh = mix(0.4, 0.75, cloudThicknessVar);
              float inPartialCloud = smoothstep(coronaLow, coronaLow + 0.12, cloudOpacity)
                                   * (1.0 - smoothstep(coronaHigh, coronaHigh + 0.12, cloudOpacity));
              float corona = exp(-moonDist * 2.0 / moonRadius) * inPartialCloud * moonIllum * 0.15;
              result += vec3(0.9, 0.92, 1.0) * corona * uIsDark;

              // === MOON DISC with dynamic occlusion ===
              if (moonDiscMask > 0.001) {
                // Dynamic threshold: low = moon visible through thin clouds, high = blocked
                // Range shifts based on time so sometimes even medium clouds block, sometimes they don't
                float threshLow = mix(0.15, 0.4, cloudThicknessVar);
                float threshHigh = mix(0.5, 0.9, cloudThicknessVar);

                // Cloud blocking - smoothstep creates gradual fade
                float discBlock = smoothstep(threshLow, threshHigh, cloudOpacity);

                // When cloudThicknessVar is high (thick cloud moment), even moderate clouds block
                // When cloudThicknessVar is low (thin patch), only very thick clouds block
                // moonFinalAlpha controls per-pixel alpha (dark side = transparent, lit = opaque)
                float moonAlpha = moonDiscMask * moonFinalAlpha * (1.0 - discBlock) * uIsDark;

                // Replace background with moon color (dark side shows sky through)
                result = mix(result, moonFinalColor, moonAlpha);
              }

              // === Subtle edge glow near moon through clouds ===
              float nearMoonEdge = smoothstep(0.12, 0.03, moonDist) * (1.0 - smoothstep(0.0, 0.015, moonDist));
              float edgeGlow = nearMoonEdge * cloudOpacity * (1.0 - cloudOpacity * 0.7) * moonIllum * 0.06;
              result += vec3(1.0, 0.98, 0.92) * edgeGlow * uIsDark;
            }

            // === CONSTELLATION LINES - rendered OVER clouds ===
            result += constellationColor;

            // Global darkening - only for night (darker), none for day
            // Night gets darker based on moon phase too
            float nightDarken = mix(0.35, 0.5, moonIllum); // New moon = 0.35, Full = 0.5
            float darkenFactor = mix(1.0, nightDarken, uIsDark);
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
function PostProcessing({ isDark, moonPhase, isMobile }: { isDark: boolean; moonPhase: number; isMobile: boolean }) {
  // Skip post-processing on mobile for better performance
  if (isMobile) return null;

  // Moon illumination: 0 at new moon, 1 at full moon
  const moonIllum = 1 - Math.abs(moonPhase - 0.5) * 2;

  // Bloom scales with moon phase: new moon = 0.15, full moon = 0.8
  const bloomIntensity = isDark ? 0.15 + moonIllum * 0.65 : 0;
  const bloomRadius = 0.6 + moonIllum * 0.6;

  return (
    <EffectComposer multisampling={0}>
      <SMAA preset={SMAAPreset.LOW} />
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur={false}
        radius={bloomRadius}
      />
    </EffectComposer>
  );
}


// ============================================
// MAIN EXPORT - Fullscreen fixed
// ============================================
export default function SkyBackground() {
  const { isDarkMode, cloudMode } = useTheme();
  const [currentDate] = useState(() => new Date());
  const [constellationData, setConstellationData] = useState<{
    lines: { x1: number; y1: number; x2: number; y2: number }[];
    stars: { x: number; y: number }[];
  } | null>(null);
  const [constellationFade, setConstellationFade] = useState(0);
  const fadeAnimationRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for post-processing toggle only
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches ||
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get complete moon data including libration
  const moonData = useMemo(() => getMoonData(currentDate), [currentDate]);

  // Handle constellation highlight with fade animation
  const handleConstellationHighlight = (data: { lines: { x1: number; y1: number; x2: number; y2: number }[]; stars: { x: number; y: number }[] } | null) => {
    if (data) {
      setConstellationData(data);
      // Animate fade in
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 800, 1); // 800ms fade in
        setConstellationFade(progress);
        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(animate);
        }
      };
      if (fadeAnimationRef.current) cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = requestAnimationFrame(animate);
    } else {
      // Animate fade out
      const startFade = constellationFade;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 400, 1); // 400ms fade out
        setConstellationFade(startFade * (1 - progress));
        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(animate);
        } else {
          setConstellationData(null);
        }
      };
      if (fadeAnimationRef.current) cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = requestAnimationFrame(animate);
    }
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (fadeAnimationRef.current) cancelAnimationFrame(fadeAnimationRef.current);
    };
  }, []);

  return (
    <>
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
          dpr={[1, 1.5]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <IQClouds
            isDark={isDarkMode}
            moonData={moonData}
            currentDate={currentDate}
            constellationLines={constellationData?.lines || []}
            constellationStars={constellationData?.stars || []}
            constellationFade={constellationFade}
            cloudMode={cloudMode}
            isMobile={isMobile}
          />
          <PostProcessing isDark={isDarkMode} moonPhase={moonData.phase} isMobile={isMobile} />
          {process.env.NODE_ENV === 'development' && <Stats className="fps-stats" />}
        </Canvas>
      </div>

      {/* Interactive Star Map - OUTSIDE pointer-events:none container */}
      <StarMap isDark={isDarkMode} date={currentDate} onConstellationHighlight={handleConstellationHighlight} />

      {/* Sky Toolbar - theme toggle */}
      <SkyToolbar isDark={isDarkMode} />

      {/* Social Button - bottom left */}
      <SocialButton />
    </>
  );
}
