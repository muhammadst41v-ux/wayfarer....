import { travelContent } from '../data/travel';
import { fitnessContent } from '../data/fitness';
import { foodContent } from '../data/food';
import { pakistanContent } from '../data/pakistan';
import { ContentPack, SiteCategory, ThemePreset } from '../types';

/**
 * =====================================================================
 * WAYFARER GLOBAL CONFIGURATION
 * =====================================================================
 * 
 * TO CHANGE THE CATEGORY IN 5 MINUTES:
 * Simply change the value of `activeCategory` below to:
 * - 'pakistan' -> Wayfarer Pakistan: 20+ destinations across Karakorams & Silk Road
 * - 'travel'   -> Wayfarer: City, architecture, underground culture
 * - 'fitness'  -> Wayfarer Kinetic: Athletic camps, altitude, recovery
 * - 'food'     -> Wayfarer Palate: Street markets, supper clubs, ferments
 * =====================================================================
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentGlow: string;
  accentText: string;
}

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  colors: ThemeColors;
}

export const themePresets: Record<ThemePreset, ThemeConfig> = {
  'cinematic-amber': {
    id: 'cinematic-amber',
    name: 'Cinematic Amber',
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    colors: {
      background: '#0b0d10',
      surface: '#13171d',
      surfaceHover: '#1a2028',
      surfaceBorder: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#f3f4f6',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      accent: '#f59e0b',
      accentHover: '#fbbf24',
      accentGlow: 'rgba(245, 158, 11, 0.35)',
      accentText: '#0b0d10',
    },
  },
  'clean-light': {
    id: 'clean-light',
    name: 'Clean Light Architectural',
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    colors: {
      background: '#faf9f6',
      surface: '#ffffff',
      surfaceHover: '#f4f3ef',
      surfaceBorder: 'rgba(15, 23, 42, 0.08)',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      accent: '#b45309',
      accentHover: '#92400e',
      accentGlow: 'rgba(180, 83, 9, 0.25)',
      accentText: '#ffffff',
    },
  },
  'bold-neon': {
    id: 'bold-neon',
    name: 'Bold Neon Noir',
    fontDisplay: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    colors: {
      background: '#070709',
      surface: '#101116',
      surfaceHover: '#181920',
      surfaceBorder: 'rgba(6, 182, 212, 0.2)',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      accent: '#06b6d4',
      accentHover: '#22d3ee',
      accentGlow: 'rgba(6, 182, 212, 0.45)',
      accentText: '#070709',
    },
  },
};

export const contentPacks: Record<SiteCategory, ContentPack> = {
  pakistan: pakistanContent,
  travel: travelContent,
  fitness: fitnessContent,
  food: foodContent,
};

export interface SiteConfig {
  activeCategory: SiteCategory;
  activeTheme: ThemePreset;
  availableCategories: { id: SiteCategory; label: string; description: string }[];
  availableThemes: { id: ThemePreset; label: string }[];
  contentPacks: Record<SiteCategory, ContentPack>;
  themePresets: Record<ThemePreset, ThemeConfig>;
  apiEndpoints: {
    contact: string;
    chat: string;
    newsletter: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
}

export const siteConfig: SiteConfig = {
  // SWITCH ACTIVE CATEGORY HERE ('pakistan' | 'travel' | 'fitness' | 'food')
  activeCategory: 'pakistan',

  // SWITCH ACTIVE THEME PRESET HERE ('cinematic-amber' | 'clean-light' | 'bold-neon')
  activeTheme: 'cinematic-amber',

  availableCategories: [
    {
      id: 'pakistan',
      label: 'Wayfarer Pakistan',
      description: 'World-class 8,000m peaks, ancient Silk Road passes, Mughal heritage, and legendary hospitality.',
    },
    {
      id: 'travel',
      label: 'Wayfarer Discovery',
      description: 'Curated urban architecture, underground soundscapes, and hidden local trails.',
    },
    {
      id: 'fitness',
      label: 'Wayfarer Kinetic',
      description: 'High-altitude training camps, coastal surf conditioning, and hydro-recovery.',
    },
    {
      id: 'food',
      label: 'Wayfarer Palate',
      description: 'Basque live-fire taverns, midnight Bangkok woks, and natural fermentation cellars.',
    },
  ],

  availableThemes: [
    { id: 'cinematic-amber', label: 'Cinematic Amber' },
    { id: 'clean-light', label: 'Clean Light' },
    { id: 'bold-neon', label: 'Bold Neon' },
  ],

  contentPacks,
  themePresets,

  apiEndpoints: {
    contact: '/api/contact',
    chat: '/api/chat',
    newsletter: '/api/newsletter',
  },

  contactInfo: {
    email: 'curators@wayfarer.studio',
    phone: '+1 (415) 890-4820',
    address: 'Kopenicker Str. 124, 10179 Berlin, Germany',
    hours: 'Monday – Friday, 09:00 – 18:00 CET',
  },
};

/**
 * Helper to get the active content pack based on runtime or stored category
 */
export function getActiveContent(category?: SiteCategory): ContentPack {
  const cat = category || siteConfig.activeCategory;
  return contentPacks[cat] || travelContent;
}

/**
 * Helper to get active theme configuration
 */
export function getActiveTheme(theme?: ThemePreset): ThemeConfig {
  const th = theme || siteConfig.activeTheme;
  return themePresets[th] || themePresets['cinematic-amber'];
}
