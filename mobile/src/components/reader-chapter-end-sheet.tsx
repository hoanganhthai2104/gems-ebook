/**
 * End-of-chapter prompt. The web reader placed the knowledge check on the last
 * flipbook page; on mobile the quiz is its own route, so finishing a chapter
 * offers it here alongside the jump to the next chapter.
 */
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ReaderBottomSheet } from '@/components/reader-bottom-sheet';
import { Button } from '@/components/ui';
import { fontSize, radius, spacing, type ReaderTheme } from '@/theme/tokens';

interface ReaderChapterEndSheetProps {
  visible: boolean;
  onClose: () => void;
  theme: ReaderTheme;
  chapterTitle: string;
  quizAvailable: boolean;
  nextChapterTitle?: string;
  onStartQuiz: () => void;
  onNextChapter: () => void;
}

export function ReaderChapterEndSheet({
  visible,
  onClose,
  theme,
  chapterTitle,
  quizAvailable,
  nextChapterTitle,
  onStartQuiz,
  onNextChapter,
}: ReaderChapterEndSheetProps) {
  return (
    <ReaderBottomSheet
      visible={visible}
      onClose={onClose}
      title="Tóm tắt chương"
      subtitle={chapterTitle}
      theme={theme}
      maxHeightRatio={0.5}
    >
      <View style={[styles.banner, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <MaterialIcons name="task-alt" size={20} color="#10B981" />
        <Text style={[styles.bannerText, { color: theme.text }]}>
          Bạn đã đọc hết chương này. Lật trang tiếp để kiểm tra kiến thức.
        </Text>
      </View>

      <View style={styles.actions}>
        {quizAvailable ? (
          <Button label="Kiểm tra kiến thức" icon="quiz" onPress={onStartQuiz} fullWidth />
        ) : null}
        {nextChapterTitle ? (
          <Button
            label="Chương tiếp theo"
            icon="arrow-forward"
            variant="secondary"
            onPress={onNextChapter}
            fullWidth
          />
        ) : null}
        <Button label="Tiếp tục đọc" variant="ghost" onPress={onClose} fullWidth />
      </View>
    </ReaderBottomSheet>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  bannerText: { flex: 1, fontSize: fontSize.base, lineHeight: 18, fontWeight: '600' },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
});
