"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNowBySection } from "@/hooks/useContent";

function SectionSkeleton() {
  return (
    <div className="animate-pulse" style={{ marginBottom: "var(--space-16)" }}>
      <div className="h-5 w-24 rounded mb-6" style={{ backgroundColor: "var(--card-border)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-32 rounded mb-2" style={{ backgroundColor: "var(--card-border)" }} />
            <div className="h-4 w-full rounded" style={{ backgroundColor: "var(--card-border)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NowPage() {
  const nowBySection = useNowBySection();
  const isLoading = nowBySection === undefined;

  // Define section order
  const sectionOrder = ["Building", "Reading", "Focus", "Learning", "Listening"];
  const sections = nowBySection
    ? sectionOrder.filter((s) => nowBySection[s]?.length > 0)
    : [];

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
              Now
            </h1>
            <p
              className="font-body"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
              }}
            >
              Updated December 2024 ·{" "}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="line"
              >
                What is this?
              </a>
            </p>
          </motion.header>

          {/* Sections */}
          {isLoading ? (
            <>
              <SectionSkeleton />
              <SectionSkeleton />
              <SectionSkeleton />
            </>
          ) : sections.length > 0 ? (
            sections.map((sectionName, sectionIndex) => {
              const items = nowBySection![sectionName] || [];
              return (
                <motion.section
                  key={sectionName}
                  style={{ marginBottom: "var(--space-16)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                >
                  <h2
                    className="font-heading font-bold"
                    style={{
                      fontSize: "var(--text-lg)",
                      letterSpacing: "var(--tracking-tight)",
                      color: "var(--current-text-bold)",
                      marginBottom: "var(--space-6)",
                    }}
                  >
                    {sectionName}
                  </h2>

                  <ul
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: sectionName === "Reading" ? "var(--space-3)" : "var(--space-6)",
                    }}
                  >
                    {items.map((item) => (
                      <li key={item._id}>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="line font-body font-medium"
                            style={{
                              fontSize: "var(--text-base)",
                              color: "var(--current-text-normal)",
                            }}
                          >
                            {item.emoji && <span style={{ marginRight: "var(--space-2)" }}>{item.emoji}</span>}
                            {item.title}
                          </a>
                        ) : (
                          <span
                            className="font-body font-medium"
                            style={{
                              fontSize: "var(--text-base)",
                              color: "var(--current-text-normal)",
                            }}
                          >
                            {item.emoji && <span style={{ marginRight: "var(--space-2)" }}>{item.emoji}</span>}
                            {item.title}
                          </span>
                        )}
                        {item.description && (
                          <p
                            className="font-body"
                            style={{
                              fontSize: "var(--text-base)",
                              lineHeight: "var(--leading-relaxed)",
                              color: "var(--current-text-light)",
                              marginTop: "var(--space-1)",
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              );
            })
          ) : (
            <p
              className="font-body"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--current-text-light)",
                textAlign: "center",
                padding: "var(--space-12) 0",
              }}
            >
              No items synced yet. Add Now content in Notion and run the sync.
            </p>
          )}

          {/* CTA */}
          <motion.div
            style={{
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
              Working on similar things?
            </p>
            <a
              href="mailto:sahar.h.barak@gmail.com"
              className="font-body line"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--current-text-normal)",
              }}
            >
              Let&apos;s connect
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
