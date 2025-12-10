"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  logo: string;
  brandColors: {
    bg: string;
    accent: string;
    text: string;
    textMuted: string;
  };
}

const projects: Project[] = [
  {
    title: "Wessley AI",
    subtitle: "Virtual Garage",
    description: "Understand your car in 3D. Plan repairs, upgrades, and order parts with model-specific precision.",
    link: "https://wessley.ai/",
    logo: "/ventures/wessley-logo.svg",
    brandColors: {
      bg: "#00141E",
      accent: "#22E974",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.5)",
    },
  },
  {
    title: "Karen CLI",
    subtitle: "Layout Testing",
    description: "AI-powered layout regression testing. Detects visual issues and generates CSS fixes automatically.",
    link: "https://karencli.dev/",
    logo: "/ventures/karen-hair.svg",
    brandColors: {
      bg: "#0C0A09",
      accent: "#CE5D17",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.5)",
    },
  },
  {
    title: "The Peace Board",
    subtitle: "Decentralized Pledges",
    description: "A live map showing where people stand on peace. Turning pledges into visible signal by country.",
    link: "https://thepeaceboard.com/",
    logo: "/ventures/peaceboard-logo.svg",
    brandColors: {
      bg: "#0a0a0a",
      accent: "#FFE262",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.5)",
    },
  },
  {
    title: "Two Circle Studios",
    subtitle: "Product Studio",
    description: "Build products end-to-end in a week. Freelance design, high-impact client work, rapid prototyping.",
    link: "https://twocirclestudios.com/",
    logo: "/ventures/twocircle-logo.svg",
    brandColors: {
      bg: "#FAF7F2",
      accent: "#FF6B35",
      text: "#1a1a1a",
      textMuted: "rgba(26,26,26,0.5)",
    },
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isActive, setIsActive] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <motion.div
      className="group relative flex-shrink-0 overflow-hidden"
      style={{
        width: '390px',
        height: '312px',
        backgroundColor: project.brandColors.bg,
        borderRadius: '16px',
      }}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      tabIndex={0}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => {
        setIsActive(false);
        setIframeLoaded(false);
      }}
      onFocus={() => setIsActive(true)}
      onBlur={() => {
        setIsActive(false);
        setIframeLoaded(false);
      }}
    >
      {/* Default Card Content */}
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-5 h-10 flex items-center">
            <Image
              src={project.logo}
              alt={`${project.title} logo`}
              width={120}
              height={40}
              className="h-9 w-auto object-contain object-left"
            />
          </div>

          {/* Subtitle */}
          <p
            className="uppercase font-medium"
            style={{
              fontSize: '0.625rem',
              letterSpacing: '0.1em',
              color: project.brandColors.accent,
              marginBottom: '8px',
            }}
          >
            {project.subtitle}
          </p>

          {/* Title */}
          <h3
            className="font-semibold"
            style={{
              fontSize: '1.375rem',
              lineHeight: 1.2,
              color: project.brandColors.text,
              marginBottom: '12px',
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className="flex-1"
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.55,
              color: project.brandColors.textMuted,
            }}
          >
            {project.description}
          </p>

          {/* Arrow indicator */}
          <div
            className="flex items-center gap-2 mt-4"
            style={{
              color: project.brandColors.accent,
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            <span>Visit site</span>
            <span>→</span>
          </div>
        </div>
      </a>

      {/* Iframe Preview on Hover/Focus */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: '16px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Loading state */}
            {!iframeLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: project.brandColors.bg }}
              >
                <div
                  className="w-6 h-6 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: `${project.brandColors.accent}40`,
                    borderTopColor: project.brandColors.accent,
                  }}
                />
              </div>
            )}

            {/* Iframe - scrollable */}
            <iframe
              src={project.link}
              title={`${project.title} preview`}
              className="w-full h-full border-0"
              style={{
                transform: 'scale(0.5)',
                transformOrigin: 'top left',
                width: '200%',
                height: '200%',
              }}
              onLoad={() => setIframeLoaded(true)}
              sandbox="allow-scripts allow-same-origin"
            />

            {/* Bottom gradient with button - doesn't block iframe interaction */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4 pointer-events-none"
              style={{
                height: '80px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              }}
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-white font-medium pointer-events-auto"
                style={{
                  fontSize: '0.8125rem',
                  backgroundColor: project.brandColors.accent,
                  color: project.brandColors.bg === '#FAF7F2' ? '#1a1a1a' : '#ffffff',
                }}
              >
                Open {project.title} →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeaturedWork() {
  return (
    <section
      id="featured-work"
      className="relative"
      style={{ padding: 'var(--space-48) 0' }}
      aria-labelledby="featured-work-title"
    >
      {/* Section Header */}
      <header style={{ marginBottom: 'var(--space-16)', padding: '0 var(--space-8)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="font-medium uppercase"
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              color: '#8B5CF6',
              marginBottom: 'var(--space-3)',
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Featured Work
          </motion.p>

          <motion.h2
            id="featured-work-title"
            className="font-heading font-black tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 8vw, var(--text-6xl))',
              lineHeight: 'var(--leading-none)',
              color: 'var(--current-text-bold)',
              marginBottom: 'var(--space-4)',
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Building the Future
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="max-w-2xl"
            style={{
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--current-text-light)',
              marginTop: 'var(--space-4)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Products, tools, and ventures I&apos;m actively building.
          </motion.p>
        </div>
      </header>

      {/* Horizontal Scrollable Container - starts more to the left */}
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          paddingLeft: 'var(--space-8)',
          paddingRight: 'var(--space-8)',
          paddingBottom: 'var(--space-2)',
        }}
      >
        <div className="flex gap-5" style={{ width: 'max-content' }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
