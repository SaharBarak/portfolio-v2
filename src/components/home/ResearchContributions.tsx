"use client";

import { motion } from "framer-motion";

const research = [
  {
    title: "Detecting White Hydrogen Seeps by Examining Satellite Data",
    description: "Using machine learning and satellite imagery to identify potential white hydrogen deposits for clean energy extraction."
  },
  {
    title: "Gossip Verification",
    description: "A novel approach to verifying information spread through decentralized networks using cryptographic proofs."
  },
  {
    title: "Massive Context Tree Hashing",
    description: "Efficient data structures for handling large-scale context in distributed systems."
  },
  {
    title: "SDS & Password Deprecation",
    description: "Research into secure digital signatures as a replacement for traditional password-based authentication."
  },
  {
    title: "SEL-DID",
    description: "Self-Evolving Ledger Decentralized Identity - a framework for privacy-preserving identity management."
  }
];

export default function ResearchContributions() {
  return (
    <section
      className="w-full relative section-dark"
      style={{ padding: 'var(--space-48) var(--space-8)' }}
      aria-labelledby="research-title"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <motion.span
          className="inline-block text-cyan-500 font-semibold uppercase"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-widest)',
            marginBottom: 'var(--space-8)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Research & Ideas
        </motion.span>

        {/* Main Heading */}
        <motion.h2
          id="research-title"
          className="font-heading font-black tracking-tight"
          style={{
            fontSize: 'var(--text-6xl)',
            lineHeight: 'var(--leading-none)',
            color: 'var(--current-text-bold)',
            marginBottom: 'var(--space-8)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Thought Leadership
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="max-w-2xl"
          style={{
            fontSize: 'var(--text-xl)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--current-text-light)',
            marginBottom: 'var(--space-32)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Research papers and ideas that sparked my interest and inspired me to bring them to life.
        </motion.p>

        {/* Research Items */}
        <div>
          {research.map((item, index) => (
            <motion.article
              key={index}
              className="border-t group cursor-pointer"
              style={{
                borderColor: 'var(--card-border)',
                padding: 'var(--space-12) 0',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="flex items-start justify-between" style={{ gap: 'var(--space-8)' }}>
                <div className="flex-1">
                  <h3
                    className="font-heading font-semibold group-hover:opacity-70 transition-opacity"
                    style={{
                      fontSize: 'var(--text-2xl)',
                      color: 'var(--current-text-bold)',
                      marginBottom: 'var(--space-4)',
                      lineHeight: 'var(--leading-snug)',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--text-md)',
                      lineHeight: 'var(--leading-relaxed)',
                      color: 'var(--current-text-light)',
                      maxWidth: '40rem',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
                <span
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 group-hover:translate-x-2"
                  style={{
                    fontSize: 'var(--text-3xl)',
                    color: 'var(--current-text-light)',
                  }}
                >
                  →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
