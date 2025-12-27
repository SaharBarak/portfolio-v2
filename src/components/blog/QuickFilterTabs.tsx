"use client";

import React from "react";
import { motion } from "framer-motion";

export type FilterTab = "latest" | "popular" | "series";

interface QuickFilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}

const TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "latest",
    label: "Latest",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "popular",
    label: "Popular",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    id: "series",
    label: "Series",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

export default function QuickFilterTabs({ activeTab, onTabChange }: QuickFilterTabsProps) {
  return (
    <div className="filter-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`filter-tab ${activeTab === tab.id ? "active" : ""}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeFilterTab"
              className="tab-indicator"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
