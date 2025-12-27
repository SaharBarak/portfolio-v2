"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

type ReaderTheme = "default" | "light" | "sepia" | "dark";
type FontSize = "small" | "medium" | "large";

const FONT_SIZES: { id: FontSize; label: string; size: string }[] = [
  { id: "small", label: "A", size: "0.9375rem" },
  { id: "medium", label: "A", size: "1.0625rem" },
  { id: "large", label: "A", size: "1.1875rem" },
];

export default function BlogSkyToolbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("default");
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("blog-reader-theme") as ReaderTheme | null;
    const savedSize = localStorage.getItem("blog-font-size") as FontSize | null;

    if (savedTheme) {
      setReaderTheme(savedTheme);
      applyReaderTheme(savedTheme);
    }
    if (savedSize) {
      setFontSize(savedSize);
      applyFontSize(savedSize);
    }
  }, []);

  const applyReaderTheme = (theme: ReaderTheme) => {
    const wrapper = document.querySelector(".blog-page-wrapper");
    const article = document.querySelector("article");

    wrapper?.classList.remove("reader-theme-light", "reader-theme-sepia", "reader-theme-dark");
    article?.classList.remove("reader-theme-light", "reader-theme-sepia", "reader-theme-dark");

    if (theme !== "default") {
      wrapper?.classList.add(`reader-theme-${theme}`);
      article?.classList.add(`reader-theme-${theme}`);
    }
  };

  const applyFontSize = (size: FontSize) => {
    const article = document.querySelector("article");
    if (article) {
      const sizeValue = FONT_SIZES.find((f) => f.id === size)?.size || "1.0625rem";
      (article as HTMLElement).style.setProperty("--reader-font-size", sizeValue);
      article.classList.add("reader-mode");
    }
  };

  const handleReaderThemeChange = (theme: ReaderTheme) => {
    setReaderTheme(theme);
    applyReaderTheme(theme);
    localStorage.setItem("blog-reader-theme", theme);
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem("blog-font-size", size);
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0"
              style={{ zIndex: -1 }}
            />

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="blog-settings-panel"
            >
              {/* Site Theme */}
              <div className="blog-settings-group">
                <p className="blog-settings-label">Theme</p>
                <div className="blog-settings-row">
                  <button
                    onClick={() => toggleTheme("light")}
                    className={`blog-settings-btn ${!isDarkMode ? "active" : ""}`}
                    title="Light mode"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleTheme("dark")}
                    className={`blog-settings-btn ${isDarkMode ? "active" : ""}`}
                    title="Dark mode"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Reader Theme */}
              <div className="blog-settings-group">
                <p className="blog-settings-label">Reader</p>
                <div className="blog-settings-row">
                  <button
                    onClick={() => handleReaderThemeChange("default")}
                    className={`blog-settings-reader ${readerTheme === "default" ? "active" : ""}`}
                    title="Default"
                    style={{ background: "linear-gradient(135deg, var(--color-neutral-800) 50%, var(--color-neutral-100) 50%)" }}
                  />
                  <button
                    onClick={() => handleReaderThemeChange("light")}
                    className={`blog-settings-reader ${readerTheme === "light" ? "active" : ""}`}
                    title="Light"
                    style={{ background: "var(--color-neutral-100)" }}
                  />
                  <button
                    onClick={() => handleReaderThemeChange("sepia")}
                    className={`blog-settings-reader ${readerTheme === "sepia" ? "active" : ""}`}
                    title="Sepia"
                    style={{ background: "var(--color-amber-100)" }}
                  />
                  <button
                    onClick={() => handleReaderThemeChange("dark")}
                    className={`blog-settings-reader ${readerTheme === "dark" ? "active" : ""}`}
                    title="Dark"
                    style={{ background: "var(--color-neutral-900)" }}
                  />
                </div>
              </div>

              {/* Font Size */}
              <div className="blog-settings-group">
                <p className="blog-settings-label">Size</p>
                <div className="blog-settings-row">
                  {FONT_SIZES.map((size, index) => (
                    <button
                      key={size.id}
                      onClick={() => handleFontSizeChange(size.id)}
                      className={`blog-settings-font ${fontSize === size.id ? "active" : ""}`}
                      style={{ fontSize: `${12 + index * 3}px` }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Simple Toggle Button */}
      <motion.button
        className="fab-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        aria-label="Reading settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </motion.button>
    </div>
  );
}
