"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useFreelance } from "@/hooks/useContent";

interface FreelanceProject {
  title: string;
  client: string;
  description: string;
  url: string;
  logo?: string;
  colors: {
    bg: string;
    accent: string;
    text: string;
    textMuted?: string;
  };
  testimonial?: string;
  tags: string[];
}

function FreelanceCard({ project, index }: { project: FreelanceProject; index: number }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden"
      style={{
        backgroundColor: project.colors.bg,
        borderRadius: "16px",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="p-6 flex flex-col h-full min-h-[280px]">
        {/* Logo */}
        {project.logo && (
          <div className="mb-4 h-10 flex items-center">
            <Image
              src={project.logo}
              alt={`${project.client} logo`}
              width={120}
              height={40}
              className="h-8 w-auto object-contain object-left"
            />
          </div>
        )}

        {/* Client tag */}
        <p
          className="uppercase font-medium mb-2"
          style={{
            fontSize: "0.625rem",
            letterSpacing: "0.1em",
            color: project.colors.accent,
          }}
        >
          {project.client}
        </p>

        {/* Title */}
        <h3
          className="font-semibold mb-3"
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.3,
            color: project.colors.text,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="flex-1 mb-4"
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: project.colors.textMuted || `${project.colors.text}80`,
          }}
        >
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full"
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  backgroundColor: `${project.colors.accent}20`,
                  color: project.colors.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Testimonial quote (if available) */}
        {project.testimonial && (
          <blockquote
            className="border-l-2 pl-3 italic"
            style={{
              fontSize: "0.8125rem",
              color: project.colors.textMuted || `${project.colors.text}60`,
              borderColor: project.colors.accent,
            }}
          >
            &ldquo;{project.testimonial}&rdquo;
          </blockquote>
        )}

        {/* Arrow indicator */}
        <div
          className="flex items-center gap-2 mt-4 group-hover:gap-3 transition-all"
          style={{
            color: project.colors.accent,
            fontSize: "0.8125rem",
            fontWeight: 500,
          }}
        >
          <span>View project</span>
          <span>→</span>
        </div>
      </div>
    </motion.a>
  );
}

export default function FreelanceShowcase() {
  const convexFreelance = useFreelance();

  // Map Convex data to component format
  const projects: FreelanceProject[] = convexFreelance
    ? convexFreelance.map((f) => ({
        title: f.title,
        client: f.client || "",
        description: f.description,
        url: f.url,
        logo: f.logo || undefined,
        colors: {
          bg: f.colors.bg,
          accent: f.colors.accent,
          text: f.colors.text,
          textMuted: f.colors.textMuted || undefined,
        },
        testimonial: f.testimonial || undefined,
        tags: f.tags || [],
      }))
    : [];

  // Don't render if no freelance projects
  if (projects.length === 0) return null;

  return (
    <section
      id="freelance-work"
      className="relative"
      style={{ padding: "var(--space-48) 0" }}
      aria-labelledby="freelance-title"
    >
      {/* Section Header */}
      <header style={{ marginBottom: "var(--space-12)", padding: "0 var(--space-8)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="font-medium uppercase"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              color: "#f59e0b",
              marginBottom: "var(--space-3)",
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Client Work
          </motion.p>

          <motion.h2
            id="freelance-title"
            className="font-heading font-black tracking-tight"
            style={{
              fontSize: "clamp(2rem, 8vw, var(--text-5xl))",
              lineHeight: "var(--leading-none)",
              color: "var(--current-text-bold)",
              marginBottom: "var(--space-4)",
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Freelance Showcase
          </motion.h2>

          <motion.p
            className="max-w-2xl"
            style={{
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--current-text-light)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Selected client projects and collaborations.
          </motion.p>
        </div>
      </header>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-[var(--space-8)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <FreelanceCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
