/**
 * Netflix-style hero spotlight at the top of the library hub view.
 * Port of the `heroHtml` block inside window.renderNetflixSubHub().
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { resolveCover } from '@/data/cover-images';
import type { Book, CategoryHub } from '@/data/types';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { parseAccentBadge, parseThemeGradient } from '@/components/library-theme';

interface HubHeroProps {
  hub: CategoryHub;
  book: Book;
  onOpenBook: () => void;
  onListenAudio: () => void;
}

const FEATURE_TAGS = ['📖 Bản Đầy Đủ', '🎧 Audio HD', '🎓 LIMES'];

export function HubHero({ hub, book, onOpenBook, onListenAudio }: HubHeroProps) {
  const stops = parseThemeGradient(hub.themeGradient);
  const badge = parseAccentBadge(hub.accentBadge);

  return (
    <LinearGradient colors={stops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
      <View
        pointerEvents="none"
        style={[styles.glowTop, { backgroundColor: hub.glowColor || 'rgba(59, 130, 246, 0.35)' }]}
      />
      <View pointerEvents="none" style={styles.glowBottom} />
      <View pointerEvents="none" style={styles.topHairline} />

      <View style={styles.heroRow}>
        <Pressable onPress={onOpenBook} style={styles.coverWrap}>
          <Image source={resolveCover(book.cover)} style={styles.cover} contentFit="cover" transition={150} />
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>Top #1</Text>
          </View>
          <View style={styles.ratingBadge}>
            <MaterialIcons name="star" size={10} color={colors.amber} />
            <Text style={styles.ratingBadgeText}>{book.rating || '5.0'}</Text>
          </View>
        </Pressable>

        <View style={styles.info}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.spotlightBadge,
                { backgroundColor: badge.background, borderColor: badge.border },
              ]}
            >
              <Text numberOfLines={1} style={[styles.spotlightBadgeText, { color: badge.text }]}>
                {hub.spotlightBadge || '⭐ MASTERPIECE TUYỂN CHỌN'}
              </Text>
            </View>
            <View style={styles.readsRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.readsText}>{book.reads || '20k+'} người đọc</Text>
            </View>
          </View>

          <Text onPress={onOpenBook} style={styles.title}>
            {book.title}
          </Text>

          <View style={styles.authorRow}>
            <Text numberOfLines={1} style={styles.author}>
              {book.author || 'Chủ biên Hoàng Anh'}
            </Text>
            <MaterialIcons name="verified" size={12} color="#60A5FA" />
          </View>

          <View style={styles.tagRow}>
            {FEATURE_TAGS.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable onPress={onOpenBook} style={styles.primaryAction}>
              <MaterialIcons name="play-arrow" size={16} color={colors.white} />
              <Text style={styles.primaryActionText}>Bắt đầu đọc</Text>
            </Pressable>
            <Pressable onPress={onListenAudio} style={styles.secondaryAction}>
              <MaterialIcons name="headphones" size={15} color={colors.white} />
              <Text style={styles.secondaryActionText}>Nghe Audio</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 26,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glowTop: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 224,
    height: 224,
    borderRadius: 112,
    opacity: 0.55,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -64,
    left: -64,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  topHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  coverWrap: {
    width: 112,
    aspectRatio: 2 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000000',
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  cover: { width: '100%', height: '100%' },
  topBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.amber,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: radius.sm / 2,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.4)',
  },
  topBadgeText: { fontSize: 8.5, fontWeight: '900', color: colors.slate900, textTransform: 'uppercase' },
  ratingBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ratingBadgeText: { fontSize: fontSize.xxs, fontWeight: '900', color: colors.amber },

  info: { flex: 1, minWidth: 0, gap: 10 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  spotlightBadge: {
    flexShrink: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  spotlightBadgeText: { fontSize: 8.5, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.4 },
  readsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  readsText: { fontSize: fontSize.xxs, fontWeight: '700', color: colors.slate400 },

  title: { fontSize: fontSize.lg, fontWeight: '900', color: colors.white, lineHeight: 19 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  author: { flexShrink: 1, fontSize: fontSize.sm, fontWeight: '700', color: 'rgba(191, 219, 254, 0.9)' },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagText: { fontSize: 9.5, fontWeight: '600', color: colors.slate300 },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', paddingTop: 4 },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryActionText: { fontSize: fontSize.sm, fontWeight: '900', color: colors.white },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  secondaryActionText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.white },
});
