"use client";

import { motion } from 'framer-motion';
import { LINKS } from '@/config/links';

export default function SocialButton() {
  return (
    <motion.a
      href={LINKS.social.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className="fab-button"
      style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 9999 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
      aria-label="Follow on X"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </motion.a>
  );
}
