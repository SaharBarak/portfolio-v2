"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface BlogCoverProps {
  coverImage?: string;
  title: string;
  slug: string;
  tags?: string[];
  size?: "small" | "medium" | "large" | "hero";
  className?: string;
}

// Generate a consistent gradient based on string hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Predefined gradient palettes for visual variety
const GRADIENT_PALETTES = [
  { from: "#6366f1", via: "#8b5cf6", to: "#a855f7" }, // Indigo to Purple
  { from: "#3b82f6", via: "#6366f1", to: "#8b5cf6" }, // Blue to Indigo
  { from: "#14b8a6", via: "#06b6d4", to: "#3b82f6" }, // Teal to Blue
  { from: "#f97316", via: "#ef4444", to: "#ec4899" }, // Orange to Pink
  { from: "#10b981", via: "#14b8a6", to: "#06b6d4" }, // Emerald to Cyan
  { from: "#8b5cf6", via: "#ec4899", to: "#f43f5e" }, // Purple to Rose
  { from: "#f59e0b", via: "#f97316", to: "#ef4444" }, // Amber to Red
  { from: "#06b6d4", via: "#0ea5e9", to: "#6366f1" }, // Cyan to Indigo
];

// Icon patterns for different topics
const TOPIC_ICONS: Record<string, string> = {
  engineering: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  ai: "M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z",
  product: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  design: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z",
  career: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 7h20M2 21h20",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  default: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
};

const SIZE_CONFIG = {
  small: { width: 120, height: 80, iconSize: 24 },
  medium: { width: 300, height: 160, iconSize: 32 },
  large: { width: 600, height: 320, iconSize: 48 },
  hero: { width: 1200, height: 400, iconSize: 64 },
};

export default function BlogCover({
  coverImage,
  title,
  slug,
  tags = [],
  size = "medium",
  className = "",
}: BlogCoverProps) {
  const config = SIZE_CONFIG[size];

  // Generate consistent gradient based on slug
  const gradient = useMemo(() => {
    const hash = hashString(slug);
    return GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length];
  }, [slug]);

  // Get icon based on first tag
  const iconPath = useMemo(() => {
    const primaryTag = tags[0]?.toLowerCase() || "";
    return TOPIC_ICONS[primaryTag] || TOPIC_ICONS.default;
  }, [tags]);

  // Generate pattern seed for unique patterns
  const patternSeed = useMemo(() => hashString(slug + title), [slug, title]);

  if (coverImage) {
    return (
      <div className={`blog-cover blog-cover-${size} ${className}`}>
        <Image
          src={coverImage}
          alt={title}
          width={config.width}
          height={config.height}
          className="blog-cover-image"
          priority={size === "hero"}
        />
      </div>
    );
  }

  // Auto-generated cover with gradient and pattern
  return (
    <div
      className={`blog-cover blog-cover-generated blog-cover-${size} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`,
      }}
    >
      {/* Decorative pattern overlay */}
      <svg
        className="blog-cover-pattern"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`pattern-${slug}`}
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={(patternSeed % 10) + 5}
              cy={(patternSeed % 8) + 6}
              r="1.5"
              fill="rgba(255,255,255,0.1)"
            />
            <circle
              cx={(patternSeed % 15) + 2}
              cy={(patternSeed % 12) + 4}
              r="1"
              fill="rgba(255,255,255,0.08)"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#pattern-${slug})`} />
      </svg>

      {/* Gradient mesh effect */}
      <div className="blog-cover-mesh" />

      {/* Center icon */}
      <motion.div
        className="blog-cover-icon"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width={config.iconSize}
          height={config.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
      </motion.div>

      {/* Title overlay for larger sizes */}
      {(size === "large" || size === "hero") && (
        <div className="blog-cover-title-overlay">
          <h3 className="blog-cover-title">{title}</h3>
        </div>
      )}
    </div>
  );
}

// Utility to generate OG image URL (can be used for meta tags)
export function generateOGImageUrl(title: string, tags: string[] = []): string {
  const params = new URLSearchParams({
    title,
    tags: tags.slice(0, 3).join(","),
  });
  return `/api/og?${params.toString()}`;
}
