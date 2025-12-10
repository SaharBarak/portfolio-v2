"use client";

import dynamic from 'next/dynamic';

// Dynamically import 3D background to avoid SSR issues
const Background3D = dynamic(
  () => import('./components/Background3D').then((mod) => mod.Background3D),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: 'linear-gradient(to bottom, #0B0B1A 0%, #1E2A4A 100%)',
        }}
      />
    ),
  }
);

// Import existing 2D background (the original implementation)
const Background2D = dynamic(
  () => import('@/components/hero/SkyBackground'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: 'linear-gradient(to bottom, #0B0B1A 0%, #1E2A4A 100%)',
        }}
      />
    ),
  }
);

export type BackgroundMode = '2d' | '3d';

export interface BackgroundManagerProps {
  mode: BackgroundMode;
}

export function BackgroundManager({ mode }: BackgroundManagerProps) {
  return (
    <>
      {mode === '2d' && <Background2D />}
      {mode === '3d' && <Background3D />}
    </>
  );
}

export default BackgroundManager;
