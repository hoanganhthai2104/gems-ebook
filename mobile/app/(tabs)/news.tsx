/**
 * News / Blog tab — the React Native port of #view-news-blog.
 * Category pills filter both the featured carousel and the recommended list,
 * mirroring `filterBlogCategory`.
 */
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EmptyState, Screen } from '@/components/screen';
import { ArticleListRow, FeaturedArticleSlide } from '@/components/news-cards';
import {
  ARTICLE_CATEGORIES,
  FEATURED_ARTICLES,
  RECOMMENDED_ARTICLES,
  filterArticleCards,
  type ArticleCategoryKey,
} from '@/data/articles';
import { Toast, useToast } from '@/components/toast';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

const PAGE_PADDING = spacing.lg;
const SLIDE_GAP = spacing.lg;

export default function NewsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [category, setCategory] = useState<ArticleCategoryKey>('all');
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<FlatList>(null);
  const { toast, show } = useToast();

  const slideWidth = width - PAGE_PADDING * 2;
  const snapInterval = slideWidth + SLIDE_GAP;

  const featured = useMemo(() => filterArticleCards(FEATURED_ARTICLES, category), [category]);
  const recommended = useMemo(() => filterArticleCards(RECOMMENDED_ARTICLES, category), [category]);

  const selectCategory = (key: ArticleCategoryKey) => {
    setCategory(key);
    setActiveSlide(0);
    carouselRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const handleCarouselScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    setActiveSlide(index);
  };

  return (
    <Screen variant="mesh">
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text numberOfLines={1} style={styles.headerTitle}>
          Tin tức &amp; Blog
        </Text>
        <View style={[styles.headerSide, styles.headerSideEnd]}>
          <Pressable onPress={() => router.push('/search')} hitSlop={8} style={styles.headerButton}>
            <MaterialIcons name="search" size={22} color={colors.slate600} />
          </Pressable>
        </View>
      </View>

      <View style={styles.pillsWrap}>
        <ScrollView
      style={styles.horizontalRail}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {ARTICLE_CATEGORIES.map((item) => {
            const active = item.key === category;
            return (
              <Pressable
                key={item.key}
                onPress={() => selectCategory(item.key)}
                style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {featured.length > 0 ? (
          <View>
            <FlatList
              ref={carouselRef}
              data={featured}
              keyExtractor={(item) => `featured-${item.slug}`}
              renderItem={({ item }) => <FeaturedArticleSlide article={item} width={slideWidth} />}
              horizontal
              pagingEnabled={false}
              snapToInterval={snapInterval}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleCarouselScroll}
              contentContainerStyle={styles.carousel}
            />
            <View style={styles.dots}>
              {featured.map((item, index) => (
                <View
                  key={`dot-${item.slug}`}
                  style={[styles.dot, index === activeSlide ? styles.dotActive : styles.dotIdle]}
                />
              ))}
            </View>
          </View>
        ) : (
          <EmptyState icon="article" title="Chưa có bài viết" message="Không có bài viết trong danh mục này." />
        )}

        <View style={styles.listSection}>
          <Text style={styles.listSectionTitle}>Dành cho bạn</Text>
          <View style={styles.list}>
            {recommended.map((item) => (
              <ArticleListRow key={`row-${item.slug}`} article={item} />
            ))}
          </View>
        </View>

        <View style={styles.moreWrap}>
          <Pressable onPress={() => show('Đang tải thêm tin tức...')} hitSlop={8}>
            <Text style={styles.moreText}>Xem thêm tin khác</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Toast toast={toast} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  /** A horizontal ScrollView stretches to fill its parent's cross axis
   *  unless flexGrow is pinned, which would leave a tall blank gap. */
  horizontalRail: { flexGrow: 0, flexShrink: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PAGE_PADDING,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: colors.white,
  },
  headerSide: { width: 40 },
  headerSideEnd: { alignItems: 'flex-end' },
  headerButton: { padding: 6 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: fontSize.h3, fontWeight: '900', color: colors.slate900 },

  pillsWrap: { backgroundColor: colors.white },
  pillsRow: { gap: spacing.sm, paddingHorizontal: PAGE_PADDING, paddingVertical: spacing.md },
  pill: { paddingHorizontal: spacing.lg, paddingVertical: 6, borderRadius: radius.pill },
  pillIdle: { backgroundColor: colors.slate100 },
  pillActive: { backgroundColor: '#005A9C' },
  pillText: { fontSize: fontSize.base, fontWeight: '600', color: colors.slate600 },
  pillTextActive: { color: colors.white, fontWeight: '700' },

  scroll: { paddingHorizontal: PAGE_PADDING, paddingTop: spacing.lg, paddingBottom: 100, gap: spacing.xxl },
  carousel: { gap: SLIDE_GAP },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: radius.pill },
  dotActive: { backgroundColor: colors.primary },
  dotIdle: { backgroundColor: colors.slate200 },

  listSection: { gap: spacing.lg },
  listSectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  list: { gap: spacing.md },

  moreWrap: { alignItems: 'center', paddingTop: spacing.sm },
  moreText: { fontSize: fontSize.base, fontWeight: '700', color: colors.primaryLight },
});
