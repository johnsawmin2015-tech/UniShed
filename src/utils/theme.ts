import { AcademicYear, Section } from "../domain/types";

/**
 * Premium Academic Suite - Theme System
 * Luxury color themes for academic years and sections
 */

export interface ThemeColors {
  name: string;
  description: string;
  base: string;

  // Text Colors
  primary: string;
  secondary: string;
  accent: string;
  accentHover: string;

  // Backgrounds
  bg: string;
  bgHover: string;
  bgDark: string;
  bgSubtle: string;
  solidBg: string;
  iconBg: string;

  // Borders & Rings
  border: string;
  borderLeft: string;
  ring: string;
  ringFocus: string;

  // Decoratives
  gradient: string;
  gradientHover: string;
  shadow: string;
  blob: string;
  range: string;

  // Card styling
  cardBg: string;
  cardBorder: string;
}

// Premium Academic Year Palettes with Luxury Colors
const PALETTES: Record<string, ThemeColors> = {
  // Year 1: Soft Sand Gold
  sand: {
    name: 'Foundation',
    description: 'Soft Sand Gold',
    base: 'sand',
    primary: 'text-sand-900 dark:text-sand-50',
    secondary: 'text-sand-700 dark:text-sand-300',
    accent: 'text-sand-600 dark:text-sand-400',
    accentHover: 'hover:text-sand-800 dark:hover:text-sand-300',
    bg: 'bg-sand-50/50',
    bgHover: 'hover:bg-sand-100/60',
    bgDark: 'dark:bg-sand-950/20',
    bgSubtle: 'bg-sand-100/30 dark:bg-sand-900/10',
    solidBg: 'bg-sand-600 hover:bg-sand-700 text-white',
    iconBg: 'bg-sand-100 dark:bg-sand-900/30',
    border: 'border-sand-200/60 dark:border-sand-800/40',
    borderLeft: 'border-l-sand-500',
    ring: 'focus:ring-sand-500',
    ringFocus: 'focus:ring-sand-500/20',
    gradient: 'from-sand-400 to-sand-600',
    gradientHover: 'hover:from-sand-500 hover:to-sand-700',
    shadow: 'shadow-sand-500/15',
    blob: 'bg-sand-300',
    range: 'accent-sand-500',
    cardBg: 'bg-white dark:bg-stone-950', // Cards remain neutral
    cardBorder: 'border-sand-100 dark:border-sand-900/30',
  },

  // Year 2: Muted Bronze
  bronze: {
    name: 'Structure',
    description: 'Muted Bronze',
    base: 'bronze',
    primary: 'text-bronze-950 dark:text-bronze-50',
    secondary: 'text-bronze-700 dark:text-bronze-400',
    accent: 'text-bronze-600 dark:text-bronze-400',
    accentHover: 'hover:text-bronze-800 dark:hover:text-bronze-300',
    bg: 'bg-bronze-50/50',
    bgHover: 'hover:bg-bronze-100/60',
    bgDark: 'dark:bg-bronze-950/20',
    bgSubtle: 'bg-bronze-100/30 dark:bg-bronze-900/10',
    solidBg: 'bg-bronze-600 hover:bg-bronze-800 text-white',
    iconBg: 'bg-bronze-100 dark:bg-bronze-900/30',
    border: 'border-bronze-200/60 dark:border-bronze-800/40',
    borderLeft: 'border-l-bronze-600',
    ring: 'focus:ring-bronze-600',
    ringFocus: 'focus:ring-bronze-600/20',
    gradient: 'from-bronze-500 to-bronze-700',
    gradientHover: 'hover:from-bronze-600 hover:to-bronze-800',
    shadow: 'shadow-bronze-500/15',
    blob: 'bg-bronze-300',
    range: 'accent-bronze-600',
    cardBg: 'bg-white dark:bg-stone-950',
    cardBorder: 'border-bronze-100 dark:border-bronze-900/30',
  },

  // Year 3: Warm Platinum
  platinum: {
    name: 'Refinement',
    description: 'Warm Platinum',
    base: 'platinum',
    primary: 'text-platinum-900 dark:text-platinum-50',
    secondary: 'text-platinum-600 dark:text-platinum-400',
    accent: 'text-platinum-600 dark:text-platinum-300',
    accentHover: 'hover:text-platinum-800 dark:hover:text-platinum-200',
    bg: 'bg-platinum-50/50',
    bgHover: 'hover:bg-platinum-100/60',
    bgDark: 'dark:bg-platinum-900/30',
    bgSubtle: 'bg-platinum-100/30 dark:bg-platinum-800/20',
    solidBg: 'bg-platinum-600 hover:bg-platinum-700 text-white',
    iconBg: 'bg-platinum-100 dark:bg-platinum-800/50',
    border: 'border-platinum-200/60 dark:border-platinum-700/40',
    borderLeft: 'border-l-platinum-500',
    ring: 'focus:ring-platinum-500',
    ringFocus: 'focus:ring-platinum-500/20',
    gradient: 'from-platinum-400 to-platinum-600',
    gradientHover: 'hover:from-platinum-500 hover:to-platinum-700',
    shadow: 'shadow-platinum-500/15',
    blob: 'bg-platinum-300',
    range: 'accent-platinum-500',
    cardBg: 'bg-white dark:bg-platinum-950',
    cardBorder: 'border-platinum-100 dark:border-platinum-800/50',
  },

  // Year 4: Deep Champagne
  champagne: {
    name: 'Professional',
    description: 'Deep Champagne',
    base: 'champagne',
    primary: 'text-champagne-950 dark:text-champagne-50',
    secondary: 'text-champagne-700 dark:text-champagne-400',
    accent: 'text-champagne-700 dark:text-champagne-400',
    accentHover: 'hover:text-champagne-800 dark:hover:text-champagne-300',
    bg: 'bg-champagne-50/40',
    bgHover: 'hover:bg-champagne-100/50',
    bgDark: 'dark:bg-champagne-950/20',
    bgSubtle: 'bg-champagne-100/30 dark:bg-champagne-900/10',
    solidBg: 'bg-champagne-600 hover:bg-champagne-700 text-white',
    iconBg: 'bg-champagne-100 dark:bg-champagne-900/30',
    border: 'border-champagne-200/60 dark:border-champagne-800/40',
    borderLeft: 'border-l-champagne-500',
    ring: 'focus:ring-champagne-500',
    ringFocus: 'focus:ring-champagne-500/20',
    gradient: 'from-champagne-400 to-champagne-600',
    gradientHover: 'hover:from-champagne-500 hover:to-champagne-700',
    shadow: 'shadow-champagne-500/15',
    blob: 'bg-champagne-300',
    range: 'accent-champagne-500',
    cardBg: 'bg-white dark:bg-stone-950',
    cardBorder: 'border-champagne-100 dark:border-champagne-900/30',
  },

  // Year 5: Royal Antique Gold
  royal: {
    name: 'Excellence',
    description: 'Royal Antique Gold',
    base: 'royal',
    primary: 'text-royal-950 dark:text-royal-50',
    secondary: 'text-royal-800 dark:text-royal-300',
    accent: 'text-royal-600 dark:text-royal-300',
    accentHover: 'hover:text-royal-900 dark:hover:text-royal-200',
    bg: 'bg-royal-50/60',
    bgHover: 'hover:bg-royal-100/70',
    bgDark: 'dark:bg-royal-950/30',
    bgSubtle: 'bg-royal-100/40 dark:bg-royal-900/20',
    solidBg: 'bg-royal-600 hover:bg-royal-800 text-white',
    iconBg: 'bg-royal-100 dark:bg-royal-900/40',
    border: 'border-royal-300/60 dark:border-royal-700/50',
    borderLeft: 'border-l-royal-600',
    ring: 'focus:ring-royal-600',
    ringFocus: 'focus:ring-royal-600/20',
    gradient: 'from-royal-500 to-royal-700',
    gradientHover: 'hover:from-royal-600 hover:to-royal-800',
    shadow: 'shadow-royal-600/20',
    blob: 'bg-royal-400',
    range: 'accent-royal-600',
    cardBg: 'bg-white dark:bg-royal-950/40',
    cardBorder: 'border-royal-200 dark:border-royal-800/40',
  },
};

