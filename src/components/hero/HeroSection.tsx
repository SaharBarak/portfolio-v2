"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { LINKS } from '@/config/links';
import { useAvailability } from '@/hooks/useContent';

// WhatsApp icon component
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Calendly icon component
const CalendlyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 45 45" fill="currentColor">
    <path d="M22.5 0C10.074 0 0 10.074 0 22.5S10.074 45 22.5 45 45 34.926 45 22.5 34.926 0 22.5 0zm0 41.25C12.183 41.25 3.75 32.817 3.75 22.5S12.183 3.75 22.5 3.75 41.25 12.183 41.25 22.5 32.817 41.25 22.5 41.25z"/>
    <path d="M33.75 11.25h-3.75V7.5c0-1.035-.84-1.875-1.875-1.875S26.25 6.465 26.25 7.5v3.75h-7.5V7.5c0-1.035-.84-1.875-1.875-1.875S15 6.465 15 7.5v3.75h-3.75c-1.035 0-1.875.84-1.875 1.875v22.5c0 1.035.84 1.875 1.875 1.875h22.5c1.035 0 1.875-.84 1.875-1.875v-22.5c0-1.035-.84-1.875-1.875-1.875zM31.875 33.75H13.125V18.75h18.75v15z"/>
    <path d="M16.875 22.5h3.75v3.75h-3.75v-3.75zm7.5 0h3.75v3.75h-3.75v-3.75zm-7.5 7.5h3.75v3.75h-3.75V30zm7.5 0h3.75v3.75h-3.75V30z"/>
  </svg>
);

// Get current month name
const getCurrentMonth = () => {
  return new Date().toLocaleString('en-US', { month: 'long' });
};

// Availability Badge with springy animations
const AvailabilityBadge = ({ currentMonth, calendlyUrl }: { currentMonth: string; calendlyUrl: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center mb-4">
      <motion.a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          backgroundColor: isHovered ? 'rgba(0, 107, 255, 0.15)' : 'rgba(16, 185, 129, 0.1)',
          borderColor: isHovered ? 'rgba(0, 107, 255, 0.5)' : 'rgba(16, 185, 129, 0.3)',
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
          mass: 1,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        aria-label="Available December - Book a call on Calendly"
      >
        {/* Pulsing dot with spring animation */}
        <motion.span
          className="w-2.5 h-2.5 rounded-full"
          animate={{
            backgroundColor: isHovered ? '#006BFF' : '#10B981',
            scale: isHovered ? [1, 1.2, 1] : [1, 1.3, 1],
          }}
          transition={{
            backgroundColor: { type: "spring", stiffness: 500, damping: 20 },
            scale: {
              duration: isHovered ? 0.3 : 1.5,
              repeat: isHovered ? 0 : Infinity,
              ease: "easeInOut"
            },
          }}
        />

        {/* Text with crossfade animation */}
        <motion.span
          className="text-xs font-semibold tracking-wide whitespace-nowrap"
          animate={{
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
          style={{
            color: '#10B981',
            display: isHovered ? 'none' : 'block',
          }}
        >
          Available {currentMonth}
        </motion.span>

        {/* Hover text - Book a call with Calendly icon */}
        <motion.span
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wide whitespace-nowrap"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
          style={{
            color: '#006BFF',
            display: isHovered ? 'flex' : 'none',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 45 45" fill="currentColor">
            <path d="M22.5 0C10.074 0 0 10.074 0 22.5S10.074 45 22.5 45 45 34.926 45 22.5 34.926 0 22.5 0zm0 41.25C12.183 41.25 3.75 32.817 3.75 22.5S12.183 3.75 22.5 3.75 41.25 12.183 41.25 22.5 32.817 41.25 22.5 41.25z"/>
            <path d="M33.75 11.25h-3.75V7.5c0-1.035-.84-1.875-1.875-1.875S26.25 6.465 26.25 7.5v3.75h-7.5V7.5c0-1.035-.84-1.875-1.875-1.875S15 6.465 15 7.5v3.75h-3.75c-1.035 0-1.875.84-1.875 1.875v22.5c0 1.035.84 1.875 1.875 1.875h22.5c1.035 0 1.875-.84 1.875-1.875v-22.5c0-1.035-.84-1.875-1.875-1.875zM31.875 33.75H13.125V18.75h18.75v15z"/>
            <path d="M16.875 22.5h3.75v3.75h-3.75v-3.75zm7.5 0h3.75v3.75h-3.75v-3.75zm-7.5 7.5h3.75v3.75h-3.75V30zm7.5 0h3.75v3.75h-3.75V30z"/>
          </svg>
          Book a call
        </motion.span>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isHovered
              ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
              : 'transparent',
            x: isHovered ? ['0%', '200%'] : '0%',
          }}
          transition={{
            x: { duration: 0.6, ease: "easeOut" },
          }}
        />
      </motion.a>
    </div>
  );
};

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

  // Get availability from Convex
  const availability = useAvailability();
  const currentMonth = getCurrentMonth();

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
        {/* Availability Badge - Links to Calendly */}
        <AvailabilityBadge currentMonth={currentMonth} calendlyUrl={LINKS.professional.calendly.thirtyMin} />

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

          {/* WhatsApp Button - Icon only */}
          <a
            href={LINKS.professional.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
            style={{
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              color: '#25D366',
            }}
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </motion.nav>
      </motion.div>

      {/* Scroll & Star hover indicators moved to StarMap.tsx */}
      {/* Twitter/X icon moved to SocialButton.tsx (rendered from SkyBackground) */}

    </section>
  );
};

export default HeroSection;
