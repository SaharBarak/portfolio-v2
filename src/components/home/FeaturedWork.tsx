"use client";

import { motion } from "framer-motion";

interface FeaturedWorkSectionProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  index: number;
}

const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({
  title,
  description,
  tags,
  link,
  github,
  index,
}) => (
  <motion.article
    className={`${index % 2 === 1 ? 'section-dark' : ''}`}
    style={{ padding: 'var(--space-32) 0' }}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    <div
      className="max-w-5xl mx-auto"
      style={{ padding: '0 var(--space-8)' }}
    >
      {/* Project Number */}
      <span
        className="block font-mono tracking-widest"
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--current-text-light)',
          opacity: 0.5,
          marginBottom: 'var(--space-8)',
        }}
      >
        0{index + 1}
      </span>

      {/* Project Title */}
      <h3
        className="font-heading font-bold tracking-tight"
        style={{
          fontSize: 'var(--text-4xl)',
          color: 'var(--current-text-bold)',
          marginBottom: 'var(--space-8)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="max-w-2xl"
        style={{
          fontSize: 'var(--text-lg)',
          lineHeight: 'var(--leading-loose)',
          color: 'var(--current-text-normal)',
          marginBottom: 'var(--space-10)',
        }}
      >
        {description}
      </p>

      {/* Tags */}
      <div
        className="flex flex-wrap"
        style={{
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-10)',
        }}
      >
        {tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="font-medium"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--current-text-light)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex flex-wrap items-center" style={{ gap: 'var(--space-8)' }}>
        {link && link !== '#' && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-semibold hover:opacity-70 transition-opacity"
            style={{
              gap: 'var(--space-3)',
              color: 'var(--current-text-bold)',
              fontSize: 'var(--text-md)',
            }}
          >
            View Project
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-medium hover:opacity-70 transition-opacity"
            style={{
              gap: 'var(--space-3)',
              color: 'var(--current-text-normal)',
              fontSize: 'var(--text-md)',
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        )}
      </div>
    </div>
  </motion.article>
);

const projects = [
  {
    title: "Karen AI",
    description: "AI-powered layout regression testing and automatic fixing. Karen detects visual regressions in your UI and suggests fixes automatically, streamlining your QA workflow.",
    tags: ["AI", "Testing", "Automation", "DevTools"],
    link: "#",
    github: "https://github.com/saharbarak/karen-ai",
  },
  {
    title: "White Hydrogen Detection",
    description: "Pioneering satellite data analysis for clean energy discovery. Using machine learning to analyze geological formations and detect potential white hydrogen seeps from space.",
    tags: ["Satellite Data", "Clean Energy", "ML", "Research"],
    link: "#",
    github: "https://github.com/saharbarak/white-hydrogen",
  },
  {
    title: "Karen CLI",
    description: "Open-source command-line tools for developers, based on Karen AI. Bringing AI-powered development assistance directly to your terminal.",
    tags: ["CLI", "Open Source", "Developer Tools"],
    link: "#",
    github: "https://github.com/saharbarak/karen-cli",
  },
  {
    title: "Wessley AI",
    description: "World's first AI-powered virtual garage. Examine your car in 3D, plan work, repairs, upgrades, and order replacements - all with model-specific precision.",
    tags: ["AI", "3D", "Automotive", "Innovation"],
    link: "#",
    github: "https://github.com/saharbarak/wessley-ai",
  }
];

export default function FeaturedWork() {
  return (
    <section id="featured-work" className="relative" aria-labelledby="featured-work-title">
      {/* Section Header */}
      <header
        className="w-full"
        style={{ padding: 'var(--space-48) var(--space-8) var(--space-32)' }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section Label */}
          <motion.span
            className="inline-block text-violet-500 font-semibold uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)',
              marginBottom: 'var(--space-8)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Work
          </motion.span>

          {/* Main Heading */}
          <motion.h2
            id="featured-work-title"
            className="font-heading font-black tracking-tight"
            style={{
              fontSize: 'var(--text-6xl)',
              lineHeight: 'var(--leading-none)',
              color: 'var(--current-text-bold)',
              marginBottom: 'var(--space-8)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Building the Future
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="max-w-2xl"
            style={{
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--current-text-light)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Innovative solutions at the intersection of AI, clean energy, and developer tools.
          </motion.p>
        </div>
      </header>

      {/* Projects List */}
      <div>
        {projects.map((project, index) => (
          <FeaturedWorkSection
            key={index}
            {...project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
