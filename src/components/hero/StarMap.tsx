"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import constellationData from '@/data/constellations.json';

// Types for constellation data
interface Star {
  id: number;
  name: string | null;
  ra: number;
  dec: number;
  x: number;
  y: number;
  magnitude: number;
  bv: number;
  spectral: string;
  lineX?: number;
  lineY?: number;
}

interface LinePoint {
  ra: number;
  dec: number;
  x: number;
  y: number;
}

interface Constellation {
  id: string;
  name: string;
  designation: string;
  rank: number;
  stars: Star[];
  lines: LinePoint[][];
}

interface ConstellationDataJSON {
  metadata: {
    source: string;
    license: string;
    generatedAt: string;
    totalConstellations: number;
    totalStars: number;
  };
  constellations: Record<string, Constellation>;
  brightStars: Star[];
  namedStars: Star[];
}

const data = constellationData as ConstellationDataJSON;

// Get all constellation IDs
const CONSTELLATION_IDS = Object.keys(data.constellations);

// Create a flat list of all named stars for hover targets
const ALL_NAMED_STARS = data.namedStars.map(star => {
  // Find which constellation this star belongs to
  let constellation = '';
  for (const [id, cons] of Object.entries(data.constellations)) {
    if (cons.stars.some(s => s.id === star.id)) {
      constellation = cons.name;
      break;
    }
  }
  return { ...star, constellation };
});

function getStarColor(spectral: string): string {
  const type = spectral[0];
  switch (type) {
    case 'O': return '#9bb0ff';
    case 'B': return '#aabfff';
    case 'A': return '#cad7ff';
    case 'F': return '#f8f7ff';
    case 'G': return '#fff4ea';
    case 'K': return '#ffd2a1';
    case 'M': return '#ffcc6f';
    default: return '#ffffff';
  }
}

// Calculate star offset - must match shader calculation exactly
export function getStarOffset(date: Date): number {
  const referenceDate = new Date('2024-01-01').getTime();
  const daysSinceRef = (date.getTime() - referenceDate) / (1000 * 60 * 60 * 24);
  return (daysSinceRef / 365) % 1; // Full cycle per year
}

export interface ConstellationDisplayData {
  name: string;
  lines: { x1: number; y1: number; x2: number; y2: number }[];
  stars: { x: number; y: number }[];
}

interface StarMapProps {
  isDark: boolean;
  date?: Date;
  onConstellationHighlight?: (data: ConstellationDisplayData | null) => void;
}

