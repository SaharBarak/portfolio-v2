"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearch } from "@/hooks/useContent";

// Helper to determine link type from URL
function getLinkType(url: string): 'github' | 'huggingface' | 'arxiv' | 'linkedin' | 'twitter' | 'devto' | 'demo' | 'paper' {
  if (url.includes('github.com')) return 'github';
  if (url.includes('huggingface.co')) return 'huggingface';
  if (url.includes('arxiv.org')) return 'arxiv';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('dev.to')) return 'devto';
  return 'demo';
}

interface ResearchLink {
  type: 'github' | 'huggingface' | 'arxiv' | 'linkedin' | 'twitter' | 'devto' | 'demo' | 'paper';
  url: string;
  label?: string;
}

type ResearchField = 'ML' | 'Blockchain' | 'Cryptography' | 'Identity' | 'LLM' | 'Clean Energy';

interface ResearchItem {
  title: string;
  subtitle: string;
  description: string;
  status: 'active' | 'research' | 'concept';
  field: ResearchField;
  references?: string[];
  links: ResearchLink[];
}

const fieldColors: Record<ResearchField, string> = {
  'ML': '#f59e0b',
  'Blockchain': '#3b82f6',
  'Cryptography': '#ec4899',
  'Identity': '#8b5cf6',
  'LLM': '#10b981',
  'Clean Energy': '#22d3ee',
};

// Fallback data for when Convex is loading or unavailable
const fallbackResearch: ResearchItem[] = [
  {
    title: "White Hydrogen Detection",
    subtitle: "Geospatial ML for Natural Hydrogen Discovery",
    description: "Applying satellite imagery analysis and machine learning to identify naturally occurring white hydrogen seeps—a potentially game-changing clean energy source. Research focuses on spectral signatures, geological correlates, and scalable detection pipelines.",
    status: 'research',
    field: 'Clean Energy',
    references: [
      "Zgonnik, V. (2020). The occurrence and geoscience of natural hydrogen",
      "Prinzhofer, A. et al. (2018). Discovery of large hydrogen seep in Mali"
    ],
    links: [
      { type: 'github', url: 'https://github.com/SaharBarak', label: 'Code' },
      { type: 'paper', url: '#', label: 'Draft' },
      { type: 'linkedin', url: 'https://linkedin.com/in/saharbarak', label: 'Article' },
    ],
  },
  {
    title: "Gossip Verification Protocol",
    subtitle: "Abuse-Resistant Reputation from Human Signals",
    description: "A cryptographic protocol for transforming informal human signals—reviews, warnings, endorsements—into verifiable, sybil-resistant reputation scores. Designed for rental markets, hiring, and trust networks where traditional verification fails.",
    status: 'active',
    field: 'Cryptography',
    references: [
      "Resnick, P. et al. (2000). Reputation Systems",
      "Kamvar, S. et al. (2003). The EigenTrust Algorithm"
    ],
    links: [
      { type: 'github', url: 'https://github.com/SaharBarak', label: 'Spec' },
      { type: 'arxiv', url: '#', label: 'Preprint' },
      { type: 'twitter', url: 'https://twitter.com/SaharBarak', label: 'Thread' },
    ],
  },
  {
    title: "Massive Context Tree Hashing",
    subtitle: "Composable Fingerprints for Large Histories",
    description: "Novel hashing scheme for representing large conversation histories, identity graphs, and document trees as compact, composable fingerprints. Enables verification and selective disclosure without transmitting full context.",
    status: 'concept',
    field: 'LLM',
    references: [
      "Merkle, R. (1987). A Digital Signature Based on a Conventional Encryption Function",
      "Benet, J. (2014). IPFS - Content Addressed, Versioned, P2P File System"
    ],
    links: [
      { type: 'devto', url: 'https://dev.to/saharbarak', label: 'Explainer' },
      { type: 'github', url: 'https://github.com/SaharBarak', label: 'RFC' },
    ],
  },
  {
    title: "Social Digital Signature (SDS)",
    subtitle: "Graph-Based Identity Authentication",
    description: "Authentication mechanism derived from the unique structure of a user's social and data graph. Provides passwordless login and strong anti-sybil guarantees without relying on centralized identity providers or biometrics.",
    status: 'research',
    field: 'Identity',
    references: [
      "Naor, M. (1996). Verification of a Human in the Loop",
      "Douceur, J. (2002). The Sybil Attack"
    ],
    links: [
      { type: 'arxiv', url: 'https://arxiv.org', label: 'Paper' },
      { type: 'huggingface', url: 'https://huggingface.co/SaharBarak', label: 'Model' },
      { type: 'demo', url: '#', label: 'Demo' },
    ],
  },
  {
    title: "SEL-DID",
    subtitle: "Self-Evident Layer Decentralized Identifier",
    description: "A portable identity standard combining cryptographic proofs with social graph attestations. Your identity travels with you across platforms, strengthened by cross-platform behavioral consistency rather than any single authority.",
    status: 'active',
    field: 'Blockchain',
    references: [
      "W3C DID Core Specification (2022)",
      "Allen, C. (2016). The Path to Self-Sovereign Identity"
    ],
    links: [
      { type: 'github', url: 'https://github.com/SaharBarak', label: 'Repo' },
      { type: 'paper', url: '#', label: 'Whitepaper' },
      { type: 'demo', url: '#', label: 'Demo' },
    ],
  }
];

