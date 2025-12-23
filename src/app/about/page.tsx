"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAbout } from "@/hooks/useContent";

// Fallback data
const fallbackHeroImages = [
  "/hero/1.jpg",
  "/hero/2.jpg",
  "/hero/3.jpg",
  "/hero/4.jpg",
  "/hero/5.jpg",
  "/hero/6.jpg",
];

const fallbackStackGroups = [
  {
    label: "Languages",
    items: ["TypeScript", "Python", "JavaScript", "Go", "Rust", "SQL", "Bash", "C++"],
  },
  {
    label: "AI & ML",
    items: ["PyTorch", "TensorFlow", "JAX", "scikit-learn", "XGBoost", "Keras", "ONNX", "MLflow", "Hugging Face", "spaCy", "OpenCV", "YOLO", "Stable Diffusion", "Whisper"],
  },
  {
    label: "LLMs & RAG",
    items: ["Claude API", "OpenAI", "LangChain", "LlamaIndex", "Anthropic SDK", "CrewAI", "DSPy", "Pinecone", "Weaviate", "Chroma", "Milvus", "FAISS"],
  },
  {
    label: "Data & MLOps",
    items: ["Pandas", "NumPy", "Polars", "DVC", "Weights & Biases", "Ray", "Airflow", "Dagster"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Vue", "Svelte", "Tailwind", "Framer Motion", "GSAP", "Three.js", "WebGL"],
  },
  {
    label: "Backend",
    items: ["Node.js", "FastAPI", "Django", "Flask", "Express", "NestJS", "tRPC", "GraphQL", "gRPC"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Neo4j", "ClickHouse", "Convex", "Supabase", "Prisma"],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Pulumi", "Cloudflare", "Vercel", "GitHub Actions"],
  },
];

const fallbackVentures = [
  { name: "Wessley AI", description: "3D car understanding", url: "https://wessley.ai" },
  { name: "Karen CLI", description: "layout testing", url: "https://karencli.dev" },
  { name: "The Peace Board", description: "decentralized peace pledges", url: "https://thepeaceboard.com" },
];

const fallbackFreelance = {
  name: "Two Circle Studios",
  description: "Full-stack web apps, AI integration, rapid prototyping. Building products end-to-end.",
  url: "https://twocirclestudios.com",
};

function AboutSkeleton() {
  return (
    <div className="animate-pulse">
      <div style={{ marginBottom: "var(--space-16)" }}>
        <div className="h-6 w-full rounded mb-4" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "var(--card-border)" }} />
      </div>
      <div style={{ marginBottom: "var(--space-16)" }}>
        <div className="h-8 w-48 rounded mb-6" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-4 w-full rounded mb-2" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-4 w-full rounded mb-2" style={{ backgroundColor: "var(--card-border)" }} />
        <div className="h-4 w-2/3 rounded" style={{ backgroundColor: "var(--card-border)" }} />
      </div>
    </div>
  );
}

