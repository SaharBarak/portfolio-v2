"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type CloudMode = 'artistic' | 'realistic';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: (theme?: 'dark' | 'light') => void;
  cloudMode: CloudMode;
  setCloudMode: (mode: CloudMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cloudMode, setCloudModeState] = useState<CloudMode>('realistic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    // Check localStorage for cloud mode preference
    const savedCloudMode = localStorage.getItem('cloudMode') as CloudMode | null;
    if (savedCloudMode && (savedCloudMode === 'artistic' || savedCloudMode === 'realistic')) {
      setCloudModeState(savedCloudMode);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [isDarkMode, mounted]);

  const toggleTheme = useCallback((theme?: 'dark' | 'light') => {
    if (theme) {
      setIsDarkMode(theme === 'dark');
    } else {
      setIsDarkMode(prev => !prev);
    }
  }, []);

  const setCloudMode = useCallback((mode: CloudMode) => {
    setCloudModeState(mode);
    localStorage.setItem('cloudMode', mode);
  }, []);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme, cloudMode: 'artistic', setCloudMode }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, cloudMode, setCloudMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