const linkIcons: Record<string, React.ReactNode> = {
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  huggingface: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17zM8.5 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-7.5 6s1 2 4 2 4-2 4-2"/>
    </svg>
  ),
  arxiv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/>
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  devto: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .65-.08.84-.23.21-.17.31-.48.31-.95v-2c0-.47-.1-.77-.31-.95zM0 4v16h24V4H0zm8.56 11.15c-.24.36-.66.56-1.14.56H5.08V8.29h2.28c.55 0 .98.18 1.22.54.24.36.37.93.37 1.7v2.92c0 .75-.12 1.33-.39 1.7zm5.03-5.08h-2.1v1.95h1.52v1.26h-1.52v1.95h2.1v1.26h-2.89V8.29h2.89v1.78zm5.08 5.93c-.3.46-.73.69-1.31.69-.53 0-.93-.16-1.2-.49-.27-.33-.41-.85-.41-1.55V9.52c0-.73.13-1.26.4-1.59.28-.34.68-.51 1.21-.51.58 0 1.01.23 1.31.69.3.46.45 1.13.45 2.02v1.5c0 .89-.15 1.56-.45 2.02z"/>
    </svg>
  ),
  demo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
    </svg>
  ),
  paper: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', label: 'Active' },
  research: { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4', label: 'Research' },
  concept: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', label: 'Concept' },
};

