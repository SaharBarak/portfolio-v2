"use client";

import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

function StatItem({
  icon,
  value,
  label,
  delay,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="author-stat-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="author-stat-icon">{icon}</div>
      <div className="author-stat-content">
        <span className="author-stat-value">{value}</span>
        <span className="author-stat-label">{label}</span>
      </div>
    </motion.div>
  );
}

export default function AuthorStatsCard() {
  const stats = useQuery(api.blog.getAuthorStats);

  if (!stats) {
    return (
      <div className="author-stats-card author-stats-loading">
        <div className="author-stats-shimmer" />
      </div>
    );
  }

  return (
    <motion.div
      className="author-stats-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="author-stats-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <span>Writing Stats</span>
      </div>

      <div className="author-stats-grid">
        <StatItem
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
          value={stats.totalPosts}
          label="Articles"
          delay={0.1}
        />

        <StatItem
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          value={formatNumber(stats.totalViews)}
          label="Total reads"
          delay={0.15}
        />

        <StatItem
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          }
          value={formatNumber(stats.totalClaps)}
          label="Claps"
          delay={0.2}
        />

        <StatItem
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          }
          value={formatNumber(stats.totalWords)}
          label="Words written"
          delay={0.25}
        />
      </div>
    </motion.div>
  );
}
