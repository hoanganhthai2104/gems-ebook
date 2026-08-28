/**
 * Chapter card from the web's knowledge detail panel: title, progress bar and
 * the status-dependent review / quiz actions.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ToastTone } from '@/components/toast';
import type { KnowledgeChapter } from '@/data/articles';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface KnowledgeChapterCardProps {
  chapter: KnowledgeChapter;
  onQuiz: () => void;
  /** `show` is threaded down from the screen so every toast shares one state. */
  show: (text: string, tone?: ToastTone) => void;
}

export function KnowledgeChapterCard({ chapter, onQuiz, show }: KnowledgeChapterCardProps) {
  return (
    <View style={styles.chapterCard}>
      <View>
        <Text style={styles.chapterTitle}>
          Chương {chapter.num}: {chapter.title}
        </Text>
        <Text style={styles.chapterDesc}>{chapter.desc}</Text>
      </View>

      <View style={styles.chapterProgressBlock}>
        <View style={styles.chapterTrack}>
          <View style={[styles.chapterFill, { width: `${chapter.progress}%` }]} />
        </View>
        <View style={styles.chapterProgressLabels}>
          <Text style={styles.chapterProgressLabel}>Tiến trình</Text>
          <Text style={styles.chapterProgressLabel}>{chapter.progress}%</Text>
        </View>
      </View>

      <View style={styles.chapterActions}>
        {chapter.status === 'completed' ? (
          <Pressable onPress={onQuiz} style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]}>
            <Text style={styles.ghostButtonText}>Ôn tập lại</Text>
          </Pressable>
        ) : chapter.status === 'learning' ? (
          <>
            <Pressable onPress={onQuiz} style={({ pressed }) => [styles.solidButton, pressed && styles.pressed]}>
              <Text style={styles.solidButtonText}>Tiếp tục ôn tập</Text>
            </Pressable>
            <Pressable onPress={onQuiz} style={({ pressed }) => [styles.mutedButton, pressed && styles.pressed]}>
              <Text style={styles.mutedButtonText}>Làm bài kiểm tra</Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={() => show('Chưa mở khóa chương này.', 'warning')} style={styles.lockedButton}>
            <Text style={styles.lockedButtonText}>Chưa bắt đầu</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  chapterCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadow.card,
  },
  chapterTitle: { fontSize: fontSize.base, fontWeight: '900', color: colors.slate800, lineHeight: 16 },
  chapterDesc: { fontSize: fontSize.xs, fontWeight: '600', color: colors.slate500, lineHeight: 15, marginTop: 4 },
  chapterProgressBlock: { gap: 6 },
  chapterTrack: { height: 4, borderRadius: radius.pill, backgroundColor: colors.slate100, overflow: 'hidden' },
  chapterFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },
  chapterProgressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chapterProgressLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },
  chapterActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  ghostButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  ghostButtonText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate600 },
  solidButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
  },
  solidButtonText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.white },
  mutedButton: {
    backgroundColor: colors.slate100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
  },
  mutedButtonText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate600 },
  lockedButton: {
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  lockedButtonText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate300 },
});
