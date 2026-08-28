/**
 * Table-of-contents bottom sheet (the reader footer's "MỤC LỤC" action).
 * Lists every chapter of the current book with its page count and a marker for
 * chapters that end in a knowledge check.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ReaderBottomSheet } from '@/components/reader-bottom-sheet';
import { hasQuiz } from '@/data/quizzes';
import type { Chapter } from '@/data/types';
import { fontSize, radius, spacing, type ReaderTheme } from '@/theme/tokens';

interface ReaderTocSheetProps {
  visible: boolean;
  onClose: () => void;
  theme: ReaderTheme;
  bookTitle: string;
  chapters: Chapter[];
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}

export function ReaderTocSheet({
  visible,
  onClose,
  theme,
  bookTitle,
  chapters,
  activeChapterId,
  onSelectChapter,
}: ReaderTocSheetProps) {
  return (
    <ReaderBottomSheet visible={visible} onClose={onClose} title="Mục lục" subtitle={bookTitle} theme={theme}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {chapters.map((chapter, index) => {
          const active = chapter.id === activeChapterId;
          return (
            <Pressable
              key={chapter.id}
              onPress={() => onSelectChapter(chapter.id)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: active ? 'rgba(37, 99, 235, 0.1)' : theme.background,
                  borderColor: active ? '#2563EB' : theme.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.index, { borderColor: active ? '#2563EB' : theme.border }]}>
                <Text style={[styles.indexText, { color: active ? '#2563EB' : theme.muted }]}>{index + 1}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text numberOfLines={2} style={[styles.rowTitle, { color: active ? '#1D4ED8' : theme.text }]}>
                  {chapter.title}
                </Text>
                <Text numberOfLines={1} style={[styles.rowMeta, { color: theme.muted }]}>
                  {chapter.meta}
                </Text>
                <View style={styles.rowTags}>
                  <Text style={[styles.rowTag, { color: theme.muted }]}>{chapter.pages.length} trang</Text>
                  {hasQuiz(chapter.id) ? (
                    <View style={styles.quizTag}>
                      <MaterialIcons name="quiz" size={11} color="#B45309" />
                      <Text style={styles.quizTagText}>Kiểm tra kiến thức</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {active ? <MaterialIcons name="play-arrow" size={18} color="#2563EB" /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </ReaderBottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm, paddingBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  pressed: { opacity: 0.7 },
  index: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: { fontSize: fontSize.sm, fontWeight: '800' },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { fontSize: fontSize.md, fontWeight: '800', lineHeight: 18 },
  rowMeta: { fontSize: fontSize.sm },
  rowTags: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 3 },
  rowTag: { fontSize: fontSize.xs, fontWeight: '700' },
  quizTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  quizTagText: { fontSize: fontSize.xxs, fontWeight: '800', color: '#B45309' },
});
