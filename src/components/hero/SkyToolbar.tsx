"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface SkyToolbarProps {
  isDark: boolean;
}

export default function SkyToolbar({ isDark }: SkyToolbarProps) {
  const { toggleTheme } = useTheme();

  const buttonSize = 44;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-center"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Theme toggle button - Modern glass design */}
      <motion.button
        className="relative flex items-center justify-center overflow-hidden"
        style={{
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
        }}
        onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
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
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        layout
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

        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.svg
              key="sun"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))' }}
            >
              <circle cx="12" cy="12" r="4" fill="#f59e0b" stroke="none" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#e2e8f0"
              stroke="none"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(226, 232, 240, 0.4))' }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
