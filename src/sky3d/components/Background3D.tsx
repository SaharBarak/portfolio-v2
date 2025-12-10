"use client";

import { Canvas } from '@react-three/fiber';
import { SkyScene3D } from './SkyScene3D';
import { SkyboxToolbar } from './SkyboxToolbar';

export function Background3D() {
  return (
    <>
      {/* Full-screen 3D Canvas */}
      <div
        className="sky-background-3d"
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
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
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
          <SkyScene3D />
        </Canvas>
      </div>

      {/* Skybox Toolbar - positioned overlay */}
      <SkyboxToolbar />
    </>
  );
}
