"use client";

import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/hero/HeroSection';
import FeaturedWork from '@/components/home/FeaturedWork';
import ResearchContributions from '@/components/home/ResearchContributions';
import OpenSourceCode from '@/components/home/OpenSourceCode';
import SplashScreen from '@/components/SplashScreen';

// Import SkyBackground at root level to avoid transform issues
const SkyBackground = dynamic(() => import('@/components/hero/SkyBackground'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      {/* SVG Filter for Liquid Glass Effect */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter
            id="liquid-glass-filter"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="2"
              seed="3"
              result="turbulence"
            />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale="3"
              specularConstant="0.8"
              specularExponent="80"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-100" y="-100" z="200" />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Sky Background - at root level to avoid transform containment */}
      <SkyBackground />

      {/* Splash Screen - slides up to reveal site */}
      <SplashScreen />

      {/* Header - Fixed above everything */}
      <div className="header-wrapper fixed top-0 left-0 right-0 z-50">
        <div className="liquid-glass-effect" />
        <div className="liquid-glass-tint" />
        <div className="liquid-glass-shine" />
        <Header />
      </div>

      {/* Hero Section with WebGL - No background */}
      <HeroSection />

      {/* Main Content - Background starts here */}
      <main className="relative" style={{ backgroundColor: 'var(--background)' }}>
        {/* Featured Work Section */}
        <FeaturedWork />

        {/* Research & Contributions Section */}
        <ResearchContributions />

        {/* Open Source Code Section */}
        <OpenSourceCode />

        {/* Contact/CTA Section */}
        <section
          className="relative"
          style={{ padding: 'var(--space-64) var(--space-8)' }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="font-heading font-black tracking-tight leading-none"
              style={{
                fontSize: 'var(--text-5xl)',
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
