"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useIdeas } from "@/hooks/useContent";

function IdeaSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-baseline" style={{ gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
        <div className="h-6 w-32 rounded" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-4 w-16 rounded" style={{ backgroundColor: "var(--card-border)" }} />
      </div>
      <div className="h-4 w-full rounded mb-2" style={{ backgroundColor: "var(--card-border)" }} />
      <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "var(--card-border)" }} />
    </div>
  );
}

export default function IdeasPage() {
  const convexIdeas = useIdeas();
  const isLoading = convexIdeas === undefined;

  const ideas = convexIdeas || [];

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 0% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
          var(--background)
        `,
      }}
    >
      {/* Noise texture overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="sticky top-0 z-50 px-4 pt-4 lg:px-8 bg-[color:var(--background)]/80 backdrop-blur-md">
        <Header />
      </div>

      <main style={{ padding: "var(--space-16) var(--space-6)" }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.header
            style={{ marginBottom: "var(--space-16)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="font-heading font-black"
              style={{
                fontSize: "var(--text-4xl)",
                letterSpacing: "var(--tracking-tighter)",
                lineHeight: "var(--leading-tight)",
                color: "var(--current-text-bold)",
                marginBottom: "var(--space-4)",
              }}
            >
              Ideas
            </h1>
            <p
              className="font-body"
              style={{
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--current-text-light)",
              }}
            >
              Concepts in exploration mode.
            </p>
          </motion.header>

          {/* Ideas List */}
          <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <IdeaSkeleton />
                </li>
              ))
            ) : ideas.length > 0 ? (
              ideas.map((idea, index) => (
                <motion.li
                  key={idea._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <article>
                    <div
                      className="flex items-baseline"
                      style={{ gap: "var(--space-3)", marginBottom: "var(--space-2)" }}
                    >
                      <h2
                        className="font-heading font-bold"
                        style={{
                          fontSize: "var(--text-xl)",
                          color: "var(--current-text-bold)",
                        }}
                      >
                        {idea.title}
                      </h2>
                      <span
                        className="font-body"
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {idea.status}
                      </span>
                    </div>
                    <p
                      className="font-body"
                      style={{
                        fontSize: "var(--text-base)",
                        lineHeight: "var(--leading-relaxed)",
                        color: "var(--current-text-normal)",
                      }}
                    >
                      {idea.description}
                    </p>
                    {idea.tags && idea.tags.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "var(--space-2)",
                          marginTop: "var(--space-3)",
                        }}
                      >
                        {idea.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-body"
                            style={{
                              padding: "var(--space-1) var(--space-2)",
                              fontSize: "var(--text-xs)",
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              color: "var(--current-text-light)",
                              borderRadius: "var(--radius-md)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </motion.li>
              ))
            ) : (
              <li>
                <p
                  className="font-body"
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--current-text-light)",
                    textAlign: "center",
                    padding: "var(--space-12) 0",
                  }}
                >
                  No ideas synced yet. Add ideas in Notion and run the sync.
                </p>
              </li>
            )}
          </ul>

          {/* CTA */}
          <motion.div
            style={{
              marginTop: "var(--space-20)",
              paddingTop: "var(--space-12)",
              borderTop: "1px solid var(--card-border)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="font-body"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--current-text-light)",
                marginBottom: "var(--space-4)",
              }}
            >
              Have an idea to discuss?
            </p>
            <a
              href="mailto:sahar.h.barak@gmail.com"
              className="font-body line"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--current-text-normal)",
              }}
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
