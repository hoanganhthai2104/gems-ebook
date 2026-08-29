/**
 * Building blocks of the "Thói quen đọc" screen: daily goal rows, the learning
 * analytics tiles, the weekly activity bar chart and the knowledge focus bars.
 */
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export interface HabitGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  /** Unit fragment used in the "4/5 thuật ngữ" caption. */
  unit: string;
}

export function GoalRow({ goal }: { goal: HabitGoal }) {
  const done = goal.current >= goal.target;
  return (
    <View style={styles.goalRow}>
      <View style={[styles.goalCircle, done && styles.goalCircleDone]}>
        {done ? (
          <MaterialIcons name="check-circle" size={16} color={colors.primary} />
        ) : (
          <Text style={styles.goalCircleText}>{`${goal.current}/${goal.target}`}</Text>
        )}
      </View>
      <View style={styles.goalBody}>
        <Text numberOfLines={1} style={styles.goalTitle}>
          {goal.title}
        </Text>
        <View style={styles.goalMetaRow}>
          <Text style={[styles.goalStatus, done && styles.goalStatusDone]}>
            {done ? 'Hoàn thành' : 'Đang thực hiện'}
          </Text>
          <View style={styles.goalDot} />
          <Text style={styles.goalDesc}>{`${goal.current}/${goal.target} ${goal.unit}`}</Text>
        </View>
      </View>
    </View>
  );
}

interface StatTileProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  tint: string;
  value: string;
  label: string;
}

export function HabitStatTile({ icon, tint, value, label }: StatTileProps) {
  return (
    <View style={styles.statTile}>
      <MaterialIcons name={icon} size={20} color={tint} />
      <View style={styles.statBody}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export interface WeeklyBar {
  label: string;
  /** 0..1 fill of the column. */
  ratio: number;
}

export function WeeklyActivityChart({ bars }: { bars: WeeklyBar[] }) {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartRow}>
        {bars.map((bar) => (
          <View key={bar.label} style={styles.chartColumn}>
            <View style={styles.chartTrack}>
              <View
                style={[
                  styles.chartFill,
                  { height: `${Math.round(Math.min(1, Math.max(0, bar.ratio)) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>{bar.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export interface FocusSlice {
  label: string;
  percent: number;
  /** Difference in percentage points vs the previous week; omitted for "Khác". */
  delta?: number;
  color: string;
}

export function FocusBar({ slice }: { slice: FocusSlice }) {
  const positive = (slice.delta ?? 0) >= 0;
  return (
    <View>
      <View style={styles.focusHeader}>
        <Text style={styles.focusLabel}>{slice.label}</Text>
        <View style={styles.focusValueRow}>
          <Text style={styles.focusPercent}>{`${slice.percent}%`}</Text>
          {slice.delta === undefined ? null : (
            <Text style={[styles.focusDelta, { color: positive ? colors.primary : colors.amber }]}>
              {`${positive ? '+' : ''}${slice.delta}%`}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.focusTrack}>
        <View style={[styles.focusFill, { width: `${slice.percent}%`, backgroundColor: slice.color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  goalCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCircleDone: { backgroundColor: colors.primarySoft },
  goalCircleText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primary },
  goalBody: { flex: 1 },
  goalTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800, lineHeight: 17 },
  goalMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  goalStatus: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primaryLight },
  goalStatusDone: { color: colors.primary },
  goalDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.slate300 },
  goalDesc: { fontSize: fontSize.xs, fontWeight: '500', color: colors.slate500 },

  statTile: {
    flex: 1,
    minHeight: 90,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  statBody: { marginTop: spacing.sm },
  statValue: { fontSize: fontSize.xxl, fontWeight: '900', color: colors.slate800 },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate500,
    marginTop: 2,
    textTransform: 'uppercase',
  },

  chartCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    ...shadow.card,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 112,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  chartColumn: { alignItems: 'center', gap: spacing.sm, width: 28 },
  chartTrack: {
    width: 12,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.slate100,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartFill: { width: '100%', borderRadius: radius.pill, backgroundColor: colors.primary },
  chartLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },

  focusHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  focusLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate600 },
  focusValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  focusPercent: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate800 },
  focusDelta: { fontSize: fontSize.xs, fontWeight: '700' },
  focusTrack: { height: 8, borderRadius: radius.pill, backgroundColor: colors.slate100, overflow: 'hidden' },
  focusFill: { height: '100%', borderRadius: radius.pill },
});
