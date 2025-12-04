"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

// Dynamically import WebGL component to avoid SSR issues
const SkyBackground = dynamic(() => import('./SkyBackground'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#7EC8E3] to-[#EAF6FC] dark:from-[#0B0B1A] dark:to-[#1E2A4A]" />
  ),
});

// Roles definition with colors
const roles = [
  { text: "builder", color: "#F43F5E" },
  { text: "software engineer", color: "#F59E0B" },
  { text: "full‑stack developer", color: "#10B981" },
  { text: "backend developer", color: "#6366F1" },
  { text: "designer", color: "#EC4899" },
];

interface HeroSectionProps {
  showScrollIndicator?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  showScrollIndicator = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for content
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Typewriter animation for roles
  useEffect(() => {
    const typewriterAnimation = () => {
      const nextIndex = (currentRoleIndex + 1) % roles.length;
      const nextRole = roles[nextIndex];

      const tl = gsap.timeline();

      tl.to(textRef.current, {
        width: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });

      tl.call(() => {
        if (textRef.current) textRef.current.textContent = nextRole.text;
        setCurrentRoleIndex(nextIndex);
      });

      tl.to(textRef.current, {
        width: "auto",
        duration: 1.2,
        ease: "power2.inOut",
      });
    };

    if (textRef.current) {
      gsap.set(textRef.current, {
        overflow: "hidden",
        whiteSpace: "nowrap",
      });
    }

    const interval = setInterval(typewriterAnimation, 3000);
    return () => clearInterval(interval);
  }, [currentRoleIndex]);

  // Animate subtitle on mount
  useEffect(() => {
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
      );
    }
  }, []);

  const currentRole = roles[currentRoleIndex];

  return (
    <section
      ref={containerRef}
      className="hero-section relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* WebGL Sky Background - No background color, transparent */}
      <div className="absolute inset-0 z-0">
        <SkyBackground />
      </div>

      {/* Content */}
      <motion.div
        className="hero-content relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ y, opacity }}
      >
        <motion.h1
          className="hero-title font-heading text-[var(--text-4xl)] md:text-[var(--text-5xl)] font-bold text-[color:var(--text-strong)] mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span>Hi, I&apos;m Sahar Barak</span>
          <br />
          <span>a </span>
          <span
            ref={textRef}
            className="inline-block"
            style={{
              color: currentRole.color,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {currentRole.text}
          </span>
        </motion.h1>

        <p
          ref={subtitleRef}
          className="hero-subtitle font-body text-[var(--text-lg)] md:text-[var(--text-xl)] text-[color:var(--text)] max-w-2xl mx-auto opacity-0"
        >
          Building elegant solutions at the intersection of AI, clean energy, and developer tools
        </p>

        {/* CTA Buttons */}
        <motion.div
          className="hero-cta mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <a
            href="#featured-work"
            className="btn-primary px-8 py-3 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg font-medium text-[var(--text-md)] hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            View Work
          </a>
          <a
            href="/about"
            className="btn-secondary px-8 py-3 border-2 border-[color:var(--border)] text-[color:var(--text-strong)] rounded-lg font-medium text-[var(--text-md)] hover:bg-[color:var(--accent)] transition-colors duration-300"
          >
            About Me
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-[color:var(--text-muted)] rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-[color:var(--text-muted)] rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
