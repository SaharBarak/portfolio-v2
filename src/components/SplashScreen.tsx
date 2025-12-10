"use client";

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const sun = sunRef.current;
    const moon = moonRef.current;
    const text = textRef.current;
    const glow = glowRef.current;
    const container = containerRef.current;

    if (!sun || !moon || !text || !glow || !container) return;

    // Create main timeline
    const tl = gsap.timeline();

    // Initial states - sun and moon start above screen
    gsap.set(sun, { y: -200, opacity: 0, scale: 1.5 });
    gsap.set(moon, { y: -200, opacity: 0, scale: 1.5 });
    gsap.set(text, { y: 30, opacity: 0 });
    gsap.set(glow, { opacity: 0, scale: 0.5 });

    // === FAST ENTRANCE ===

    // Sun and moon slam down together
    tl.to([sun, moon], {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'power4.in',
      stagger: 0.1,
    });

    // Quick glow
    tl.to(glow, {
      opacity: 0.5,
      scale: 1.5,
      duration: 0.15,
    }, '-=0.2');

    // Text reveals
    tl.to(text, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power3.out',
    }, '-=0.1');

    // === SHORT HOLD ===
    tl.to({}, { duration: 0.4 });

    // === QUICK ORBIT ===
    tl.to(sun, {
      rotation: 180,
      transformOrigin: '150% 50%',
      duration: 0.6,
      ease: 'power1.inOut',
    });
    tl.to(moon, {
      rotation: 180,
      transformOrigin: '-50% 50%',
      duration: 0.6,
      ease: 'power1.inOut',
    }, '<');

    // === FAST EXIT ===
    tl.set([sun.querySelector('svg'), moon.querySelector('svg'), glow], { filter: 'none' });

    // Everything fades out together
    tl.to(container, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onStart: () => { if (onComplete) onComplete(); },
    });

    tl.to([sun, moon], {
      x: (i) => i === 0 ? 300 : -300,
      y: (i) => i === 0 ? -250 : 250,
      scale: 0.2,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      force3D: true,
    }, '<');

    tl.to([text, glow], {
      opacity: 0,
      duration: 0.2,
    }, '<');

    tl.call(() => setIsVisible(false));

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,200,100,0.4) 0%, rgba(100,150,255,0.3) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Sun and Moon container */}
      <div className="flex items-center gap-5 md:gap-8 mb-8">
        {/* Sun */}
        <div ref={sunRef} className="relative">
          <svg
            width="56"
            height="56"
            viewBox="0 0 256 256"
            className="md:w-20 md:h-20"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,210,100,0.6))' }}
          >
            <circle cx="128" cy="128" r="50" fill="#FFD93D" />
            <g stroke="#FFD93D" strokeWidth="8" strokeLinecap="round">
              <line x1="128" y1="36" x2="128" y2="16" />
              <line x1="128" y1="240" x2="128" y2="220" />
              <line x1="36" y1="128" x2="16" y2="128" />
              <line x1="240" y1="128" x2="220" y2="128" />
              <line x1="63" y1="63" x2="48" y2="48" />
              <line x1="208" y1="208" x2="193" y2="193" />
              <line x1="63" y1="193" x2="48" y2="208" />
              <line x1="208" y1="48" x2="193" y2="63" />
            </g>
          </svg>
        </div>

        {/* Moon */}
        <div ref={moonRef} className="relative">
          <svg
            width="56"
            height="56"
            viewBox="0 0 256 256"
            className="md:w-20 md:h-20"
            style={{ filter: 'drop-shadow(0 0 15px rgba(200,200,255,0.5))' }}
          >
            <path
              d="M 200 128 A 72 72 0 1 1 128 56 A 56 56 0 0 0 200 128 Z"
              fill="#E8E8F0"
            />
            <circle cx="100" cy="100" r="8" fill="rgba(180,180,200,0.4)" />
            <circle cx="130" cy="140" r="6" fill="rgba(180,180,200,0.3)" />
            <circle cx="90" cy="150" r="10" fill="rgba(180,180,200,0.35)" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div ref={textRef} className="text-center relative">
        <h1
          className="font-heading text-white"
          style={{
            fontSize: 'clamp(1.4rem, 6vw, 3rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          <span style={{ fontWeight: 200, opacity: 0.6 }}>sahar</span>
          <span style={{ fontWeight: 700 }}>barak</span>
          <span style={{ fontWeight: 200, opacity: 0.4 }}>.dev</span>
        </h1>
      </div>
    </div>
  );
}
