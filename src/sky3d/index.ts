// ============================================
// SKY3D MODULE - Public API
// ============================================

// Main component for switching between 2D and 3D backgrounds
export { BackgroundManager, type BackgroundMode, type BackgroundManagerProps } from './BackgroundManager';

// 3D-specific exports
export { Background3D } from './components/Background3D';

// Store for controlling 3D sky parameters
export { useSkyboxStore, computeSunDirection, type SkyboxState } from './store/useSkyboxStore';

// Individual 3D components (for advanced usage)
export { SkyDome3D } from './components/SkyDome3D';
export { CloudLayer3D } from './components/CloudLayer3D';
export { Moon3D } from './components/Moon3D';
export { MoonGlow3D } from './components/MoonGlow3D';
export { SkyScene3D } from './components/SkyScene3D';
export { SkyboxToolbar } from './components/SkyboxToolbar';
