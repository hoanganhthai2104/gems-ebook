/**
 * Design tokens ported from the LIMES web app's Tailwind palette.
 * Every screen styles through these constants instead of ad-hoc hex values so
 * the mobile app stays visually in sync with the web original.
 */

export const colors = {
  // Brand
  primary: '#2563EB', // blue-600
  primaryDark: '#1D4ED8', // blue-700
  primaryLight: '#3B82F6', // blue-500
  primarySoft: '#EFF6FF', // blue-50
  primarySoftBorder: '#DBEAFE', // blue-100

  accent: '#06B6D4', // cyan-500
  accentDark: '#0E7490', // cyan-700
  accentSoft: '#ECFEFF', // cyan-50

  amber: '#F59E0B', // amber-500
  amberSoft: '#FFFBEB', // amber-50
  emerald: '#10B981', // emerald-500
  emeraldSoft: '#ECFDF5',
  rose: '#F43F5E', // rose-500
  roseSoft: '#FFF1F2',
  violet: '#8B5CF6',
  violetSoft: '#F5F3FF',

  // Neutrals (Tailwind slate)
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',

  white: '#FFFFFF',
  black: '#000000',

  // Semantic surfaces
  surface: '#FFFFFF',
  background: '#F8FAFC',
  onSurface: '#1E293B',
  onSurfaceMuted: '#64748B',
  border: '#E2E8F0',

  // Netflix-style dark hub
  hubBg: '#080E20',
  hubBgMid: '#0F1933',
  hubBgDeep: '#060A17',
} as const;

/** Mesh gradient background used behind Home / Library / Profile on web. */
export const meshGradient = {
  colors: ['#F8FAFC', '#FFFFFF', '#EFF6FF'] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const fontSize = {
  xxs: 9,
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 16,
  xxl: 18,
  h3: 20,
  h2: 24,
  h1: 30,
  display: 34,
} as const;

/**
 * Serif face used for book titles / reader headings on web (Playfair Display).
 * Falls back to the platform serif so the app works without a font download.
 */
export const fontFamily = {
  serif: 'serif',
  sans: undefined as string | undefined,
} as const;

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  navBar: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
} as const;

/** Reader themes ported from the web e-reader (Trắng / Sepia / Tối). */
export const readerThemes = {
  white: {
    key: 'white' as const,
    label: 'Trắng',
    background: '#FFFFFF',
    text: '#1A2E35',
    muted: '#64748B',
    chrome: '#FFFFFF',
    border: '#E2E8F0',
    isDark: false,
  },
  sepia: {
    key: 'sepia' as const,
    label: 'Sepia',
    background: '#FBF0DA',
    text: '#4A3728',
    muted: '#8A7460',
    chrome: '#F5E6C8',
    border: '#E4D3AF',
    isDark: false,
  },
  dark: {
    key: 'dark' as const,
    label: 'Tối',
    background: '#12161C',
    text: '#D8DEE9',
    muted: '#8A94A6',
    chrome: '#1A1F27',
    border: '#2A313C',
    isDark: true,
  },
} as const;

export type ReaderThemeKey = keyof typeof readerThemes;
export type ReaderTheme = (typeof readerThemes)[ReaderThemeKey];

/** Highlight colours offered in the reader's selection toolbar. */
export const highlightColors = {
  yellow: { key: 'yellow' as const, label: 'Vàng', swatch: '#FDE68A', web: 'rgba(253, 230, 138, 0.85)' },
  green: { key: 'green' as const, label: 'Xanh lá', swatch: '#A7F3D0', web: 'rgba(167, 243, 208, 0.85)' },
  blue: { key: 'blue' as const, label: 'Xanh dương', swatch: '#BFDBFE', web: 'rgba(191, 219, 254, 0.85)' },
  pink: { key: 'pink' as const, label: 'Hồng', swatch: '#FBCFE8', web: 'rgba(251, 207, 232, 0.85)' },
} as const;

export type HighlightColorKey = keyof typeof highlightColors;
