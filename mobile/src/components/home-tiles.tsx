/**
 * Small home-screen tiles: the streak/pages stat cards, the "Khám phá nhanh"
 * rows and the "Dành cho bạn" recommendation tiles.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { resolveCover } from '@/data/cover-images';
import type { Book } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

type IconName = keyof typeof MaterialIcons.glyphMap;

interface StatCardProps {
  icon: IconName;
  iconTint: string;
  iconBg: string;
  value: string;
  label: string;
  onPress: () => void;
}

export function StatCard({ icon, iconTint, iconBg, value, label, onPress }: StatCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconTint} />
      </View>
      <View style={styles.flexShrink}>
        <Text numberOfLines={1} style={styles.statValue}>
          {value}
        </Text>
        <Text numberOfLines={1} style={styles.statLabel}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

interface ExploreRowProps {
  icon: IconName;
  iconTint: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function ExploreRow({ icon, iconTint, iconBg, title, subtitle, onPress }: ExploreRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.exploreRow, pressed && styles.pressed]}>
      <View style={styles.exploreLeft}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon} size={20} color={iconTint} />
        </View>
        <View style={styles.flexShrink}>
          <Text style={styles.exploreTitle}>{title}</Text>
          <Text style={styles.exploreSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={18} color={colors.slate400} />
    </Pressable>
  );
}

interface RecommendationTileProps {
  book: Book;
  badge: string;
  badgeColor: string;
  subtitle: string;
  onPress: () => void;
}

export function RecommendationTile({ book, badge, badgeColor, subtitle, onPress }: RecommendationTileProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.recommendTile, pressed && styles.pressed]}>
      <View style={[styles.recommendBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.recommendBadgeText}>{badge}</Text>
      </View>
      <Image source={resolveCover(book.cover)} style={styles.recommendCover} contentFit="cover" transition={150} />
      <View style={styles.recommendBody}>
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={11} color="#EAB308" />
          <Text style={styles.ratingText}>{book.rating}</Text>
        </View>
        <Text numberOfLines={1} style={styles.recommendTitle}>
          {book.title}
        </Text>
        <Text numberOfLines={1} style={styles.recommendSubtitle}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  flexShrink: { flexShrink: 1 },
  iconBox: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },

  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  statValue: { fontSize: fontSize.lg, fontWeight: '800', color: colors.slate800 },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },

  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  exploreLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  exploreTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800 },
  exploreSubtitle: { fontSize: fontSize.xs, fontWeight: '600', color: colors.slate500, marginTop: 2 },

  recommendTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.md,
    overflow: 'hidden',
    ...shadow.card,
  },
  recommendBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  recommendCover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
    marginBottom: spacing.md,
  },
  recommendBody: { paddingHorizontal: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  ratingText: { fontSize: fontSize.xs, fontWeight: '700', color: '#EAB308' },
  recommendTitle: { fontSize: fontSize.xs, fontWeight: '900', color: colors.slate800, lineHeight: 14 },
  recommendSubtitle: { fontSize: fontSize.xs, color: colors.slate500, marginTop: 2 },
});
