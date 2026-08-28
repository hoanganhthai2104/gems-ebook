/**
 * Audiobook cover stage: the per-book gradient backdrop, the floating cover and
 * the chapter badge overlay (port of #audio-cover / #audio-cover-bg on web).
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { resolveCover } from '@/data/cover-images';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

/** Gradient presets per book theme, copied from the web `gradientMap`. */
const GRADIENTS: Record<string, readonly [string, string, string]> = {
  thankinh: ['#0a0e2e', '#1a237e', '#283593'],
  thankinhhoc: ['#0a0e2e', '#1a237e', '#283593'],
  thaoduoc: ['#0d2818', '#1b5e20', '#2e7d32'],
  lamsangnoikhoa: ['#0a1929', '#0d47a1', '#1565c0'],
  capnhatyvan: ['#0d1b2a', '#1565c0', '#0288d1'],
  ditruyen: ['#1a0533', '#4a148c', '#7b1fa2'],
  baoche: ['#0d1f1a', '#00695c', '#00897b'],
  nhansam: ['#1b0000', '#b71c1c', '#c62828'],
  chandoanykhoa: ['#0a1929', '#01579b', '#0288d1'],
};

const DEFAULT_GRADIENT: readonly [string, string, string] = ['#0a1525', '#0d47a1', '#1565c0'];

/** Centre glow tint, approximating the web's radial-gradient overlay. */
const GLOWS: Record<string, string> = {
  thankinh: 'rgba(99,137,255,0.30)',
  thankinhhoc: 'rgba(99,137,255,0.30)',
  thaoduoc: 'rgba(76,175,80,0.30)',
  lamsangnoikhoa: 'rgba(30,136,229,0.30)',
  capnhatyvan: 'rgba(2,136,209,0.30)',
  ditruyen: 'rgba(156,39,176,0.30)',
  baoche: 'rgba(0,150,136,0.30)',
  nhansam: 'rgba(229,57,53,0.35)',
  chandoanykhoa: 'rgba(30,136,229,0.30)',
};

interface AudioCoverStageProps {
  bookId: string;
  cover: string;
  chapterTitle: string;
  onPressChapter: () => void;
}

export function AudioCoverStage({ bookId, cover, chapterTitle, onPressChapter }: AudioCoverStageProps) {
  const gradient = GRADIENTS[bookId] ?? DEFAULT_GRADIENT;
  const glow = GLOWS[bookId] ?? 'rgba(99,137,255,0.25)';

  return (
    <View style={styles.stage}>
      <LinearGradient colors={[...gradient]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.glow, { backgroundColor: glow }]} />

      <Image source={resolveCover(cover)} style={styles.cover} contentFit="cover" transition={200} />

      <Pressable onPress={onPressChapter} style={({ pressed }) => [styles.badge, pressed && styles.pressed]}>
        <MaterialIcons name="list" size={12} color={colors.white} />
        <Text numberOfLines={1} style={styles.badgeText}>
          {chapterTitle}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    minHeight: 260,
    width: '100%',
    borderRadius: radius.xxl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    right: '5%',
    bottom: '12%',
    borderRadius: 999,
    opacity: 0.75,
  },
  cover: {
    height: '65%',
    aspectRatio: 2 / 3,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    position: 'absolute',
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '80%',
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    flexShrink: 1,
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pressed: { opacity: 0.85 },
});
