"use client";

import React from 'react';
import Link from 'next/link';
import { LINKS } from '@/config/links';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full">
      {/* Footer Links */}
      <div
        style={{
          borderTop: '1px solid var(--card-border)',
          padding: 'var(--space-16) var(--space-6)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="grid grid-cols-2 sm:grid-cols-4"
            style={{ gap: 'var(--space-10)', marginBottom: 'var(--space-16)' }}
          >
            {/* Explore */}
            <nav>
              <h3
                className="font-body font-semibold uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-widest)',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                Explore
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { href: '/about', label: 'About' },
                  { href: '/blog', label: 'Blog' },
                  { href: '/ideas', label: 'Ideas' },
                  { href: '/now', label: 'Now' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body line"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--current-text-normal)',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Work */}
            <nav>
              <h3
                className="font-body font-semibold uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-widest)',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                Work
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { href: '#featured-work', label: 'Projects' },
                  { href: '#freelance-work', label: 'Freelance' },
                  { href: LINKS.external.twoCircleStudios, label: 'Studio', external: true },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="font-body line"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--current-text-normal)',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect */}
            <nav>
              <h3
                className="font-body font-semibold uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-widest)',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                Connect
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { href: LINKS.social.github, label: 'GitHub' },
                  { href: LINKS.social.linkedin, label: 'LinkedIn' },
                  { href: LINKS.social.twitter, label: 'Twitter' },
                  { href: LINKS.professional.whatsapp, label: 'WhatsApp' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body line"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--current-text-normal)',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* More */}
            <nav>
              <h3
                className="font-body font-semibold uppercase"
                style={{
                  fontSize: 'var(--text-xs)',
                  letterSpacing: 'var(--tracking-widest)',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                More
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { href: LINKS.social.huggingface, label: 'HuggingFace' },
                  { href: LINKS.social.substack, label: 'Substack' },
                  { href: LINKS.support.patreon, label: 'Patreon' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body line"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--current-text-normal)',
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Bottom */}
          <div
            className="tsp"
            style={{
              borderTop: '1px solid var(--card-border)',
              padding: 'var(--space-8) 0 0 0',
            }}
          >
            <p
              className="font-body"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
              }}
            >
              &copy; {currentYear} Sahar Barak
            </p>
            <p
              className="font-body flex items-center"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                gap: 'var(--space-6)',
              }}
            >
              <Link href="/privacy" className="line">Privacy</Link>
              <Link href="/terms" className="line">Terms</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
