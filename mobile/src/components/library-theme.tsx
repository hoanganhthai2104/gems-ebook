/**
 * Helpers that translate the web hubs' Tailwind theme strings into values the
 * React Native renderer can consume (LinearGradient stops, badge palettes).
 */
import { colors } from '@/theme/tokens';

export type GradientStops = readonly [string, string, ...string[]];

const FALLBACK_STOPS: GradientStops = [colors.hubBg, colors.hubBgMid, colors.hubBgDeep];

const HEX_STOP = /#[0-9a-fA-F]{3,8}/g;

/**
 * Parses `"from-[#080e20] via-[#0f1933] to-[#060a17]"` into the hex stops that
 * LinearGradient expects. Falls back to the dark hub palette when the string
 * carries no parsable stops (e.g. Tailwind colour names such as `from-slate-950`).
 */
export function parseThemeGradient(themeGradient?: string | null): GradientStops {
  if (!themeGradient) return FALLBACK_STOPS;
  const matches = themeGradient.match(HEX_STOP);
  if (!matches || matches.length < 2) return FALLBACK_STOPS;
  const [first, second, ...rest] = matches;
  return [first, second, ...rest] as GradientStops;
}

export interface BadgePalette {
  background: string;
  text: string;
  border: string;
}

/** Base RGB triples for the Tailwind hues the hubs use in `accentBadge`. */
const HUE_RGB: Record<string, { base: string; text: string }> = {
  blue: { base: '59, 130, 246', text: '#93C5FD' },
  amber: { base: '251, 191, 36', text: '#FCD34D' },
  emerald: { base: '52, 211, 153', text: '#6EE7B7' },
  cyan: { base: '34, 211, 238', text: '#67E8F9' },
  purple: { base: '192, 132, 252', text: '#D8B4FE' },
  indigo: { base: '129, 140, 248', text: '#A5B4FC' },
};

/**
 * Turns `"bg-amber-400/20 text-amber-300 border-amber-400/50"` into concrete
 * rgba fills. Unknown hues degrade to the blue palette.
 */
export function parseAccentBadge(accentBadge?: string | null): BadgePalette {
  const hue = accentBadge?.match(/text-([a-z]+)-\d+/)?.[1] ?? 'blue';
  const entry = HUE_RGB[hue] ?? HUE_RGB.blue;
  return {
    background: `rgba(${entry.base}, 0.2)`,
    text: entry.text,
    border: `rgba(${entry.base}, 0.5)`,
  };
}
