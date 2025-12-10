"use client";

import { useState } from 'react';
import { useSkyboxStore } from '../store/useSkyboxStore';

export function SkyboxToolbar() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    skyDarkness,
    setSkyDarkness,
    starDensity,
    setStarDensity,
    starBrightness,
    setStarBrightness,
    cloudDensity,
    setCloudDensity,
    cloudSpeed,
    setCloudSpeed,
    cloudMode,
    setCloudMode,
    moonPhase,
    setMoonPhase,
    moonGlowIntensity,
    setMoonGlowIntensity,
    moonGlowRadius,
    setMoonGlowRadius,
    resetDefaults,
  } = useSkyboxStore();

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 1000,
        fontFamily: 'var(--font-body, system-ui)',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-full, 9999px)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '14px' }}>{isOpen ? '✕' : '☰'}</span>
        3D Sky
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: 8,
            padding: 16,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            width: 240,
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 600,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: 8,
            }}
          >
            Sky Parameters
          </h3>

          {/* Sky Darkness */}
          <SliderControl
            label="Sky Darkness"
            value={skyDarkness}
            onChange={setSkyDarkness}
            min={0}
            max={1}
            step={0.01}
          />

          {/* Stars Section */}
          <SectionHeader>Stars</SectionHeader>
          <SliderControl
            label="Density"
            value={starDensity}
            onChange={setStarDensity}
            min={0.1}
            max={2}
            step={0.1}
          />
          <SliderControl
            label="Brightness"
            value={starBrightness}
            onChange={setStarBrightness}
            min={0}
            max={2}
            step={0.1}
          />

          {/* Clouds Section */}
          <SectionHeader>Clouds</SectionHeader>
          <SliderControl
            label="Density"
            value={cloudDensity}
            onChange={setCloudDensity}
            min={0}
            max={1}
            step={0.05}
          />
          <SliderControl
            label="Speed"
            value={cloudSpeed}
            onChange={setCloudSpeed}
            min={0.001}
            max={0.02}
            step={0.001}
            format={(v) => v.toFixed(3)}
          />
          <ToggleControl
            label="Mode"
            value={cloudMode}
            options={['artistic', 'realistic']}
            onChange={setCloudMode}
          />

          {/* Moon Section */}
          <SectionHeader>Moon</SectionHeader>
          <SliderControl
            label="Phase"
            value={moonPhase}
            onChange={setMoonPhase}
            min={0}
            max={1}
            step={0.01}
            format={(v) => {
              if (v < 0.125) return 'New';
              if (v < 0.375) return 'Crescent';
              if (v < 0.625) return 'Half';
              if (v < 0.875) return 'Gibbous';
              return 'Full';
            }}
          />
          <SliderControl
            label="Glow Intensity"
            value={moonGlowIntensity}
            onChange={setMoonGlowIntensity}
            min={0}
            max={2}
            step={0.1}
          />
          <SliderControl
            label="Glow Radius"
            value={moonGlowRadius}
            onChange={setMoonGlowRadius}
            min={1}
            max={5}
            step={0.1}
          />

          {/* Reset Button */}
          <button
            onClick={resetDefaults}
            style={{
              width: '100%',
              marginTop: 16,
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 6,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Reset Defaults
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 12,
        marginBottom: 8,
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      {children}
    </div>
  );
}

function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}) {
  const displayValue = format ? format(value) : value.toFixed(2);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{label}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: 4,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          appearance: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

function ToggleControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ marginBottom: 4, color: 'rgba(255, 255, 255, 0.7)' }}>{label}</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            style={{
              flex: 1,
              padding: '6px 8px',
              background:
                value === option ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border:
                value === option
                  ? '1px solid rgba(255, 255, 255, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              color:
                value === option ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
              fontSize: '11px',
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
