"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const LenisContext = createContext<LenisContextType | undefined>(undefined);

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
};

// Get root em size for calculations
const getRootEmSize = () => {
  if (typeof window === 'undefined') return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Get em-based values
    const emSize = getRootEmSize();

    const lenisInstance = new Lenis({
      // Duration in seconds - smooth and buttery
      duration: 1.4,
      // Exponential ease out - feels natural
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // Wheel multiplier based on em (1em = ~1 line of text scroll)
      wheelMultiplier: emSize * 0.0625, // 1em worth of scroll per detent
      touchMultiplier: 2,
      // Prevent smoothing very small scrolls
      syncTouch: false,
      syncTouchLerp: 0.075,
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Update wheel multiplier on resize (in case font size changes)
    const handleResize = () => {
      const newEmSize = getRootEmSize();
      lenisInstance.options.wheelMultiplier = newEmSize * 0.0625;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', handleResize);
      lenisInstance.destroy();
    };
  }, []);

  const scrollTo = useCallback((
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number }
  ) => {
    if (lenis) {
      // Convert offset to em-based if provided as a number
      const emSize = getRootEmSize();
      const offset = options?.offset !== undefined
        ? options.offset * emSize  // Treat offset as em units
        : 0;

      lenis.scrollTo(target, {
        offset,
        duration: options?.duration ?? 1.4,
      });
    }
  }, [lenis]);

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};
