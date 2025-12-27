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
import { AvailabilityBadge } from '@/components/ui/AvailabilityBadge';
import { LINKS } from '@/config/links';

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
          style={{ padding: "var(--space-48) var(--space-8)" }}
        >
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Availability Badge */}
            <div style={{ marginBottom: "var(--space-4)" }}>
              <AvailabilityBadge showCalendly={false} />
            </div>

            {/* Heading */}
            <h2
              className="font-heading font-black tracking-tight"
              style={{
                fontSize: "clamp(2rem, 8vw, var(--text-6xl))",
                lineHeight: "var(--leading-none)",
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
                href={LINKS.professional.whatsapp}
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
                  backgroundColor: "#25D366",
                  color: "#ffffff",
                  borderRadius: "var(--radius-lg)",
                  transition: "opacity 0.2s ease",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={LINKS.professional.email}
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
