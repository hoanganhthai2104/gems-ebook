/**
 * "Đang đọc" card on the home screen (#view-home > Continue Reading).
 * Reads `lastReadingPosition` from the store and deep-links into the reader.
 */
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AiSummaryModal } from '@/components/home-ai-summary-modal';
import { getBook } from '@/data/catalog';
import { getBookPageCount, getChaptersForBook } from '@/data/chapters';
import { resolveCover } from '@/data/cover-images';
import type { ReadingPosition } from '@/data/types';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

/** Demo defaults from the web markup, used before the user opens a book. */
const DEFAULT_BOOK_ID = 'chandoanykhoa';
const DEFAULT_CHAPTER_ID = 'hetuanhoan';
const DEFAULT_PROGRESS = 0.45;

interface ContinueReadingInfo {
  bookId: string;
  chapterId: string;
  title: string;
  chapterTitle: string;
  cover: string;
  progress: number;
}

/** Resolves the card contents from the persisted reading position. */
function resolveContinueReading(position: ReadingPosition | null): ContinueReadingInfo | null {
  const bookId = position?.bookId ?? DEFAULT_BOOK_ID;
  const book = getBook(bookId);
  if (!book) return null;

  const chapters = getChaptersForBook(bookId);
  const chapterId = position?.chapterId ?? DEFAULT_CHAPTER_ID;
  const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId);
  const chapter = chapterIndex >= 0 ? chapters[chapterIndex] : chapters[0];

  let progress = DEFAULT_PROGRESS;
  if (position && chapter && chapterIndex >= 0) {
    const totalPages = getBookPageCount(bookId);
    const pagesBefore = chapters
      .slice(0, chapterIndex)
      .reduce((sum, item) => sum + item.pages.length, 0);
    progress = totalPages > 0 ? (pagesBefore + position.pageIndex + 1) / totalPages : 0;
  }

  return {
    bookId,
    chapterId: chapter?.id ?? chapterId,
    title: book.title,
    chapterTitle: chapter?.title ?? '',
    cover: book.cover,
    progress: Math.min(1, Math.max(0, progress)),
  };
}

export function HomeContinueReading() {
  const router = useRouter();
  const lastReadingPosition = useAppStore((s) => s.lastReadingPosition);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const info = useMemo(() => resolveContinueReading(lastReadingPosition), [lastReadingPosition]);
  if (!info) return null;

  const percent = Math.round(info.progress * 100);
  const openReader = () => router.push({ pathname: '/reader/[bookId]', params: { bookId: info.bookId } });

  return (
    <View>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="menu-book" size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>Đang đọc</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.topRow}>
          <Pressable onPress={openReader}>
            <Image source={resolveCover(info.cover)} style={styles.cover} contentFit="cover" transition={150} />
          </Pressable>
          <View style={styles.info}>
            <Text numberOfLines={1} style={styles.bookTitle}>
              {info.title}
            </Text>
            <Text numberOfLines={1} style={styles.chapterTitle}>
              {info.chapterTitle}
            </Text>
            <View style={styles.progressBlock}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Tiến độ</Text>
                <Text style={styles.progressLabel}>{percent}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${percent}%` }]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={openReader} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Tiếp tục đọc</Text>
          </Pressable>
          <Pressable
            onPress={() => setSummaryVisible(true)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <MaterialIcons name="auto-awesome" size={14} color={colors.primaryDark} />
            <Text style={styles.secondaryButtonText}>Tóm tắt AI</Text>
          </Pressable>
        </View>
      </View>

      <AiSummaryModal visible={summaryVisible} onClose={() => setSummaryVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    ...shadow.card,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
  cover: {
    width: 80,
    height: 112,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
  },
  info: { flex: 1 },
  bookTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  chapterTitle: { fontSize: fontSize.base, fontWeight: '600', color: colors.slate500, marginTop: 4 },
  progressBlock: { marginTop: spacing.lg },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },
  progressTrack: { height: 8, borderRadius: radius.pill, backgroundColor: colors.slate100, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.pill },
  actions: { flexDirection: 'row', gap: spacing.md },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: colors.white, fontSize: fontSize.base, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonText: { color: colors.primaryDark, fontSize: fontSize.base, fontWeight: '700' },
});
