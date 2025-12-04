"use client";

import React from 'react';
import Link from 'next/link';
import { LINKS } from '@/config/links';

const Footer = () => {
  return (
    <footer className="footer relative w-full py-16 pb-8 bg-[color:var(--color-bg)] border-t border-[color:var(--card-border)]">
      <div className="footer-container max-w-[1200px] mx-auto px-8">
        {/* Top section - Branding and Navigation */}
        <div className="footer-top grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-8 pb-12 border-b border-[color:var(--card-border)]">
          {/* Branding */}
          <div className="footer-brand max-w-[320px] md:text-left text-center mx-auto md:mx-0">
            <h2 className="footer-name font-heading text-2xl font-bold text-[color:var(--text-strong)] mb-3 tracking-tight">
              Sahar Barak
            </h2>
            <p className="footer-tagline font-body text-sm leading-relaxed text-[color:var(--text-light)]">
              Software Engineer building at the intersection of AI, clean energy, and developer tools
            </p>
          </div>

          {/* Navigation columns */}
          <div className="footer-nav-columns grid grid-cols-3 gap-8 text-center md:text-left">
            {/* Explore */}
            <div className="footer-nav-column flex flex-col">
              <h3 className="footer-nav-title text-xs font-semibold tracking-[0.1em] text-[color:var(--text-light)] mb-5 uppercase">
                EXPLORE
              </h3>
              <nav className="footer-nav-links flex flex-col gap-3">
                <Link href="/about" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  About
                </Link>
                <Link href="/ideas" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Ideas
                </Link>
                <Link href="/now" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Now
                </Link>
                <a href="#featured-work" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Projects
                </a>
              </nav>
            </div>

            {/* Connect */}
            <div className="footer-nav-column flex flex-col">
              <h3 className="footer-nav-title text-xs font-semibold tracking-[0.1em] text-[color:var(--text-light)] mb-5 uppercase">
                CONNECT
              </h3>
              <nav className="footer-nav-links flex flex-col gap-3">
                <a href={LINKS.social.github} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  GitHub
                </a>
                <a href={LINKS.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  LinkedIn
                </a>
                <a href={LINKS.social.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Twitter
                </a>
                <a href={LINKS.social.discord} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Discord
                </a>
                <a href={LINKS.social.huggingface} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  HuggingFace
                </a>
              </nav>
            </div>

            {/* Support */}
            <div className="footer-nav-column flex flex-col">
              <h3 className="footer-nav-title text-xs font-semibold tracking-[0.1em] text-[color:var(--text-light)] mb-5 uppercase">
                SUPPORT
              </h3>
              <nav className="footer-nav-links flex flex-col gap-3">
                <a href={LINKS.support.patreon} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Patreon
                </a>
                <a href={LINKS.professional.calendly.thirtyMin} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  Book a Call
                </a>
                <a href="https://beactive.co.il/project/86508" target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--text)] hover:text-[color:var(--text-strong)] transition-all duration-200 hover:translate-x-1">
                  BeActive
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom section - Copyright and Legal */}
        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center pt-8 gap-4 text-center">
          <p className="footer-copyright text-sm text-[color:var(--text-light)]">
            &copy; {new Date().getFullYear()} Sahar Barak. All rights reserved.
          </p>
          <div className="footer-legal flex gap-6">
            <a href="/privacy" className="text-sm text-[color:var(--text-light)] hover:text-[color:var(--text-strong)] transition-colors duration-200">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-[color:var(--text-light)] hover:text-[color:var(--text-strong)] transition-colors duration-200">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
