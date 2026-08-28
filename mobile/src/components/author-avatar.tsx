/**
 * Author portrait.
 * The web app pointed at a remote demo photo; the app bundles no author images,
 * so this renders deterministic initials on a per-author tinted circle instead
 * of depending on the network for a face that was never the real author's.
 */
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme/tokens';

/** Palette cycled by author name so each author keeps a stable colour. */
const TINTS = [
  { bg: colors.primarySoft, fg: colors.primaryDark },
  { bg: colors.accentSoft, fg: colors.accentDark },
  { bg: colors.emeraldSoft, fg: '#047857' },
  { bg: colors.violetSoft, fg: '#6D28D9' },
  { bg: colors.amberSoft, fg: '#B45309' },
  { bg: colors.roseSoft, fg: '#BE123C' },
] as const;

/**
 * Initials from the meaningful part of a Vietnamese academic name, skipping
 * title prefixes such as "GS.", "TS.", "PGS.", "ThS.", "BS.", "Thiền sư",
 * "Chủ biên" so "GS. TS. Nguyễn Văn Anh" yields "NA" rather than "GT".
 */
const TITLE_TOKENS = new Set([
  'gs', 'ts', 'pgs', 'ths', 'bs', 'bsckii', 'bscki', 'ckii', 'cki',
  'thiền', 'sư', 'chủ', 'biên', 'lương', 'y',
]);

export function getAuthorInitials(name: string): string {
  const words = name
    .split(/[\s.]+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => !TITLE_TOKENS.has(w.toLowerCase()));

  const source = words.length > 0 ? words : name.split(/\s+/).filter(Boolean);
  const initials = source.slice(-2).map((w) => w.charAt(0).toUpperCase());
  return initials.join('') || '?';
}

function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return TINTS[hash % TINTS.length];
}

interface AuthorAvatarProps {
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function AuthorAvatar({ name, size = 48, style }: AuthorAvatarProps) {
  const tint = tintFor(name);
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: tint.bg },
        style,
      ]}
    >
      <Text style={[styles.initials, { color: tint.fg, fontSize: size * 0.36 }]}>
        {getAuthorInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    borderCurve: 'circular',
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
  initials: { fontWeight: '900', letterSpacing: 0.5 },
});
