"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

interface BlogHeaderProps {
  title?: string;
  showTitle?: boolean;
}

export default function BlogHeader({ title, showTitle = true }: BlogHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Smooth spring animation for transform
  const springConfig = { stiffness: 400, damping: 30 };
  const yValue = useMotionValue(isVisible ? 0 : -100);
  const translateY = useSpring(yValue, springConfig);

  // Update yValue when visibility changes
  useEffect(() => {
    yValue.set(isVisible ? 0 : -100);
  }, [isVisible, yValue]);

  useEffect(() => {
    let ticking = false;
    const scrollThreshold = 10; // Minimum scroll to trigger hide/show

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - lastScrollY.current;

          // Update scrolled state (for background blur)
          setIsScrolled(currentScrollY > 50);

          // Only update visibility if scroll is significant
          if (Math.abs(scrollDiff) > scrollThreshold) {
            if (scrollDiff > 0 && currentScrollY > 100) {
              // Scrolling down & past threshold - hide header
              setIsVisible(false);
            } else if (scrollDiff < 0) {
              // Scrolling up - show header
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`blog-scroll-header ${isScrolled ? "scrolled" : ""}`}
      style={{ y: translateY }}
      initial={{ y: 0 }}
    >
      <div className="blog-scroll-header-inner">
        {/* Back link */}
        <Link href="/blog" className="blog-scroll-header-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          <span>Blog</span>
        </Link>

        {/* Title (shows when scrolled) */}
        {showTitle && title && (
          <motion.div
            className="blog-scroll-header-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span>{title}</span>
          </motion.div>
        )}

        {/* Right actions */}
        <div className="blog-scroll-header-actions">
          <button
            className="blog-scroll-header-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
