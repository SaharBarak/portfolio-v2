"use client";

import { create } from 'zustand';

export interface SkyboxState {
  // Sky gradient
  skyDarkness: number;
  skyTopColor: [number, number, number];
  skyBottomColor: [number, number, number];

  // Stars
  starDensity: number;
  starBrightness: number;

  // Clouds
  cloudDensity: number;
  cloudSpeed: number;
  cloudMode: 'artistic' | 'realistic';

  // Moon
  moonPhase: number; // 0 = new, 0.5 = full, 1 = new
  moonGlowIntensity: number;
  moonGlowRadius: number;
  moonPosition: [number, number, number];

  // Setters
  setSkyDarkness: (value: number) => void;
  setSkyTopColor: (value: [number, number, number]) => void;
  setSkyBottomColor: (value: [number, number, number]) => void;
  setStarDensity: (value: number) => void;
  setStarBrightness: (value: number) => void;
  setCloudDensity: (value: number) => void;
  setCloudSpeed: (value: number) => void;
  setCloudMode: (value: 'artistic' | 'realistic') => void;
  setMoonPhase: (value: number) => void;
  setMoonGlowIntensity: (value: number) => void;
  setMoonGlowRadius: (value: number) => void;
  setMoonPosition: (value: [number, number, number]) => void;

  // Reset
  resetDefaults: () => void;
}

const defaultState = {
  // Sky defaults (night mode)
  skyDarkness: 1.0,
  skyTopColor: [0.02, 0.03, 0.12] as [number, number, number],
  skyBottomColor: [0.06, 0.11, 0.30] as [number, number, number],

  // Star defaults
  starDensity: 1.0,
  starBrightness: 1.0,

  // Cloud defaults
  cloudDensity: 0.5,
  cloudSpeed: 0.008,
  cloudMode: 'artistic' as const,

  // Moon defaults (half moon for visibility)
  moonPhase: 0.25,
  moonGlowIntensity: 0.8,
  moonGlowRadius: 2.5,
  moonPosition: [0.4, 0.2, -10] as [number, number, number],
};

export const useSkyboxStore = create<SkyboxState>((set) => ({
  ...defaultState,

  setSkyDarkness: (value) => set({ skyDarkness: value }),
  setSkyTopColor: (value) => set({ skyTopColor: value }),
  setSkyBottomColor: (value) => set({ skyBottomColor: value }),
  setStarDensity: (value) => set({ starDensity: value }),
  setStarBrightness: (value) => set({ starBrightness: value }),
  setCloudDensity: (value) => set({ cloudDensity: value }),
  setCloudSpeed: (value) => set({ cloudSpeed: value }),
  setCloudMode: (value) => set({ cloudMode: value }),
  setMoonPhase: (value) => set({ moonPhase: value }),
  setMoonGlowIntensity: (value) => set({ moonGlowIntensity: value }),
  setMoonGlowRadius: (value) => set({ moonGlowRadius: value }),
  setMoonPosition: (value) => set({ moonPosition: value }),

  resetDefaults: () => set(defaultState),
}));

// Utility: compute sun direction from moon phase
export function computeSunDirection(moonPhase: number): [number, number, number] {
  // moonPhase: 0 = new, 0.5 = full, 1 = new
  const angle = (moonPhase - 0.5) * 2 * Math.PI; // -PI to PI
  const x = Math.cos(angle);
  const y = 0.2;
  const z = Math.sin(angle);
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len];
}
