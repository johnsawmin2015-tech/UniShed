/**
 * Premium Academic Suite - Design Tokens
 * Centralized design system for luxury academic styling
 */

// Academic Year Color Themes
export const YEAR_THEMES = {
    1: {
        name: 'Foundation',
        description: 'Soft Sand Gold',
        base: 'sand',
        gradient: 'from-sand-400 to-sand-600',
        gradientHover: 'from-sand-500 to-sand-700',
        bg: 'bg-sand-50 dark:bg-sand-950/30',
        bgSubtle: 'bg-sand-100/50 dark:bg-sand-900/20',
        text: 'text-sand-900 dark:text-sand-100',
        textMuted: 'text-sand-600 dark:text-sand-400',
        border: 'border-sand-200 dark:border-sand-800',
        ring: 'ring-sand-500/30',
        shadow: 'shadow-sand-500/20',
        accent: 'text-sand-600 dark:text-sand-400',
    },
    2: {
        name: 'Structure',
        description: 'Muted Bronze',
        base: 'bronze',
        gradient: 'from-bronze-400 to-bronze-600',
        gradientHover: 'from-bronze-500 to-bronze-700',
        bg: 'bg-bronze-50 dark:bg-bronze-950/30',
        bgSubtle: 'bg-bronze-100/50 dark:bg-bronze-900/20',
        text: 'text-bronze-900 dark:text-bronze-100',
        textMuted: 'text-bronze-600 dark:text-bronze-400',
        border: 'border-bronze-200 dark:border-bronze-800',
        ring: 'ring-bronze-500/30',
        shadow: 'shadow-bronze-500/20',
        accent: 'text-bronze-600 dark:text-bronze-400',
    },
    3: {
        name: 'Refinement',
        description: 'Warm Platinum',
        base: 'platinum',
        gradient: 'from-platinum-400 to-platinum-600',
        gradientHover: 'from-platinum-500 to-platinum-700',
        bg: 'bg-platinum-50 dark:bg-platinum-950/30',
        bgSubtle: 'bg-platinum-100/50 dark:bg-platinum-900/20',
        text: 'text-platinum-900 dark:text-platinum-100',
        textMuted: 'text-platinum-600 dark:text-platinum-400',
        border: 'border-platinum-200 dark:border-platinum-800',
        ring: 'ring-platinum-500/30',
        shadow: 'shadow-platinum-500/20',
        accent: 'text-platinum-600 dark:text-platinum-400',
    },
    4: {
        name: 'Professional',
        description: 'Deep Champagne',
        base: 'champagne',
        gradient: 'from-champagne-400 to-champagne-600',
        gradientHover: 'from-champagne-500 to-champagne-700',
        bg: 'bg-champagne-50 dark:bg-champagne-950/30',
        bgSubtle: 'bg-champagne-100/50 dark:bg-champagne-900/20',
        text: 'text-champagne-900 dark:text-champagne-100',
        textMuted: 'text-champagne-600 dark:text-champagne-400',
        border: 'border-champagne-200 dark:border-champagne-800',
        ring: 'ring-champagne-500/30',
        shadow: 'shadow-champagne-500/20',
        accent: 'text-champagne-600 dark:text-champagne-400',
    },
    5: {
        name: 'Excellence',
        description: 'Royal Antique Gold',
        base: 'royal',
        gradient: 'from-royal-400 to-royal-600',
        gradientHover: 'from-royal-500 to-royal-700',
        bg: 'bg-royal-50 dark:bg-royal-950/30',
        bgSubtle: 'bg-royal-100/50 dark:bg-royal-900/20',
        text: 'text-royal-900 dark:text-royal-100',
        textMuted: 'text-royal-600 dark:text-royal-400',
        border: 'border-royal-200 dark:border-royal-800',
        ring: 'ring-royal-500/30',
        shadow: 'shadow-royal-500/20',
        accent: 'text-royal-600 dark:text-royal-400',
    },
} as const;

// Section Color Modifiers
export const SECTION_MODIFIERS = {
    A: {
        name: 'Primary',
        opacity: 1,
        saturation: 'normal',
        gradientShift: 0,
    },
    B: {
        name: 'Secondary',
        opacity: 0.85,
        saturation: 'darker',
        gradientShift: 15,
    },
    C: {
        name: 'Tertiary',
        opacity: 0.7,
        saturation: 'muted',
        gradientShift: 25,
    },
} as const;

// Typography Scale
export const TYPOGRAPHY = {
    display: {
        fontSize: '3rem',
        lineHeight: '1.1',
        fontWeight: '700',
        fontFamily: "'Playfair Display', Georgia, serif",
        letterSpacing: '-0.02em',
    },
    h1: {
        fontSize: '2.25rem',
        lineHeight: '1.2',
        fontWeight: '700',
        fontFamily: "'Playfair Display', Georgia, serif",
        letterSpacing: '-0.01em',
    },
    h2: {
        fontSize: '1.875rem',
        lineHeight: '1.25',
        fontWeight: '600',
        fontFamily: "'Playfair Display', Georgia, serif",
    },
    h3: {
        fontSize: '1.5rem',
        lineHeight: '1.3',
        fontWeight: '600',
        fontFamily: "'Playfair Display', Georgia, serif",
    },
    h4: {
        fontSize: '1.25rem',
        lineHeight: '1.4',
        fontWeight: '600',
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    body: {
        fontSize: '1rem',
        lineHeight: '1.6',
        fontWeight: '400',
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    bodySmall: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
        fontWeight: '400',
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    caption: {
        fontSize: '0.75rem',
        lineHeight: '1.4',
        fontWeight: '500',
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: '0.02em',
    },
    label: {
        fontSize: '0.625rem',
        lineHeight: '1.3',
        fontWeight: '700',
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
    },
} as const;

// Spacing Scale
export const SPACING = {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
} as const;

// Shadow Definitions
export const SHADOWS = {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    luxury: '0 4px 20px -2px rgba(180, 148, 94, 0.15)',
    luxuryLg: '0 8px 40px -4px rgba(180, 148, 94, 0.2)',
    glow: '0 0 20px rgba(212, 166, 102, 0.3)',
    glowLg: '0 0 40px rgba(212, 166, 102, 0.4)',
    elevated: '0 8px 30px rgba(0, 0, 0, 0.12)',
    elevatedDark: '0 8px 30px rgba(0, 0, 0, 0.4)',
} as const;

// Animation Durations
export const DURATIONS = {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
} as const;

// Border Radius
export const RADII = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
} as const;

// Z-Index Scale
export const Z_INDEX = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
} as const;

// Helper function to get year theme
export const getYearTheme = (year: number) => {
    return YEAR_THEMES[year as keyof typeof YEAR_THEMES] || YEAR_THEMES[1];
};

// Helper function to get section modifier
export const getSectionModifier = (section: string) => {
    return SECTION_MODIFIERS[section as keyof typeof SECTION_MODIFIERS] || SECTION_MODIFIERS.A;
};

// Combined theme helper
export const getAcademicTheme = (year: number, section: string) => {
    const yearTheme = getYearTheme(year);
    const sectionMod = getSectionModifier(section);

    return {
        ...yearTheme,
        section: sectionMod,
        fullName: `Year ${year} - Section ${section}`,
    };
};
