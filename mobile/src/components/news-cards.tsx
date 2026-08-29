/**
 * Article presentation components shared by the Home shelf and the News tab.
 * Ported from #view-home (news shelf) and #view-news-blog (carousel + list).
 */
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { resolveCover } from '@/data/cover-images';
import type { ArticleCard } from '@/data/articles';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

/** Red flag colour from the web card (`bg-[#e94560]`). */
const HOT_RED = '#E94560';

function useOpenArticle(slug: string): () => void {
  const router = useRouter();
  return () => router.push({ pathname: '/news/[slug]', params: { slug } });
}

/** 160x96 overlay card used in the home "Tin tức & Blog" shelf. */
export function NewsShelfCard({ article, style }: { article: ArticleCard; style?: StyleProp<ViewStyle> }) {
  const open = useOpenArticle(article.slug);
  return (
    <Pressable onPress={open} style={({ pressed }) => [styles.shelfCard, pressed && styles.pressed, style]}>
      <Image source={resolveCover(article.image)} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {article.hot ? (
        <View style={styles.hotFlag}>
          <Text style={styles.hotFlagText}>HOT</Text>
        </View>
      ) : null}
      <View style={styles.shelfCategory}>
        <Text style={styles.shelfCategoryText}>{article.category}</Text>
      </View>
      <View style={styles.shelfFooter}>
        <Text style={styles.shelfTime}>{article.time}</Text>
        <Text numberOfLines={2} style={styles.shelfTitle}>
          {article.title}
        </Text>
      </View>
    </Pressable>
  );
}

/** Full-bleed slide in the news tab's featured carousel. */
export function FeaturedArticleSlide({ article, width }: { article: ArticleCard; width: number }) {
  const open = useOpenArticle(article.slug);
  return (
    <Pressable onPress={open} style={({ pressed }) => [{ width }, pressed && styles.pressed]}>
      <Image source={resolveCover(article.image)} style={styles.featuredImage} contentFit="cover" transition={150} />
      <View style={styles.metaRow}>
        <Text style={styles.metaCategory}>{article.category}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaTime}>{article.time}</Text>
      </View>
      <Text style={styles.featuredTitle}>{article.title}</Text>
      {article.excerpt ? (
        <Text numberOfLines={2} style={styles.featuredExcerpt}>
          {article.excerpt}
        </Text>
      ) : null}
    </Pressable>
  );
}

/** Compact row with a square thumbnail on the trailing edge. */
export function ArticleListRow({ article }: { article: ArticleCard }) {
  const open = useOpenArticle(article.slug);
  return (
    <Pressable onPress={open} style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}>
      <View style={styles.listBody}>
        <View style={styles.metaRow}>
          <Text style={styles.listCategory}>{article.category}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.listTime}>{article.time}</Text>
        </View>
        <Text numberOfLines={2} style={styles.listTitle}>
          {article.title}
        </Text>
      </View>
      <Image source={resolveCover(article.image)} style={styles.listThumb} contentFit="cover" transition={150} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.9 },

  shelfCard: {
    width: 160,
    height: 96,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
    ...shadow.card,
  },
  hotFlag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: HOT_RED,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  hotFlagText: { color: colors.white, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  shelfCategory: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  shelfCategoryText: { color: colors.white, fontSize: 8, fontWeight: '700' },
  shelfFooter: { position: 'absolute', left: spacing.sm, right: spacing.sm, bottom: spacing.sm },
  shelfTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  shelfTitle: { color: colors.white, fontSize: fontSize.sm, fontWeight: '900', lineHeight: 14, marginTop: 2 },

  featuredImage: {
    width: '100%',
    height: 176,
    borderRadius: radius.lg,
    backgroundColor: colors.slate200,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaCategory: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaDot: { fontSize: fontSize.xs, color: colors.slate400, fontWeight: '700' },
  metaTime: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  featuredTitle: {
    fontSize: fontSize.lg,
    fontWeight: '900',
    color: colors.slate800,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  featuredExcerpt: { fontSize: fontSize.base, color: colors.slate500, lineHeight: 17, marginTop: spacing.xs },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
  },
  listBody: { flex: 1 },
  listCategory: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  listTime: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate500,
    textTransform: 'uppercase',
  },
  listTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.slate800,
    lineHeight: 16,
    marginTop: spacing.xs,
  },
  listThumb: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.slate200 },
});
