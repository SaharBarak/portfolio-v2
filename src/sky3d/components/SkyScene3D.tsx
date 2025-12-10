"use client";

import { SkyDome3D } from './SkyDome3D';
import { CloudLayer3D } from './CloudLayer3D';
import { Moon3D } from './Moon3D';
import { MoonGlow3D } from './MoonGlow3D';

export function SkyScene3D() {
  return (
    <>
      {/* Transparent background */}
      <color attach="background" args={['transparent']} />

      {/* Fixed camera setup - no controls for background */}
      {/* Camera is set on Canvas, no need for OrbitControls */}

      {/* Sky gradient + stars (outermost) */}
      <SkyDome3D />

      {/* Cloud layer (slightly inside sky dome) */}
      <CloudLayer3D />

      {/* Moon glow (behind moon for additive effect) */}
      <MoonGlow3D />

      {/* Moon sphere */}
      <Moon3D />
    </>
  );
}
