"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FontSize = "small" | "medium" | "large";
type ReaderTheme = "default" | "light" | "sepia" | "dark";

interface ReaderSettings {
  fontSize: FontSize;
  theme: ReaderTheme;
  enabled: boolean;
}

const FONT_SIZES: Record<FontSize, { label: string; size: string }> = {
  small: { label: "A", size: "0.9375rem" },
  medium: { label: "A", size: "1.0625rem" },
  large: { label: "A", size: "1.1875rem" },
};

const READER_THEMES: Record<ReaderTheme, { label: string; bg: string; text: string; icon: string }> = {
  default: { label: "Default", bg: "transparent", text: "inherit", icon: "auto" },
  light: { label: "Light", bg: "#f9f9fa", text: "#1c1c1e", icon: "☀️" },
  sepia: { label: "Sepia", bg: "#f4ecd8", text: "#5c4b37", icon: "📜" },
  dark: { label: "Dark", bg: "#0c0c0e", text: "#f5f5f7", icon: "🌙" },
};

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: "medium",
  theme: "default",
  enabled: false,
};

export default function ReaderModeToggle() {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("reader-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        applySettings(parsed);
      } catch {
        // Invalid stored data, use defaults
      }
    }
  }, []);

  // Apply settings to the document
  const applySettings = (newSettings: ReaderSettings) => {
    const article = document.querySelector(".blog-content, article");
    const wrapper = document.querySelector(".blog-page-wrapper");
    if (!article) return;

    // Remove all theme classes first
    article.classList.remove("reader-mode", "reader-theme-light", "reader-theme-sepia", "reader-theme-dark");
    wrapper?.classList.remove("reader-theme-light", "reader-theme-sepia", "reader-theme-dark");

    if (newSettings.enabled) {
      article.classList.add("reader-mode");
      (article as HTMLElement).style.setProperty("--reader-font-size", FONT_SIZES[newSettings.fontSize].size);

      if (newSettings.theme !== "default") {
        (article as HTMLElement).style.setProperty("--reader-bg", READER_THEMES[newSettings.theme].bg);
        (article as HTMLElement).style.setProperty("--reader-text", READER_THEMES[newSettings.theme].text);
        article.classList.add(`reader-theme-${newSettings.theme}`);
        wrapper?.classList.add(`reader-theme-${newSettings.theme}`);
      }
    }
  };

  const updateSettings = (newSettings: ReaderSettings) => {
    setSettings(newSettings);
    localStorage.setItem("reader-settings", JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const toggleReaderMode = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    updateSettings(newSettings);
  };

  const setFontSize = (size: FontSize) => {
    const newSettings = { ...settings, fontSize: size };
    updateSettings(newSettings);
  };

  const setTheme = (theme: ReaderTheme) => {
    const newSettings = { ...settings, theme };
    updateSettings(newSettings);
  };

  return (
    <div className="reader-mode-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`reader-mode-btn ${settings.enabled ? "active" : ""}`}
        aria-label="Reader mode settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="reader-mode-backdrop"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="reader-mode-panel"
            >
              {/* Reader Mode Toggle */}
              <div className="reader-mode-row">
                <span className="reader-mode-label">Reader Mode</span>
                <button
                  onClick={toggleReaderMode}
                  className={`reader-mode-toggle ${settings.enabled ? "enabled" : ""}`}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>

              {/* Font Size */}
              <div className="reader-mode-row">
                <span className="reader-mode-label">Font Size</span>
                <div className="reader-font-sizes">
                  {(Object.keys(FONT_SIZES) as FontSize[]).map((size, index) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`reader-font-btn ${settings.fontSize === size ? "active" : ""}`}
                      style={{ fontSize: `${12 + index * 4}px` }}
                    >
                      {FONT_SIZES[size].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="reader-mode-row">
                <span className="reader-mode-label">Theme</span>
                <div className="reader-themes">
                  {(Object.keys(READER_THEMES) as ReaderTheme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setTheme(theme)}
                      className={`reader-theme-btn ${settings.theme === theme ? "active" : ""}`}
                      style={{
                        background: theme === "default" ? "transparent" : READER_THEMES[theme].bg,
                        color: theme === "default" ? "inherit" : READER_THEMES[theme].text,
                        border: theme === "light" ? "1px solid rgba(0,0,0,0.1)" : undefined,
                      }}
                      title={READER_THEMES[theme].label}
                    >
                      {theme === "default" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      ) : theme === "light" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                        </svg>
                      ) : theme === "dark" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: "12px" }}>S</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
