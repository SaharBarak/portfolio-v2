"use client";

import { motion } from 'framer-motion';
import { LINKS } from '@/config/links';
import { useTheme } from '@/contexts/ThemeContext';

export default function SocialButton() {
  const { isDarkMode } = useTheme();
  const isDark = isDarkMode;
  const buttonSize = 44;

  return (
    <motion.a
      href={LINKS.social.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        pointerEvents: 'auto',
        width: buttonSize,
        height: buttonSize,
        borderRadius: 'var(--radius-full)',
        background: isDark
          ? `radial-gradient(ellipse at 30% 20%,
              rgba(255, 255, 255, 0.98) 0%,
              rgba(245, 245, 250, 0.95) 50%,
              rgba(235, 235, 245, 0.92) 100%
            )`
          : `radial-gradient(ellipse at 30% 20%,
              rgba(30, 32, 45, 0.98) 0%,
              rgba(20, 22, 35, 0.95) 50%,
              rgba(15, 16, 25, 0.92) 100%
            )`,
        boxShadow: isDark
          ? `
            0 0 0 1px rgba(255, 255, 255, 0.3),
            0 8px 24px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(255, 255, 255, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.8),
            inset 0 -1px 2px rgba(0, 0, 0, 0.1)
          `
          : `
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2)
          `,
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        textDecoration: 'none',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      whileHover={{
        scale: 1.12,
        boxShadow: isDark
          ? `
            0 0 0 2px rgba(255, 255, 255, 0.4),
            0 12px 32px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(255, 255, 255, 0.25),
            inset 0 1px 1px rgba(255, 255, 255, 0.8)
          `
          : `
            0 0 0 2px rgba(255, 255, 255, 0.15),
            0 12px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(255, 255, 255, 0.15)
          `,
      }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Subtle shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
          borderRadius: 'var(--radius-full)',
        }}
      />

      {/* X (Twitter) Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isDark ? '#1a1a2e' : '#e2e8f0'}
        style={{
          filter: isDark
            ? 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.2))'
            : 'drop-shadow(0 0 4px rgba(226, 232, 240, 0.4))',
        }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </motion.a>
  );
}
