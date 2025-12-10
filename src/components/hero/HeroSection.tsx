"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { LINKS } from '@/config/links';

// Roles definition with colors - updated list
const roles = [
  { text: "software engineer", color: "#3B82F6" },
  { text: "digital visual artist", color: "#EC4899" },
  { text: "builder", color: "#F43F5E" },
  { text: "researcher", color: "#8B5CF6" },
  { text: "full-stack developer", color: "#10B981" },
];

const HeroSection: React.FC = () => {
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
      {/* Content */}
      <motion.div
        className="hero-content relative z-10 text-center px-[var(--space-6)]"
        style={{ y, opacity }}
        role="banner"
        aria-label="Hero section introducing Sahar Barak"
      >
        {/* Greeting - h1: text-3xl to text-4xl */}
        <motion.h1
          className="font-heading font-semibold tracking-[var(--tracking-tighter)] text-[color:var(--text-strong)]"
          style={{ fontSize: 'clamp(var(--text-3xl), 5vw, var(--text-4xl))' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hi, I&apos;m Sahar
        </motion.h1>

        {/* Role - h2: text-xl to text-2xl */}
        <motion.h2
          className="font-heading mt-[var(--space-2)]"
          style={{ fontSize: 'clamp(var(--text-xl), 4vw, var(--text-2xl))' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-live="polite"
          aria-atomic="true"
        >
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
          <motion.span
            className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom"
            style={{ backgroundColor: currentRole.color }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            aria-hidden="true"
          />
        </motion.h2>

        {/* Subtext - body: text-md */}
        <motion.p
          ref={subtitleRef}
          className="font-body text-[var(--text-md)] text-[color:var(--text-muted)] mt-[var(--space-6)] max-w-md mx-auto leading-[var(--leading-relaxed)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Building at the intersection of AI, clean energy, and developer tools.
        </motion.p>

        {/* Buttons */}
        <motion.nav
          className="flex flex-wrap gap-[var(--space-3)] justify-center items-center mt-[var(--space-8)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          aria-label="Primary actions"
        >
          <a
            href="#featured-work"
            className="hero-btn-primary px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-sm)] font-medium rounded-[var(--radius-full)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="View featured work section"
          >
            Featured Work
          </a>

          <a
            href={LINKS.external.twoCircleStudios}
            target="_blank"
            rel="noopener noreferrer"
            className="group hero-btn-secondary flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-sm)] font-medium rounded-[var(--radius-full)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Visit Two Circle Studios website (opens in new tab)"
          >
            {/* Animated Two Circles Logo */}
            <span className="relative w-[18px] h-[18px] flex-shrink-0" aria-hidden="true">
              <span
                className="absolute w-[12px] h-[12px] rounded-[var(--radius-full)] bg-[#FF6B35] opacity-90 top-[3px] left-[1px] transition-transform duration-[var(--transition-slow)] group-hover:-translate-x-[2px]"
              />
              <span
                className="absolute w-[12px] h-[12px] rounded-[var(--radius-full)] bg-[#00D9FF] opacity-90 top-[3px] left-[5px] transition-transform duration-[var(--transition-slow)] group-hover:translate-x-[2px]"
              />
            </span>
            Two Circle Studios
          </a>
        </motion.nav>
      </motion.div>

      {/* Scroll & Star hover indicators moved to StarMap.tsx */}
      {/* Twitter/X icon moved to SocialButton.tsx (rendered from SkyBackground) */}

    </section>
  );
};

export default HeroSection;
