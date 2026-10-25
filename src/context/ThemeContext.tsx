import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { siteConfig, themePresets, contentPacks } from '../config/site.config';
import { SiteCategory, ThemePreset, ContentPack } from '../types';
import { ThemeConfig } from '../config/site.config';

interface ThemeContextType {
  activeCategory: SiteCategory;
  setCategory: (category: SiteCategory) => void;
  activeTheme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  currentContent: ContentPack;
  currentThemeConfig: ThemeConfig;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const CATEGORY_STORAGE_KEY = 'wayfarer_active_category';
const THEME_STORAGE_KEY = 'wayfarer_active_theme';

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCategory, setActiveCategoryState] = useState<SiteCategory>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CATEGORY_STORAGE_KEY) as SiteCategory;
      if (saved && (saved === 'pakistan' || saved === 'travel' || saved === 'fitness' || saved === 'food')) {
        return saved;
      }
    }
    return siteConfig.activeCategory;
  });

  const [activeTheme, setActiveThemeState] = useState<ThemePreset>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreset;
      if (saved && (saved === 'cinematic-amber' || saved === 'clean-light' || saved === 'bold-neon')) {
        return saved;
      }
    }
    return siteConfig.activeTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return activeTheme !== 'clean-light';
  });

  const setCategory = (category: SiteCategory) => {
    setActiveCategoryState(category);
    try {
      localStorage.setItem(CATEGORY_STORAGE_KEY, category);
    } catch {
      // ignore
    }
  };

  const setTheme = (theme: ThemePreset) => {
    setActiveThemeState(theme);
    setIsDarkMode(theme !== 'clean-light');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setTheme('clean-light');
    } else {
      setTheme('cinematic-amber');
    }
  };

  const currentContent = useMemo(() => {
    return contentPacks[activeCategory] || contentPacks.travel;
  }, [activeCategory]);

  const currentThemeConfig = useMemo(() => {
    return themePresets[activeTheme] || themePresets['cinematic-amber'];
  }, [activeTheme]);

  // Inject CSS variables directly into root document element
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentThemeConfig.colors;

    root.style.setProperty('--color-bg', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-hover', colors.surfaceHover);
    root.style.setProperty('--color-surface-border', colors.surfaceBorder);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-hover', colors.accentHover);
    root.style.setProperty('--color-accent-glow', colors.accentGlow);
    root.style.setProperty('--color-accent-text', colors.accentText);

    if (activeTheme === 'clean-light') {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.textPrimary;
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.textPrimary;
    }
  }, [currentThemeConfig, activeTheme]);

  return (
    <ThemeContext.Provider
      value={{
        activeCategory,
        setCategory,
        activeTheme,
        setTheme,
        currentContent,
        currentThemeConfig,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
