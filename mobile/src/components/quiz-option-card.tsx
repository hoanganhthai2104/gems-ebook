/**
 * A single answer choice. Before submitting it is a plain selectable card;
 * after submitting it turns green/rose and reveals the option's own rationale,
 * matching the web quiz's per-option `desc` behaviour.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

interface QuizOptionCardProps {
  text: string;
  /** Per-option rationale, revealed once the answer is submitted. */
  desc: string;
  selected: boolean;
  answered: boolean;
  isCorrect: boolean;
  onPress: () => void;
}

export function QuizOptionCard({
  text,
  desc,
  selected,
  answered,
  isCorrect,
  onPress,
}: QuizOptionCardProps) {
  const palette = resolvePalette({ selected, answered, isCorrect });

  return (
    <Pressable
      onPress={onPress}
      disabled={answered}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.bg, borderColor: palette.border, borderWidth: palette.width },
        pressed && !answered && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.text, { color: palette.fg }]}>{text}</Text>
        {answered && isCorrect ? (
          <MaterialIcons name="check-circle" size={18} color="#047857" />
        ) : null}
        {answered && selected && !isCorrect ? (
          <MaterialIcons name="cancel" size={18} color="#BE123C" />
        ) : null}
      </View>
      {answered && desc ? <Text style={[styles.desc, { color: palette.muted }]}>{desc}</Text> : null}
    </Pressable>
  );
}

function resolvePalette({
  selected,
  answered,
  isCorrect,
}: {
  selected: boolean;
  answered: boolean;
  isCorrect: boolean;
}) {
  if (answered && isCorrect) {
    return { bg: colors.emeraldSoft, border: '#10B981', fg: '#065F46', muted: '#047857', width: 2 };
  }
  if (answered && selected) {
    return { bg: colors.roseSoft, border: '#F43F5E', fg: '#9F1239', muted: '#BE123C', width: 2 };
  }
  if (answered) {
    return { bg: colors.white, border: colors.border, fg: colors.slate500, muted: colors.slate400, width: 1 };
  }
  if (selected) {
    return { bg: colors.primarySoft, border: colors.primary, fg: colors.slate800, muted: colors.slate500, width: 2 };
  }
  return { bg: colors.white, border: colors.border, fg: colors.slate700, muted: colors.slate500, width: 1 };
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  text: { flex: 1, fontSize: fontSize.lg, fontWeight: '600', lineHeight: 20 },
  desc: { fontSize: fontSize.base, lineHeight: 17, fontWeight: '500' },
  pressed: { opacity: 0.75 },
});