export default function AboutPage() {
  const aboutData = useAbout();
  const isLoading = aboutData === undefined;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use Convex data or fallbacks
  const heroImages = aboutData?.heroImages?.length ? aboutData.heroImages : fallbackHeroImages;
  const headline = aboutData?.headline || "Hey, I'm Sahar";
  const tagline = aboutData?.tagline || "Developer building things — freelancing and working on my own ventures.";
  const bio = aboutData?.bio || "I'm a developer based in Israel. I build things — some for clients, some for myself. Right now I'm mostly doing freelance work while working on my own projects on the side.";
  const bioSecondary = aboutData?.bioSecondary || "I like working on AI stuff, web apps, and tools that help people coordinate better. Nothing fancy, just trying to build useful things.";
  const ventures = aboutData?.ventures?.length ? aboutData.ventures : fallbackVentures;
  const freelance = aboutData?.freelance?.name ? aboutData.freelance : fallbackFreelance;
  const research = aboutData?.research || "exploring identity systems, cryptographic reputation protocols, and ML for clean energy (white hydrogen detection).";
  const stackGroups = aboutData?.stack?.length ? aboutData.stack : fallbackStackGroups;
  const hobbies = aboutData?.hobbies || "Kitesurfing, yoga, playing oud, riding motorcycles, climbing, and chasing sunsets. I try to spend as much time outside as possible.";
  const socialLinks = aboutData?.socialLinks || {
    email: "sahar.h.barak@gmail.com",
    github: "https://github.com/saharbarak",
    linkedin: "https://linkedin.com/in/saharbarak",
    twitter: "https://twitter.com/saharbarak",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div
      className="min-h-screen"
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

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ padding: "var(--space-4) var(--space-4)", paddingTop: "var(--space-4)" }}>
        <Header />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background photo carousel */}
        <div className="absolute inset-0">
          {heroImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt="Sahar"
              fill
              className={`object-cover transition-opacity duration-[2000ms] ${
                idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              priority={idx === 0}
            />
          ))}
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, var(--background) 0%, transparent 50%)" }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center" style={{ padding: "0 var(--space-8)", maxWidth: "56rem", margin: "0 auto" }}>
          <motion.h1
            className="font-heading font-black"
            style={{
              fontSize: "clamp(var(--text-4xl), 10vw, var(--text-6xl))",
              lineHeight: "var(--leading-none)",
              letterSpacing: "var(--tracking-tighter)",
              color: "#ffffff",
              marginBottom: "var(--space-6)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="font-body"
            style={{
              fontSize: "var(--text-xl)",
              lineHeight: "var(--leading-relaxed)",
              letterSpacing: "var(--tracking-normal)",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "36rem",
              margin: "0 auto",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {tagline}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "var(--space-8)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div
            className="flex justify-center"
            style={{
              width: "1.5rem",
              height: "2.5rem",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "var(--radius-full)"
            }}
          >
            <motion.div
              style={{
                width: "0.375rem",
                height: "0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: "var(--radius-full)",
                marginTop: "var(--space-2)"
              }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <main style={{ padding: "var(--space-20) var(--space-8)" }}>
        <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
          {isLoading ? (
            <AboutSkeleton />
          ) : (
            <>
              {/* About */}
              <motion.section
                style={{ marginBottom: "var(--space-16)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p
                  className="font-body"
                  style={{
                    fontSize: "var(--text-lg)",
                    lineHeight: "var(--leading-loose)",
                    letterSpacing: "var(--tracking-normal)",
                    color: "var(--current-text-normal)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  {bio}
                </p>
                {bioSecondary && (
                  <p
                    className="font-body"
                    style={{
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--leading-relaxed)",
                      letterSpacing: "var(--tracking-normal)",
                      color: "var(--current-text-light)",
                    }}
                  >
                    {bioSecondary}
                  </p>
                )}
              </motion.section>

              {/* What I'm up to */}
              <motion.section
                style={{ marginBottom: "var(--space-16)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="font-heading font-bold"
                  style={{
                    fontSize: "var(--text-2xl)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-normal)",
                    color: "var(--current-text-bold)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  What I&apos;m up to
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--leading-relaxed)",
                      color: "var(--current-text-normal)",
                    }}
                  >
                    <strong style={{ color: "var(--current-text-bold)", fontWeight: 600 }}>Ventures</strong> — building{" "}
                    {ventures.map((v, i) => (
                      <span key={v.name}>
                        <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
                          {v.name}
                        </a>
                        {" "}({v.description}){i < ventures.length - 1 ? (i === ventures.length - 2 ? ", and " : ", ") : "."}
                      </span>
                    ))}
                  </p>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--leading-relaxed)",
                      color: "var(--current-text-normal)",
                    }}
                  >
                    <strong style={{ color: "var(--current-text-bold)", fontWeight: 600 }}>Freelance</strong> — running{" "}
                    <a href={freelance.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
                      {freelance.name}
                    </a>.
                    {" "}{freelance.description}
                  </p>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "var(--text-base)",
                      lineHeight: "var(--leading-relaxed)",
                      color: "var(--current-text-normal)",
                    }}
                  >
                    <strong style={{ color: "var(--current-text-bold)", fontWeight: 600 }}>Research</strong> — {research}
                  </p>
                </div>
              </motion.section>

              {/* Stack */}
              <motion.section
                style={{ marginBottom: "var(--space-16)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="font-heading font-bold"
                  style={{
                    fontSize: "var(--text-2xl)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-normal)",
                    color: "var(--current-text-bold)",
                    marginBottom: "var(--space-8)",
                  }}
                >
                  Stack
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "var(--space-8) var(--space-12)",
                  }}
                >
                  {stackGroups.map((group) => (
                    <div key={group.label}>
                      <p
                        className="font-body font-medium"
                        style={{
                          fontSize: "var(--text-xs)",
                          letterSpacing: "var(--tracking-widest)",
                          textTransform: "uppercase",
                          color: "var(--current-text-light)",
                          marginBottom: "var(--space-3)",
                        }}
                      >
                        {group.label}
                      </p>
                      <p
                        className="font-body"
                        style={{
                          fontSize: "var(--text-sm)",
                          lineHeight: "var(--leading-relaxed)",
                          color: "var(--current-text-normal)",
                        }}
                      >
                        {group.items.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Outside of work */}
              <motion.section
                style={{ marginBottom: "var(--space-16)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="font-heading font-bold"
                  style={{
                    fontSize: "var(--text-2xl)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-normal)",
                    color: "var(--current-text-bold)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  Outside of work
                </h2>
                <p
                  className="font-body"
                  style={{
                    fontSize: "var(--text-base)",
                    lineHeight: "var(--leading-relaxed)",
                    letterSpacing: "var(--tracking-normal)",
                    color: "var(--current-text-normal)",
                  }}
                >
                  {hobbies}
                </p>
              </motion.section>

              {/* Contact */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="font-heading font-bold"
                  style={{
                    fontSize: "var(--text-2xl)",
                    lineHeight: "var(--leading-tight)",
                    letterSpacing: "var(--tracking-normal)",
                    color: "var(--current-text-bold)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  Get in touch
                </h2>
                <p
                  className="font-body"
                  style={{
                    fontSize: "var(--text-base)",
                    lineHeight: "var(--leading-relaxed)",
                    color: "var(--current-text-normal)",
                    marginBottom: "var(--space-6)",
                  }}
                >
                  If you have a project or just want to chat, feel free to reach out.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="font-body font-medium"
                    style={{
                      padding: "var(--space-3) var(--space-5)",
                      fontSize: "var(--text-base)",
                      backgroundColor: "var(--current-text-bold)",
                      color: "var(--background)",
                      borderRadius: "var(--radius-lg)",
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    Email
                  </a>
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body font-medium"
                      style={{
                        padding: "var(--space-3) var(--space-5)",
                        fontSize: "var(--text-base)",
                        backgroundColor: "var(--card)",
                        color: "var(--current-text-bold)",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--card-border)",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      GitHub
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body font-medium"
                      style={{
                        padding: "var(--space-3) var(--space-5)",
                        fontSize: "var(--text-base)",
                        backgroundColor: "var(--card)",
                        color: "var(--current-text-bold)",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--card-border)",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      LinkedIn
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body font-medium"
                      style={{
                        padding: "var(--space-3) var(--space-5)",
                        fontSize: "var(--text-base)",
                        backgroundColor: "var(--card)",
                        color: "var(--current-text-bold)",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--card-border)",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      X
                    </a>
                  )}
                </div>
              </motion.section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