function ResearchListItem({
  item,
  index,
  isSelected,
  onClick
}: {
  item: ResearchItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const status = statusColors[item.status];
  const fieldColor = fieldColors[item.field];

  return (
    <div
      className={`research-list-item ${isSelected ? 'is-selected' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                fontSize: '0.55rem',
                fontWeight: 600,
                color: fieldColor,
                backgroundColor: `${fieldColor}15`,
                letterSpacing: '0.02em',
              }}
            >
              {item.field}
            </span>
            <span
              className="uppercase tracking-wider"
              style={{
                fontSize: '0.5rem',
                fontWeight: 600,
                color: status.text,
                letterSpacing: '0.08em',
              }}
            >
              {status.label}
            </span>
          </div>
          <h3
            className="font-heading font-bold text-left"
            style={{
              fontSize: 'var(--text-base)',
              color: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-left mt-1"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(255, 255, 255, 0.45)',
              lineHeight: 1.4,
            }}
          >
            {item.subtitle}
          </p>
        </div>

        {/* Links + Expand indicator */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          {item.links.slice(0, 2).map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="research-link"
              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
              title={link.label || link.type}
              onClick={(e) => e.stopPropagation()}
            >
              {linkIcons[link.type]}
            </a>
          ))}

          {/* Expand indicator */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                transform: isSelected ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ item, isLoading, onClose }: { item: ResearchItem | null; isLoading: boolean; onClose: () => void }) {
  const status = item ? statusColors[item.status] : statusColors.active;
  const fieldColor = item ? fieldColors[item.field] : '#8b5cf6';

  // Skeleton component for the panel
  const SkeletonContent = () => (
    <>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-[80px] h-[24px] rounded-full" />
          <Skeleton className="w-[60px] h-[18px]" />
        </div>
        <Skeleton className="w-[85%] h-[32px] mb-3" />
        <Skeleton className="w-[65%] h-[20px]" />
      </div>

      {/* Description skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="w-full h-[18px]" />
        <Skeleton className="w-[97%] h-[18px]" />
        <Skeleton className="w-[92%] h-[18px]" />
        <Skeleton className="w-[85%] h-[18px]" />
        <Skeleton className="w-[60%] h-[18px]" />
      </div>

      {/* References skeleton */}
      <div className="mb-8">
        <Skeleton className="w-[100px] h-[14px] mb-4" />
        <Skeleton className="w-[90%] h-[16px] mb-2" />
        <Skeleton className="w-[80%] h-[16px]" />
      </div>

      {/* Links skeleton */}
      <div className="flex items-center gap-5 pt-4">
        <Skeleton className="w-[80px] h-[28px]" />
        <Skeleton className="w-[90px] h-[28px]" />
        <Skeleton className="w-[70px] h-[28px]" />
      </div>
    </>
  );

  // No item selected - show skeleton placeholder (desktop only)
  if (!item) {
    return (
      <div className="research-detail-panel research-detail-desktop">
        <SkeletonContent />
      </div>
    );
  }

  // Loading state - show skeleton with pulse
  if (isLoading) {
    return (
      <>
        <div className="research-detail-backdrop" onClick={onClose} />
        <div className="research-detail-panel">
          <button className="research-detail-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <SkeletonContent />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div className="research-detail-backdrop" onClick={onClose} />

      <div className="research-detail-panel">
        {/* Close button (mobile) */}
        <button
          className="research-detail-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: fieldColor,
              backgroundColor: `${fieldColor}15`,
              letterSpacing: '0.02em',
            }}
          >
            {item.field}
          </span>
          <span
            className="uppercase tracking-wider"
            style={{
              fontSize: '0.55rem',
              fontWeight: 600,
              color: status?.text,
              letterSpacing: '0.08em',
            }}
          >
            {status?.label}
          </span>
        </div>
        <h3
          className="font-heading font-bold"
          style={{
            fontSize: 'var(--text-xl)',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: 1.2,
            marginBottom: 'var(--space-2)',
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500,
          }}
        >
          {item.subtitle}
        </p>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 'var(--text-sm)',
          lineHeight: 1.8,
          color: 'rgba(255, 255, 255, 0.65)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {item.description}
      </p>

      {/* References */}
      {item.references && item.references.length > 0 && (
        <div className="mb-6">
          <span
            className="uppercase tracking-wider block mb-2"
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.08em',
            }}
          >
            References
          </span>
          <div className="space-y-1">
            {item.references.map((ref, i) => (
              <p
                key={i}
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                }}
              >
                {ref}
              </p>
            ))}
          </div>
        </div>
      )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-2">
          {item.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="research-link inline-flex items-center gap-2"
              style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <span>{linkIcons[link.type]}</span>
              <span>{link.label || link.type}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ResearchContributions() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const convexResearch = useResearch();

  // Map Convex data to component format, fallback to static data while loading
  const research: ResearchItem[] = convexResearch
    ? convexResearch.map((r) => {
        // Map links array
        const links: ResearchLink[] = (r.links || []).map((l) => ({
          type: getLinkType(l.url),
          url: l.url,
          label: l.label,
        }));

        return {
          title: r.title,
          subtitle: r.subtitle,
          description: r.description,
          status: r.status,
          field: r.field as ResearchField,
          references: r.references || [],
          links,
        };
      })
    : fallbackResearch;

  const selectedItem = selectedIndex !== null ? research[selectedIndex] : null;

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }
    setIsLoading(true);
    setSelectedIndex(index);
    // Brief skeleton display before showing content
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{ padding: 'var(--space-48) var(--space-8)' }}
      aria-labelledby="research-title"
    >
      {/* Cinematic background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 70% at 50% -20%, rgba(6, 182, 212, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 100% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 50%),
            linear-gradient(180deg, #09090b 0%, #0c0c10 50%, #09090b 100%)
          `,
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span
            className="inline-block text-cyan-500 font-medium uppercase"
            style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              marginBottom: 'var(--space-3)',
            }}
          >
            Research & Ideas
          </span>

          <h2
            id="research-title"
            className="font-heading font-black tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 8vw, var(--text-6xl))',
              lineHeight: 'var(--leading-none)',
              color: 'var(--current-text-bold)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Research & Systems
          </h2>

          <p
            className="max-w-2xl"
            style={{
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--current-text-light)',
              marginBottom: 'var(--space-12)',
            }}
          >
            Where the academic-ish brain meets the builder brain. Exploring ideas at the intersection of cryptography, identity, and distributed systems.
          </p>
        </motion.div>

        {/* Master-Detail Layout */}
        <div className="research-layout">
          {/* List (left) */}
          <div className="research-list">
            {research.map((item, index) => (
              <ResearchListItem
                key={index}
                item={item}
                index={index}
                isSelected={selectedIndex === index}
                onClick={() => handleSelect(index)}
              />
            ))}
          </div>

          {/* Detail Panel (right on desktop, modal on mobile) */}
          <DetailPanel item={selectedItem} isLoading={isLoading} onClose={() => setSelectedIndex(null)} />
        </div>
      </div>

      {/* CSS */}
      <style jsx global>{`
        .research-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: var(--space-8);
          align-items: start;
        }
        @media (max-width: 768px) {
          .research-layout {
            grid-template-columns: 1fr;
          }
        }
        .research-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .research-list-item {
          text-align: left;
          padding: var(--space-3) var(--space-4);
          border-radius: 8px;
          background-color: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          opacity: 0;
          transform: translateY(10px);
          animation: researchListIn 0.3s ease forwards;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }
        @keyframes researchListIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .research-list-item:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
        .research-list-item.is-selected {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .research-detail-backdrop {
          display: none;
        }
        .research-detail-close {
          display: none;
        }
        .research-detail-panel {
          padding: var(--space-6);
          border-radius: 12px;
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          min-height: 300px;
        }
        .research-link {
          transition: color 0.15s ease;
        }
        .research-link:hover {
          color: #ffffff !important;
        }
        @media (max-width: 768px) {
          .research-detail-desktop {
            display: none;
          }
          .research-detail-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 100;
          }
          .research-detail-panel:not(.research-detail-empty) {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 101;
            max-height: 80vh;
            overflow-y: auto;
            border-radius: 20px 20px 0 0;
            background-color: #0c0c10;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: var(--space-6);
            padding-top: var(--space-8);
          }
          .research-detail-close {
            display: flex;
            position: absolute;
            top: var(--space-4);
            right: var(--space-4);
            width: 32px;
            height: 32px;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.6);
            border: none;
            cursor: pointer;
          }
          .research-detail-close:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        }
      `}</style>
    </section>
  );
}
