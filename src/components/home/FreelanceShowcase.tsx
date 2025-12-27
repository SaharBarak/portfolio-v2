"use client";

import { motion } from "framer-motion";
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
    <motion.div
      className="group relative flex-shrink-0 overflow-hidden"
      style={{
        width: "390px",
        height: "312px",
        backgroundColor: "var(--card)",
        borderRadius: "16px",
      }}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Iframe - shows immediately */}
      <iframe
        src={project.url}
        title={`${project.title} preview`}
        className="w-full h-full border-0"
        style={{
          transform: "scale(0.5)",
          transformOrigin: "top left",
          width: "200%",
          height: "200%",
        }}
        sandbox="allow-scripts allow-same-origin"
      />

      {/* Bottom gradient with button */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-4 pointer-events-none"
        style={{
          height: "80px",
          background: "linear-gradient(to top, var(--surface-active) 0%, transparent 100%)",
        }}
      >
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full font-medium pointer-events-auto"
          style={{
            fontSize: "0.8125rem",
            backgroundColor: "var(--current-primary)",
            color: "var(--text-invert)",
          }}
        >
          Open {project.title} →
        </a>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 overflow-hidden animate-pulse"
      style={{
        width: "390px",
        height: "312px",
        backgroundColor: "var(--card)",
        borderRadius: "16px",
      }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="mb-5 h-10 w-24 rounded" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-7 w-3/4 rounded mb-3" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full rounded" style={{ backgroundColor: "var(--card-border)" }} />
          <div className="h-4 w-5/6 rounded" style={{ backgroundColor: "var(--card-border)" }} />
        </div>
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-14 rounded-full" style={{ backgroundColor: "var(--card-border)" }} />
          <div className="h-6 w-16 rounded-full" style={{ backgroundColor: "var(--card-border)" }} />
        </div>
        <div className="h-4 w-24 rounded" style={{ backgroundColor: "var(--card-border)" }} />
      </div>
    </div>
  );
}

export default function FreelanceShowcase() {
  const convexFreelance = useFreelance();
  const isLoading = convexFreelance === undefined;

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

  // Don't render if loaded but no freelance projects
  if (!isLoading && projects.length === 0) return null;

  return (
    <section
      id="freelance-work"
      className="relative"
      style={{ padding: "var(--space-48) 0" }}
      aria-labelledby="freelance-title"
    >
      {/* Section Header */}
      <header style={{ marginBottom: "var(--space-16)", padding: "0 var(--space-8)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="font-medium uppercase"
            style={{
              fontFamily: "'Space Grotesk', var(--font-heading)",
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              color: "var(--accent-freelance)",
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
            className="font-black tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', var(--font-heading)",
              fontSize: "clamp(2rem, 8vw, var(--text-6xl))",
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
              fontFamily: "'Space Grotesk', var(--font-heading)",
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--current-text-light)",
              marginTop: "var(--space-4)",
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

      {/* Horizontal Scrollable Container */}
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          paddingLeft: "var(--space-8)",
          paddingRight: "var(--space-8)",
          paddingBottom: "var(--space-2)",
        }}
      >
        <div className="flex gap-5" style={{ width: "max-content" }}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.map((project, index) => (
                <FreelanceCard key={project.title} project={project} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
