"use client";

import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/hero/HeroSection';
import FeaturedWork from '@/components/home/FeaturedWork';
import FreelanceShowcase from '@/components/home/FreelanceShowcase';
import ResearchContributions from '@/components/home/ResearchContributions';
import OpenSourceCode from '@/components/home/OpenSourceCode';
import BlogPreview from '@/components/home/BlogPreview';
import SplashScreen from '@/components/SplashScreen';

// Import SkyBackground at root level to avoid transform issues
const SkyBackground = dynamic(() => import('@/components/hero/SkyBackground'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      {/* Sky Background - at root level to avoid transform containment */}
      <SkyBackground />

      {/* Splash Screen - slides up to reveal site */}
      <SplashScreen />

      {/* Header - Fixed above everything */}
      <div className="header-wrapper fixed top-0 left-0 right-0 z-50 pt-2 pl-2 md:pt-0 md:pl-0">
        <Header />
      </div>

      {/* Hero Section with WebGL - No background */}
      <HeroSection />

      {/* Main Content - Background starts here */}
      <main className="relative" style={{ backgroundColor: 'var(--background)' }}>
        {/* Blog Preview Section */}
        <BlogPreview />

        {/* Featured Work Section */}
        <FeaturedWork />

        {/* Freelance/Client Work Section */}
        <FreelanceShowcase />

        {/* Research & Contributions Section */}
        <ResearchContributions />

        {/* Open Source Code Section */}
        <OpenSourceCode />

        {/* Contact/CTA Section */}
        <section
          className="relative overflow-hidden"
          style={{ padding: "var(--space-24) var(--space-8)" }}
        >
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Label */}
            <p
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                letterSpacing: "var(--tracking-widest)",
                color: "#a855f7",
                marginBottom: "var(--space-4)",
              }}
            >
              Available for Projects
            </p>

            {/* Heading */}
            <h2
              className="font-heading font-bold"
              style={{
                fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
                lineHeight: "var(--leading-tight)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--current-text-bold)",
                marginBottom: "var(--space-4)",
              }}
            >
              Let&apos;s Build Something{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #a855f7, #ec4899, #6ee7b7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Amazing
              </span>
            </h2>

            {/* Description */}
            <p
              className="font-body"
              style={{
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--current-text-light)",
                maxWidth: "32rem",
                margin: "0 auto",
                marginBottom: "var(--space-8)",
              }}
            >
              AI systems, full-stack apps, or research projects — I turn ideas into production-ready products.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--space-3)" }}>
              <a
                href="https://calendly.com/sahar-h-barak/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body font-medium"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-6)",
                  fontSize: "var(--text-sm)",
                  backgroundColor: "var(--current-text-bold)",
                  color: "var(--background)",
                  borderRadius: "var(--radius-lg)",
                  transition: "opacity 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book a Call
              </a>
              <a
                href="mailto:sahar.h.barak@gmail.com"
                className="font-body font-medium"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-6)",
                  fontSize: "var(--text-sm)",
                  backgroundColor: "var(--card)",
                  color: "var(--current-text-bold)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--card-border)",
                  transition: "border-color 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Me
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
