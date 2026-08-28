/**
 * Quiz feedback surfaces: the per-question explanation panel (the web's
 * #quiz-feedback-panel) and the end-of-quiz score summary from finishQuiz().
 */
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

interface QuizExplanationPanelProps {
  correct: boolean;
  explanation: string;
  coinsAwarded: number;
}

export function QuizExplanationPanel({ correct, explanation, coinsAwarded }: QuizExplanationPanelProps) {
  return (
    <View
      style={[
        styles.panel,
        correct
          ? { backgroundColor: colors.emeraldSoft, borderColor: '#A7F3D0' }
          : { backgroundColor: colors.roseSoft, borderColor: '#FECDD3' },
      ]}
    >
      <View style={styles.panelHeader}>
        <MaterialIcons
          name={correct ? 'check-circle' : 'error-outline'}
          size={16}
          color={correct ? '#047857' : '#BE123C'}
        />
        <Text style={[styles.panelTitle, { color: correct ? '#047857' : '#BE123C' }]}>
          {correct ? 'Chúc mừng, đáp án chính xác!' : 'Đáp án chưa chính xác'}
        </Text>
      </View>
      <Text style={styles.panelBody}>
        <Text style={styles.panelBodyLabel}>Giải thích y khoa: </Text>
        {explanation}
      </Text>
      {correct ? (
        <View style={styles.coinRow}>
          <MaterialIcons name="monetization-on" size={14} color="#B45309" />
          <Text style={styles.coinText}>Chính xác! +{coinsAwarded} LIMES Xu</Text>
        </View>
      ) : null}
    </View>
  );
}

interface QuizResultPanelProps {
  correctCount: number;
  total: number;
  coinsEarned: number;
  onRetry: () => void;
  onBackToReader: () => void;
}

export function QuizResultPanel({
  correctCount,
  total,
  coinsEarned,
  onRetry,
  onBackToReader,
}: QuizResultPanelProps) {
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <View style={styles.result}>
      <View style={styles.resultBadge}>
        <MaterialIcons name="emoji-events" size={38} color="#F59E0B" />
      </View>
      <Text style={styles.resultTitle}>Hoàn thành Quiz!</Text>
      <Text style={styles.resultScore}>
        {correctCount}/{total} câu đúng · {percent}%
      </Text>
      <Text style={styles.resultCoins}>Bạn nhận được {coinsEarned} LIMES Xu</Text>
      <View style={styles.resultActions}>
        <Button label="Quay lại đọc sách" icon="menu-book" onPress={onBackToReader} fullWidth />
        <Button label="Làm lại" variant="secondary" icon="refresh" onPress={onRetry} fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, gap: spacing.sm },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  panelTitle: { fontSize: fontSize.md, fontWeight: '800', flex: 1 },
  panelBody: { fontSize: fontSize.base, lineHeight: 18, color: colors.slate600 },
  panelBodyLabel: { fontWeight: '800', color: colors.slate700 },
  coinRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  coinText: { fontSize: fontSize.sm, fontWeight: '800', color: '#B45309' },

  result: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxxl },
  resultBadge: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  resultTitle: { fontSize: fontSize.h2, fontWeight: '900', color: colors.slate900 },
  resultScore: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate600 },
  resultCoins: { fontSize: fontSize.md, fontWeight: '800', color: '#B45309' },
  resultActions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.xl },
});
