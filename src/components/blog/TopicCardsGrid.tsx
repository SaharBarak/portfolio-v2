"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TopicCardProps {
  tag: string;
  count: number;
  index: number;
}

// Topic icons and colors mapping
const TOPIC_CONFIG: Record<string, { icon: React.ReactNode; gradient: string }> = {
  engineering: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    gradient: "from-orange-500/20 to-amber-500/10",
  },
  ai: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="7.5" cy="14.5" r="1.5" />
        <circle cx="16.5" cy="14.5" r="1.5" />
      </svg>
    ),
    gradient: "from-purple-500/20 to-indigo-500/10",
  },
  product: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  design: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="10.5" r="2.5" />
        <circle cx="8.5" cy="7.5" r="2.5" />
        <circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
    gradient: "from-pink-500/20 to-rose-500/10",
  },
  career: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  default: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    gradient: "from-slate-500/20 to-zinc-500/10",
  },
};

function TopicCard({ tag, count, index }: TopicCardProps) {
  const config = TOPIC_CONFIG[tag.toLowerCase()] || TOPIC_CONFIG.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/blog/topic/${tag.toLowerCase()}`} className="topic-card">
        <div className={`topic-icon bg-gradient-to-br ${config.gradient}`}>
          {config.icon}
        </div>
        <h3 className="topic-name">{tag}</h3>
        <span className="topic-count">{count} article{count !== 1 ? "s" : ""}</span>
      </Link>
    </motion.div>
  );
}

interface TopicCardsGridProps {
  tagCounts: Record<string, number>;
}

export default function TopicCardsGrid({ tagCounts }: TopicCardsGridProps) {
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  if (sortedTags.length === 0) return null;

  return (
    <section className="topic-cards-section">
      <h2 className="section-title">Explore Topics</h2>
      <div className="topic-cards-grid">
        {sortedTags.map(([tag, count], index) => (
          <TopicCard key={tag} tag={tag} count={count} index={index} />
        ))}
      </div>
    </section>
  );
}