// Section modifiers for subtle variations
const SECTION_MODIFIERS = {
  A: { opacityMod: '', saturationNote: 'Primary gold tone' },
  B: { opacityMod: '/90', saturationNote: 'Slightly darker gold' },
  C: { opacityMod: '/80', saturationNote: 'Muted gold / brushed metal' },
} as const;

// Map years to palettes
const YEAR_TO_PALETTE: Record<number, keyof typeof PALETTES> = {
  1: 'sand',
  2: 'bronze',
  3: 'platinum',
  4: 'champagne',
  5: 'royal',
};

export const getSectionTheme = (year: AcademicYear | number, section: Section | string): ThemeColors => {
  const y = Number(year);
  const s = String(section) as keyof typeof SECTION_MODIFIERS;

  const paletteKey = YEAR_TO_PALETTE[y] || 'sand';
  const palette = PALETTES[paletteKey];

  // Section modifiers can be used for subtle CSS adjustments
  // For now, we return the base palette as sections share the same theme
  // but with subtle rendering differences handled by opacity classes

  return palette;
};

export const getYearTheme = (year: AcademicYear | number): ThemeColors => {
  return getSectionTheme(year, 'A');
};

// Get section display info
export const getSectionInfo = (section: string) => {
  const s = section as keyof typeof SECTION_MODIFIERS;
  return SECTION_MODIFIERS[s] || SECTION_MODIFIERS.A;
};

// Check if valid academic context
export const isValidAcademicContext = (year: number, section: string): boolean => {
  return year >= 1 && year <= 5 && ['A', 'B', 'C'].includes(section);
};

// Export palettes for direct access if needed
export { PALETTES };