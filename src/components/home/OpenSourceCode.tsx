"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Karen CLI",
    description: "Open-source command-line tools for developers, based on Karen AI. Bringing AI-powered layout regression testing and automatic fixing directly to your terminal workflow.",
    tags: ["CLI", "TypeScript", "AI", "Developer Tools"],
    github: "https://github.com/saharbarak/karen-cli",
  }
];

export default function OpenSourceCode() {
  return (
    <section
      className="w-full relative"
      style={{ padding: 'var(--space-48) var(--space-8)' }}
      aria-labelledby="opensource-title"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <motion.span
          className="inline-block text-orange-500 font-semibold uppercase"
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
          Open Source
        </motion.span>

        {/* Main Heading */}
        <motion.h2
          id="opensource-title"
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
          Contributing to the Community
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="max-w-2xl"
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--current-text-light)',
            marginBottom: 'var(--space-32)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Tools and libraries I&apos;ve built and released for the developer community.
        </motion.p>

        {/* Projects */}
        {projects.map((project, index) => (
          <motion.article
            key={index}
            className="border-t"
            style={{
              borderColor: 'var(--card-border)',
              padding: 'var(--space-16) 0',
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div
              className="flex flex-col md:flex-row md:items-start md:justify-between"
              style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}
            >
              <h3
                className="font-heading font-bold"
                style={{
                  fontSize: 'var(--text-3xl)',
                  color: 'var(--current-text-bold)',
                  lineHeight: 'var(--leading-snug)',
                }}
              >
                {project.title}
              </h3>

              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-medium hover:opacity-70 transition-opacity shrink-0"
                style={{
                  gap: 'var(--space-3)',
                  color: 'var(--current-text-normal)',
                  fontSize: 'var(--text-md)',
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>

            <p
              className="max-w-2xl"
              style={{
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-loose)',
                color: 'var(--current-text-normal)',
                marginBottom: 'var(--space-10)',
              }}
            >
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap" style={{ gap: 'var(--space-6)' }}>
              {project.tags.map((tag, tagIndex) => (
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
          </motion.article>
        ))}
      </div>
    </section>
  );
}