export default function StarMap({ isDark, date, onConstellationHighlight }: StarMapProps) {
  const [hoveredStar, setHoveredStar] = useState<(typeof ALL_NAMED_STARS)[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileConstellationIndex, setMobileConstellationIndex] = useState(0);
  const [initialConstellationShown, setInitialConstellationShown] = useState(false);

  // Detect mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isTouchDevice && isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show hint when dark mode is active (desktop only) - permanent, no auto-hide
  useEffect(() => {
    if (isDark && !isMobile) {
      const timer = setTimeout(() => setShowHint(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [isDark, isMobile]);

  // Calculate offset based on date
  const starOffset = useMemo(() => getStarOffset(date || new Date()), [date]);

  // Apply offset to star positions (matching shader's fract() behavior)
  const offsetStars = useMemo(() => {
    return ALL_NAMED_STARS.map(star => ({
      ...star,
      x: ((star.x + starOffset) % 1 + 1) % 1, // fract() equivalent
    }));
  }, [starOffset]);

  // Get constellation data for highlighting
  const getConstellationDisplayData = (constellationId: string): ConstellationDisplayData => {
    const constellation = data.constellations[constellationId];
    if (!constellation) {
      return { name: constellationId, lines: [], stars: [] };
    }

    // Convert line segments with offset applied
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

    for (const linePoints of constellation.lines) {
      for (let i = 0; i < linePoints.length - 1; i++) {
        const p1 = linePoints[i];
        const p2 = linePoints[i + 1];

        // Apply offset
        const x1 = ((p1.x + starOffset) % 1 + 1) % 1;
        const x2 = ((p2.x + starOffset) % 1 + 1) % 1;

        // Skip lines that wrap around the screen (horizontal distance > 0.5)
        const dx = Math.abs(x1 - x2);
        if (dx > 0.5) continue;

        lines.push({
          x1,
          y1: p1.y,
          x2,
          y2: p2.y,
        });
      }
    }

    // Get star positions with offset
    const stars = constellation.stars.map(s => ({
      x: ((s.lineX ?? s.x) + starOffset) % 1,
      y: s.lineY ?? s.y,
    }));

    return {
      name: constellation.name,
      lines,
      stars,
    };
  };

  // Find constellation ID by name
  const findConstellationIdByName = (name: string): string | null => {
    for (const [id, cons] of Object.entries(data.constellations)) {
      if (cons.name === name) return id;
    }
    return null;
  };

  // Show initial constellation on first load (both desktop and mobile)
  useEffect(() => {
    if (!isDark || initialConstellationShown) return;

    // Show Virgo as initial constellation
    const initialConstellationId = 'Vir';

    const showInitial = setTimeout(() => {
      setActiveConstellation(initialConstellationId);
      setInitialConstellationShown(true);
      if (onConstellationHighlight) {
        onConstellationHighlight(getConstellationDisplayData(initialConstellationId));
      }

      // Auto-hide after 4 seconds on desktop (mobile will cycle)
      if (!isMobile) {
        setTimeout(() => {
          setActiveConstellation(null);
          if (onConstellationHighlight) {
            onConstellationHighlight(null);
          }
        }, 4000);
      }
    }, 1500);

    return () => clearTimeout(showInitial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, initialConstellationShown, isMobile]);

  // Mobile: Auto-cycle through constellations
  useEffect(() => {
    if (!isMobile || !isDark) return;

    // Cycle to next constellation every 5 seconds
    const cycleInterval = setInterval(() => {
      setMobileConstellationIndex(prev => {
        const nextIndex = (prev + 1) % CONSTELLATION_IDS.length;
        const constellationId = CONSTELLATION_IDS[nextIndex];
        setActiveConstellation(constellationId);
        if (onConstellationHighlight) {
          onConstellationHighlight(getConstellationDisplayData(constellationId));
        }
        return nextIndex;
      });
    }, 5000);

    return () => {
      clearInterval(cycleInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isDark, starOffset]);

  // Handle hover - show constellation immediately
  const handleMouseEnter = (star: (typeof ALL_NAMED_STARS)[0]) => {
    setHoveredStar(star);

    // Dismiss hint on first interaction
    if (showHint) {
      setShowHint(false);
    }

    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    // Find constellation ID for this star
    const constellationId = findConstellationIdByName(star.constellation);
    if (!constellationId) return;

    // Show constellation immediately (small delay for smooth feel)
    hoverTimerRef.current = setTimeout(() => {
      setActiveConstellation(constellationId);
      if (onConstellationHighlight) {
        onConstellationHighlight(getConstellationDisplayData(constellationId));
      }
    }, 150);
  };

  const handleMouseLeave = () => {
    setHoveredStar(null);

    // Clear timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    // Clear constellation highlight
    setActiveConstellation(null);
    if (onConstellationHighlight) {
      onConstellationHighlight(null);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  if (!isDark) return null;

  // Get active constellation name for display
  const activeConstellationName = activeConstellation
    ? data.constellations[activeConstellation]?.name
    : null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Invisible hover targets only - stars rendered in shader */}
      {offsetStars.map((star, index) => {
        // Larger hitbox for brighter stars
        const hitboxSize = star.magnitude < 1 ? 50 : star.magnitude < 2 ? 42 : star.magnitude < 3 ? 36 : 30;
        return (
          <div
            key={`${star.id}-${index}`}
            className="absolute pointer-events-auto cursor-crosshair"
            style={{
              left: `${star.x * 100}%`,
              bottom: `${star.y * 100}%`,
              transform: 'translate(-50%, 50%)',
              width: hitboxSize,
              height: hitboxSize,
              zIndex: 20,
            }}
            onMouseEnter={(e) => {
              handleMouseEnter(star);
              setMousePos({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={handleMouseLeave}
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          />
        );
      })}

      {/* Tooltip - compact */}
      {hoveredStar && (
        <div
          className="fixed z-50 px-1.5 py-1 rounded pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 8,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            fontSize: '0.65rem',
            lineHeight: 1.3,
          }}
        >
          <span className="font-medium" style={{ color: getStarColor(hoveredStar.spectral) }}>
            {hoveredStar.name}
          </span>
          <span className="text-gray-400 ml-1">
            {hoveredStar.constellation}
          </span>
        </div>
      )}

      {/* Desktop: Star hover hint - scroll-tip style indicator */}
      <AnimatePresence>
        {showHint && !isMobile && (
          <motion.div
            className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            <div className="flex items-end gap-8">
              {/* Scroll indicator */}
              <div className="flex flex-col items-center gap-2">
                {/* Mouse outline */}
                <div
                  className="relative flex flex-col items-center justify-start pt-2"
                  style={{
                    width: 24,
                    height: 38,
                    borderRadius: 12,
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  }}
                >
                  {/* Scroll wheel/dot */}
                  <motion.div
                    style={{
                      width: 3,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    }}
                    animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    letterSpacing: '0.05em',
                  }}
                >
                  scroll
                </span>
              </div>

              {/* Star hover indicator */}
              <div className="flex flex-col items-center gap-2">
                {/* Star with orbit rings */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 38,
                    height: 38,
                  }}
                >
                  {/* Outer orbit ring */}
                  <div
                    className="absolute rounded-[var(--radius-full)]"
                    style={{
                      width: 36,
                      height: 36,
                      border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    }}
                  />
                  {/* Inner orbit ring */}
                  <div
                    className="absolute rounded-[var(--radius-full)]"
                    style={{
                      width: 24,
                      height: 24,
                      border: '1.5px solid rgba(255, 255, 255, 0.35)',
                    }}
                  />
                  {/* Center star */}
                  <motion.div
                    className="relative z-10"
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.95)',
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      filter: [
                        'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
                        'drop-shadow(0 0 8px rgba(255,255,255,0.7))',
                        'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ✦
                  </motion.div>
                  {/* Orbiting dot */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: 4,
                        height: 4,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(167, 139, 250, 0.9)',
                        boxShadow: '0 0 6px rgba(167, 139, 250, 0.7)',
                        top: 1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                  </motion.div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    letterSpacing: '0.05em',
                  }}
                >
                  hover stars
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: Constellation name label */}
      <AnimatePresence mode="wait">
        {isMobile && activeConstellationName && (
          <motion.div
            key={activeConstellationName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          >
            <div
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(10, 15, 35, 0.85)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="text-purple-400">✦</span>
              <span className="text-white text-sm font-medium">{activeConstellationName}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
