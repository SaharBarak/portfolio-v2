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
        {/* Featured Work Section */}
        <FeaturedWork />

        {/* Freelance/Client Work Section */}
        <FreelanceShowcase />

        {/* Research & Contributions Section */}
        <ResearchContributions />

        {/* Open Source Code Section */}
        <OpenSourceCode />

        {/* Blog Preview Section */}
        <BlogPreview />

        {/* Contact/CTA Section */}
        <section
          className="relative"
          style={{ padding: 'var(--space-64) var(--space-8)' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="font-heading font-black tracking-tight leading-none"
              style={{
                fontSize: 'clamp(1.75rem, 7vw, var(--text-5xl))',
                color: 'var(--current-text-bold)',
                marginBottom: 'var(--space-8)',
              }}
            >
              Let&apos;s Work Together
            </h2>
            <p
              className="font-body max-w-xl mx-auto"
              style={{
                fontSize: 'var(--text-xl)',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--current-text-light)',
                marginBottom: 'var(--space-12)',
              }}
            >
              Have a project in mind? I&apos;d love to hear about it.
            </p>
            <a
              href="https://calendly.com/sahar-h-barak/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[var(--radius-full)] font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
              style={{
                padding: 'var(--space-5) var(--space-10)',
                fontSize: 'var(--text-md)',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              Book a Call
            </a>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
