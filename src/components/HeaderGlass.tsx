"use client";

import { ReactNode, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type HeaderGlassProps = {
  children: ReactNode;
  blurAmount?: number;
  saturation?: number;
  className?: string;
};

export default function HeaderGlass({
  children,
  blurAmount = 8,
  saturation = 110,
  className = '',
}: HeaderGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glassRef.current) return;

    const glass = glassRef.current;

    // Set initial state - hidden
    gsap.set(glass, {
      opacity: 0,
      backdropFilter: 'blur(0px) saturate(100%)',
      webkitBackdropFilter: 'blur(0px) saturate(100%)',
    });

    // Create scroll trigger for glass effect
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -10px',
      end: 'top -10px',
      onEnter: () => {
        gsap.to(glass, {
          opacity: 1,
          backdropFilter: `blur(${blurAmount}px) saturate(${saturation}%)`,
          webkitBackdropFilter: `blur(${blurAmount}px) saturate(${saturation}%)`,
          duration: 0.4,
          ease: 'power2.out',
        });
      },
      onLeaveBack: () => {
        gsap.to(glass, {
          opacity: 0,
          backdropFilter: 'blur(0px) saturate(100%)',
          webkitBackdropFilter: 'blur(0px) saturate(100%)',
          duration: 0.4,
          ease: 'power2.out',
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === document.body) {
          trigger.kill();
        }
      });
    };
  }, [blurAmount, saturation]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%' }}>
      {/* Glass background layer */}
      <div
        ref={glassRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderBottomLeftRadius: 'var(--radius-xl)',
          borderBottomRightRadius: 'var(--radius-xl)',
          // Note: willChange removed - backdrop-filter already GPU accelerated
          // and willChange creates extra compositing overhead
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
