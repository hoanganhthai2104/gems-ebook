/**
 * Table of contents - port of #view-book-toc.
 * Renders the reading timeline: completed chapters, the chapter in progress and
 * the remaining chapters, ending with the "Hoàn thành quyển sách" medal node.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader, EmptyState, Screen } from '@/components/screen';
import { getBook } from '@/data/catalog';
import { getChaptersForBook, getPageCount, htmlToPlainText } from '@/data/chapters';
import { hasQuiz } from '@/data/quizzes';
import { useAppStore } from '@/store/app-store';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme/tokens';

const PREVIEW_LENGTH = 96;

export default function BookTocScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const book = getBook(id);

  const openBook = useAppStore((s) => s.openBook);
  const lastReadingPosition = useAppStore((s) => s.lastReadingPosition);

  const chapters = useMemo(() => getChaptersForBook(id), [id]);

  const activeIndex = useMemo(() => {
    if (!id || lastReadingPosition?.bookId !== id) return 0;
    const found = chapters.findIndex((c) => c.id === lastReadingPosition.chapterId);
    return found >= 0 ? found : 0;
  }, [chapters, id, lastReadingPosition]);

  if (!book || chapters.length === 0) {
    return (
      <Screen variant="surface">
        <AppHeader title="Mục lục" showBack compact />
        <EmptyState icon="menu-book" title="Không tìm thấy sách" />
      </Screen>
    );
  }

  const readChapter = (chapterId: string) => {
    openBook(book.id, chapterId, 0);
    router.push({ pathname: '/reader/[bookId]', params: { bookId: book.id } });
  };

  return (
    <Screen variant="surface">
      <AppHeader title="Mục lục" showBack compact />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.introText}>
            Mục lục chi tiết &amp; Tiến trình đọc sách của bạn. Hoàn thành các chương để nắm vững
            kiến thức lâm sàng.
          </Text>
          <View style={styles.progressPill}>
            <MaterialIcons name="pie-chart" size={14} color="#091F21" />
            <Text style={styles.progressPillText}>
              Đã hoàn thành {activeIndex}/{chapters.length} chương
            </Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {chapters.map((chapter, index) => {
            const preview = htmlToPlainText(chapter.pages[0] ?? '').slice(0, PREVIEW_LENGTH);
            const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'todo';
            const quiz = hasQuiz(chapter.id);

            return (
              <View key={chapter.id} style={styles.node}>
                <View
                  style={[
                    styles.marker,
                    state === 'done' && styles.markerDone,
                    state === 'active' && styles.markerActive,
                    state === 'todo' && styles.markerTodo,
                  ]}
                >
                  {state === 'done' ? (
                    <MaterialIcons name="check" size={14} color={colors.white} />
                  ) : state === 'active' ? (
                    <MaterialIcons name="play-arrow" size={16} color={colors.primary} />
                  ) : (
                    <Text style={styles.markerIndex}>{index + 1}</Text>
                  )}
                </View>

                {state === 'active' ? (
                  <View style={styles.activeCard}>
                    <View style={styles.badgeRow}>
                      <View style={styles.readingBadge}>
                        <Text style={styles.readingBadgeText}>ĐANG ĐỌC</Text>
                      </View>
                      {quiz ? <QuizBadge /> : null}
                    </View>
                    <Text style={styles.activeTitle}>{chapter.title}</Text>
                    <Text numberOfLines={2} style={styles.activePreview}>
                      {preview || chapter.meta}
                    </Text>
                    <Text style={styles.pageMeta}>{getPageCount(chapter.id)} trang</Text>
                    <Pressable
                      onPress={() => readChapter(chapter.id)}
                      style={styles.continueButton}
                      hitSlop={6}
                    >
                      <Text style={styles.continueText}>TIẾP TỤC ĐỌC</Text>
                      <MaterialIcons name="arrow-forward" size={13} color={colors.primary} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => readChapter(chapter.id)} style={styles.plainRow}>
                    <View style={styles.badgeRow}>
                      <Text style={[styles.chapterTitle, state === 'todo' && styles.chapterTitleTodo]}>
                        {chapter.title}
                      </Text>
                      {quiz ? <QuizBadge /> : null}
                    </View>
                    <Text numberOfLines={2} style={styles.chapterPreview}>
                      {preview || chapter.meta}
                    </Text>
                    {state === 'done' ? (
                      <Text style={styles.doneLabel}>ĐÃ HOÀN THÀNH</Text>
                    ) : (
                      <Text style={styles.pageMeta}>{getPageCount(chapter.id)} trang</Text>
                    )}
                  </Pressable>
                )}
              </View>
            );
          })}

          <View style={styles.node}>
            <View style={[styles.marker, styles.markerTodo]}>
              <MaterialIcons name="workspace-premium" size={14} color={colors.slate500} />
            </View>
            <View style={styles.medalCard}>
              <Text style={styles.medalTitle}>Hoàn thành quyển sách</Text>
              <Text style={styles.medalText}>
                Hoàn thành bài kiểm tra cuối cùng để nhận chứng chỉ xác thực kiến thức lâm sàng.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function QuizBadge() {
  return (
    <View style={styles.quizBadge}>
      <MaterialIcons name="quiz" size={10} color="#B45309" />
      <Text style={styles.quizBadgeText}>Kiểm tra kiến thức</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xxl, paddingBottom: 96, gap: spacing.xxl },
  intro: { gap: spacing.sm },
  bookTitle: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h3,
    fontWeight: '900',
    color: '#1E3A8A',
    lineHeight: 24,
  },
  introText: { fontSize: fontSize.base, lineHeight: 18, color: colors.slate500 },
  progressPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0EDED',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: 4,
  },
  progressPillText: { fontSize: fontSize.base, fontWeight: '700', color: '#091F21' },

  timeline: {
    borderLeftWidth: 2,
    borderLeftColor: colors.slate200,
    marginLeft: 14,
    paddingLeft: spacing.xxl,
    paddingVertical: spacing.sm,
    gap: spacing.xxxl,
  },
  node: { position: 'relative' },
  marker: {
    position: 'absolute',
    left: -37,
    top: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerDone: { backgroundColor: colors.primary },
  markerActive: { backgroundColor: colors.white, borderColor: colors.primary },
  markerTodo: { backgroundColor: colors.slate200 },
  markerIndex: { fontSize: fontSize.sm, fontWeight: '800', color: colors.slate500 },

  plainRow: { gap: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  chapterTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800 },
  chapterTitleTodo: { color: colors.slate500 },
  chapterPreview: { fontSize: fontSize.xs, lineHeight: 14, color: colors.slate500 },
  doneLabel: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.6,
    marginTop: 4,
  },
  pageMeta: { fontSize: fontSize.xs, color: colors.slate400, fontWeight: '600', marginTop: 2 },

  activeCard: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 4,
    shadowColor: '#005A9C',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  readingBadge: {
    backgroundColor: '#D2E4FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readingBadgeText: { fontSize: fontSize.xs, fontWeight: '900', color: '#00487F' },
  activeTitle: { fontSize: fontSize.base, fontWeight: '900', color: colors.slate900, marginTop: 2 },
  activePreview: { fontSize: fontSize.xs, lineHeight: 15, color: colors.slate600 },
  continueButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  continueText: { fontSize: fontSize.xs, fontWeight: '800', color: colors.primary, letterSpacing: 0.4 },

  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.amberSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  quizBadgeText: { fontSize: fontSize.xxs, fontWeight: '800', color: '#B45309' },

  medalCard: {
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 4,
  },
  medalTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate500 },
  medalText: { fontSize: fontSize.xs, lineHeight: 15, color: colors.slate500 },
});
