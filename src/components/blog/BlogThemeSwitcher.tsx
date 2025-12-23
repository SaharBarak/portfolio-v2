"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BlogTheme = "default" | "light" | "sepia" | "dark";
type FontSize = "small" | "medium" | "large";

interface ThemeOption {
  id: BlogTheme;
  name: string;
  bg: string;
  text: string;
}

const THEMES: ThemeOption[] = [
  { id: "default", name: "Default", bg: "transparent", text: "inherit" },
  { id: "light", name: "Light", bg: "#f9f9fa", text: "#1c1c1e" },
  { id: "sepia", name: "Sepia", bg: "#f4ecd8", text: "#5c4b37" },
  { id: "dark", name: "Dark", bg: "#0c0c0e", text: "#f5f5f7" },
];

const FONT_SIZES: { id: FontSize; label: string; size: string }[] = [
  { id: "small", label: "A", size: "0.9375rem" },
  { id: "medium", label: "A", size: "1.0625rem" },
  { id: "large", label: "A", size: "1.1875rem" },
];

export default function BlogThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<BlogTheme>("default");
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("blog-reader-theme") as BlogTheme | null;
    const savedSize = localStorage.getItem("blog-font-size") as FontSize | null;

    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
    if (savedSize) {
      setFontSize(savedSize);
      applyFontSize(savedSize);
    }
  }, []);

  const applyTheme = (theme: BlogTheme) => {
    const wrapper = document.querySelector(".blog-page-wrapper");
    const article = document.querySelector("article");

    // Remove all theme classes
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
      const sizeValue = FONT_SIZES.find(f => f.id === size)?.size || "1.0625rem";
      (article as HTMLElement).style.setProperty("--reader-font-size", sizeValue);
      article.classList.add("reader-mode");
    }
  };

  const handleThemeChange = (theme: BlogTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem("blog-reader-theme", theme);
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem("blog-font-size", size);
  };

  if (!mounted) return null;

  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
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
              style={{
                position: "fixed",
                inset: 0,
                zIndex: -1,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="blog-theme-panel"
            >
              {/* Theme Selection */}
              <div style={{ marginBottom: "16px" }}>
                <p className="blog-theme-label">
                  Theme
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      title={theme.name}
                      className={`blog-theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
                      style={{
                        background: theme.id === "default"
                          ? "linear-gradient(135deg, #1a1a2e 50%, #0c0c0e 50%)"
                          : theme.bg,
                      }}
                    >
                      {theme.id === "light" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2">
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                        </svg>
                      )}
                      {theme.id === "dark" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5f5f7" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <p className="blog-theme-label">
                  Font Size
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {FONT_SIZES.map((size, index) => (
                    <button
                      key={size.id}
                      onClick={() => handleFontSizeChange(size.id)}
                      className={`blog-font-btn ${fontSize === size.id ? 'active' : ''}`}
                      style={{
                        fontSize: `${12 + index * 4}px`,
                      }}
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

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`blog-theme-toggle ${isOpen ? 'active' : ''}`}
        title="Reading settings"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </motion.button>
    </div>
  );
}
