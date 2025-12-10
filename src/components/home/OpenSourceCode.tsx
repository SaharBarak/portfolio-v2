"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface GitHubRepo {
  type: 'github';
  name: string;
  description: string;
  url: string;
  stars?: number;
  prs?: number;
  language: string;
  languageColor: string;
}

interface NpmPackage {
  type: 'npm';
  name: string;
  description: string;
  url: string;
  downloads?: string;
  version?: string;
}

type Contribution = GitHubRepo | NpmPackage;

const contributions: Contribution[] = [
  {
    type: 'github',
    name: 'karen-cli',
    description: 'CLI for running layout regression checks with AI-powered fixes',
    url: 'https://github.com/saharbarak/karen-cli',
    stars: 42,
    prs: 8,
    language: 'TypeScript',
    languageColor: '#3178c6',
  },
  {
    type: 'github',
    name: 'geoh2-ai',
    description: 'Geospatial ML for white hydrogen seep detection',
    url: 'https://github.com/SaharBarak/geoh2-ai',
    stars: 18,
    prs: 3,
    language: 'Python',
    languageColor: '#3572A5',
  },
  {
    type: 'npm',
    name: '@anthropic-ai/claude-code',
    description: 'Contributor - CLI tool for Claude AI assistance',
    url: 'https://www.npmjs.com/package/@anthropic-ai/claude-code',
    downloads: '50k+/week',
    version: '1.0.0',
  },
  {
    type: 'github',
    name: 'sel-did',
    description: 'Self-Evident Layer DID - Portable decentralized identity',
    url: 'https://github.com/SaharBarak/sel-did',
    stars: 24,
    prs: 5,
    language: 'Rust',
    languageColor: '#dea584',
  },
  {
    type: 'npm',
    name: 'karen-cli',
    description: 'Layout regression testing CLI with AI integration',
    url: 'https://www.npmjs.com/package/karen-cli',
    downloads: '2.1k/week',
    version: '0.4.2',
  },
  {
    type: 'github',
    name: 'gossip-protocol',
    description: 'Abuse-resistant reputation verification protocol',
    url: 'https://github.com/SaharBarak/gossip-protocol',
    stars: 31,
    prs: 12,
    language: 'Go',
    languageColor: '#00ADD8',
  },
];

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
    </svg>
  );
}

function PRIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="18" r="3"/>
      <circle cx="6" cy="6" r="3"/>
      <path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  );
}

function ContributionCard({ item, index }: { item: Contribution; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const isGitHub = item.type === 'github';

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: 'var(--space-5)',
        borderRadius: '12px',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
        border: '1px solid',
        borderColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Header with icon and type */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            style={{
              color: isGitHub ? 'rgba(255, 255, 255, 0.7)' : '#cb3837',
            }}
          >
            {isGitHub ? <GitHubIcon /> : <NpmIcon />}
          </span>
          <span
            className="uppercase tracking-wider"
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: isGitHub ? 'rgba(255, 255, 255, 0.4)' : '#cb3837',
              letterSpacing: '0.08em',
            }}
          >
            {isGitHub ? 'Repository' : 'Package'}
          </span>
        </div>

        {/* External link icon */}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
          animate={{ x: isHovered ? 2 : 0, y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
        </motion.svg>
      </div>

      {/* Package/Repo name */}
      <h3
        className="font-mono font-semibold transition-colors duration-200"
        style={{
          fontSize: 'var(--text-base)',
          color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {item.name}
      </h3>

      {/* Description */}
      <p
        className="transition-colors duration-200"
        style={{
          fontSize: '0.8rem',
          lineHeight: 1.5,
          color: isHovered ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.5)',
          marginBottom: 'var(--space-4)',
          minHeight: '2.25rem',
        }}
      >
        {item.description}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-4">
        {isGitHub ? (
          <>
            {/* Language */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: (item as GitHubRepo).languageColor }}
              />
              <span
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                {(item as GitHubRepo).language}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <StarIcon />
              <span style={{ fontSize: '0.7rem' }}>{(item as GitHubRepo).stars}</span>
            </div>

            {/* PRs */}
            <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <PRIcon />
              <span style={{ fontSize: '0.7rem' }}>{(item as GitHubRepo).prs} PRs</span>
            </div>
          </>
        ) : (
          <>
            {/* Version */}
            <span
              className="px-2 py-0.5 rounded"
              style={{
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(203, 56, 55, 0.15)',
                color: '#cb3837',
              }}
            >
              v{(item as NpmPackage).version}
            </span>

            {/* Downloads */}
            <div className="flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              <DownloadIcon />
              <span style={{ fontSize: '0.7rem' }}>{(item as NpmPackage).downloads}</span>
            </div>
          </>
        )}
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isGitHub
            ? 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 0%, rgba(203, 56, 55, 0.08) 0%, transparent 60%)',
          borderRadius: '12px',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </motion.a>
  );
}

export default function OpenSourceCode() {
  return (
    <section
      className="w-full relative"
      style={{ padding: 'var(--space-48) var(--space-8)' }}
      aria-labelledby="opensource-title"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <motion.p
          className="font-medium uppercase"
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            color: '#F97316',
            marginBottom: 'var(--space-3)',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Open Source
        </motion.p>

        {/* Main Heading */}
        <motion.h2
          id="opensource-title"
          className="font-heading font-black tracking-tight"
          style={{
            fontSize: 'clamp(2rem, 8vw, var(--text-6xl))',
            lineHeight: 'var(--leading-none)',
            color: 'var(--current-text-bold)',
            marginBottom: 'var(--space-4)',
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Contributions
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="max-w-2xl"
          style={{
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--current-text-light)',
            marginBottom: 'var(--space-12)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Repositories, packages, and tools released to support other builders.
        </motion.p>

        {/* Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {contributions.map((item, index) => (
            <ContributionCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
