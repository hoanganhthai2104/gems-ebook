/**
 * Book detail screen - port of #view-book-detail.
 * Entry points into the e-reader, the audiobook player, the table of contents
 * and the author profile, followed by the summary / author / related / reviews
 * sections of the web layout.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader, EmptyState, Screen } from '@/components/screen';
import {
  AuthorSection,
  RatingStars,
  RelatedBooksSection,
  SummarySection,
} from '@/components/book-detail-sections';
import { ReviewsSection } from '@/components/book-detail-reviews';
import { getBook, getBooksByCategory, slugifyAuthor } from '@/data/catalog';
import { getFirstChapterId, resolveChapterId } from '@/data/chapters';
import { resolveCover } from '@/data/cover-images';
import { useAppStore } from '@/store/app-store';
import { colors, fontFamily, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const book = getBook(id);

  const bookmarks = useAppStore((s) => s.bookmarks);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const openBook = useAppStore((s) => s.openBook);
  const lastReadingPosition = useAppStore((s) => s.lastReadingPosition);

  const related = useMemo(
    () => (book ? getBooksByCategory(book.category).filter((b) => b.id !== book.id).slice(0, 2) : []),
    [book],
  );

  if (!book) {
    return (
      <Screen variant="surface">
        <AppHeader title="Chi tiết sách" showBack compact />
        <EmptyState icon="menu-book" title="Không tìm thấy sách" />
      </Screen>
    );
  }

  const anchorChapterId = getFirstChapterId(book.id) ?? '';
  const inLibrary = bookmarks.some(
    (b) => b.bookId === book.id && b.chapterId === anchorChapterId && b.pageIndex === 0,
  );

  const startReading = () => {
    const preferred =
      lastReadingPosition?.bookId === book.id ? lastReadingPosition.chapterId : undefined;
    const chapterId = resolveChapterId(book.id, preferred);
    if (!chapterId) return;
    const pageIndex = lastReadingPosition?.bookId === book.id ? lastReadingPosition.pageIndex : 0;
    openBook(book.id, chapterId, pageIndex);
    router.push({ pathname: '/reader/[bookId]', params: { bookId: book.id } });
  };

  const shareBook = () => {
    Share.share({ message: `${book.title} - ${book.author} | LIMES` }).catch(() => undefined);
  };

  return (
    <Screen variant="surface">
      <AppHeader
        title="Chi tiết sách"
        showBack
        compact
        right={
          <Pressable onPress={shareBook} hitSlop={8} style={styles.headerButton}>
            <MaterialIcons name="share" size={19} color={colors.slate600} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={resolveCover(book.cover)}
            style={styles.cover}
            contentFit="cover"
            transition={150}
          />

          <Text style={styles.title}>{book.title}</Text>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/author/[slug]', params: { slug: slugifyAuthor(book.author) } })
            }
            hitSlop={6}
          >
            <Text style={styles.author}>{book.author}</Text>
          </Pressable>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <RatingStars rating={book.rating} size={12} />
              <Text style={styles.ratingValue}>{book.rating}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <MaterialIcons name="visibility" size={15} color={colors.slate500} />
              <Text style={styles.metaText}>{book.reads} lượt đọc</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionRow}>
            <Pressable onPress={startReading} style={[styles.action, styles.actionPrimary]}>
              <MaterialIcons name="menu-book" size={15} color={colors.white} />
              <Text style={styles.actionPrimaryText}>Sách Ebook</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                router.push({ pathname: '/audiobook/[bookId]', params: { bookId: book.id } })
              }
              style={[styles.action, styles.actionSecondary]}
            >
              <MaterialIcons name="headphones" size={15} color={colors.slate600} />
              <Text style={styles.actionSecondaryText}>Sách nói</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              router.push({ pathname: '/book/[id]/toc', params: { id: book.id } })
            }
            style={[styles.action, styles.actionOutline]}
          >
            <MaterialIcons name="format-list-bulleted" size={16} color={colors.primary} />
            <Text style={styles.actionOutlineText}>Mục lục</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              toggleBookmark({
                bookId: book.id,
                chapterId: anchorChapterId,
                pageIndex: 0,
                title: book.title,
              })
            }
            style={[styles.action, inLibrary ? styles.actionSaved : styles.actionOutline]}
          >
            <MaterialIcons
              name={inLibrary ? 'done' : 'library-add'}
              size={16}
              color={inLibrary ? colors.primaryDark : colors.primary}
            />
            <Text style={[styles.actionOutlineText, inLibrary && styles.actionSavedText]}>
              {inLibrary ? 'Đã có trong thư viện' : 'Thêm vào thư viện'}
            </Text>
          </Pressable>
        </View>

        <SummarySection description={book.desc} />

        <AuthorSection
          authorName={book.author}
          onPress={() =>
            router.push({ pathname: '/author/[slug]', params: { slug: slugifyAuthor(book.author) } })
          }
        />

        <RelatedBooksSection
          books={related}
          onSelectBook={(bookId) => router.push({ pathname: '/book/[id]', params: { id: bookId } })}
          onSeeAll={() => router.push('/library')}
        />

        <ReviewsSection
          rating={book.rating}
          onWriteReview={shareBook}
          onSeeAllReviews={shareBook}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerButton: { padding: spacing.sm, borderRadius: radius.pill },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl * 2, gap: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  cover: {
    width: 192,
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.xxl,
    ...shadow.raised,
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.xxl,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  author: { fontSize: fontSize.base, color: colors.slate500, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.slate300 },
  metaText: { fontSize: fontSize.sm, color: colors.slate500 },
  ratingValue: { fontSize: fontSize.sm, fontWeight: '700', color: colors.slate800, marginLeft: 2 },

  actionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  actionPrimary: {
    backgroundColor: colors.primary,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionPrimaryText: { fontSize: fontSize.base, fontWeight: '700', color: colors.white },
  actionSecondary: { backgroundColor: colors.white, borderColor: colors.slate200 },
  actionSecondaryText: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate600 },
  actionOutline: { backgroundColor: colors.white, borderColor: 'rgba(37, 99, 235, 0.25)' },
  actionOutlineText: { fontSize: fontSize.base, fontWeight: '700', color: colors.primary },
  actionSaved: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder },
  actionSavedText: { color: colors.primaryDark },
});
