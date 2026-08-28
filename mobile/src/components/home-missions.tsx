/**
 * "Nhiệm vụ hôm nay" — the home screen's daily-mission block.
 * Ported from #view-home > Daily Missions, including the gold "Huy hiệu Độc giả"
 * badge that appears once every mission is complete (`checkAllMissionsCompleted`).
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export interface HomeMission {
  id: string;
  title: string;
  /** `done` renders the check circle + medal; `progress` renders "x/y" + CTA. */
  state: 'done' | 'progress';
  /** Circle label for in-progress missions, e.g. "3/5". */
  progressLabel?: string;
  statusLabel: string;
  actionLabel?: string;
  onPress?: () => void;
}

interface HomeMissionsProps {
  missions: HomeMission[];
  /** LIMES Xu balance shown on the section header. */
  coins: number;
}

export function HomeMissions({ missions, coins }: HomeMissionsProps) {
  const allDone = missions.every((mission) => mission.state === 'done');

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="task-alt" size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>Nhiệm vụ hôm nay</Text>
        <View style={styles.headerSpacer} />
        {allDone ? (
          <LinearGradient
            colors={['#FACC15', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.readerBadge}
          >
            <MaterialIcons name="military-tech" size={14} color={colors.white} />
            <Text style={styles.readerBadgeText}>Huy hiệu Độc giả</Text>
          </LinearGradient>
        ) : (
          <View style={styles.coinPill}>
            <MaterialIcons name="monetization-on" size={13} color="#B45309" />
            <Text style={styles.coinPillText}>{coins.toLocaleString('vi-VN')} xu</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        {missions.map((mission) => (
          <MissionRow key={mission.id} mission={mission} />
        ))}
      </View>
    </View>
  );
}

function MissionRow({ mission }: { mission: HomeMission }) {
  const isDone = mission.state === 'done';

  return (
    <Pressable
      onPress={mission.onPress}
      style={({ pressed }) => [styles.missionRow, pressed && mission.onPress ? styles.pressed : null]}
    >
      <View style={styles.missionCircle}>
        {isDone ? (
          <MaterialIcons name="check" size={16} color={colors.primary} />
        ) : (
          <Text style={styles.missionCircleText}>{mission.progressLabel}</Text>
        )}
      </View>

      <View style={styles.missionBody}>
        <Text numberOfLines={2} style={styles.missionTitle}>
          {mission.title}
        </Text>
        <Text style={[styles.missionStatus, isDone && styles.missionStatusDone]}>{mission.statusLabel}</Text>
      </View>

      {isDone ? (
        <LinearGradient colors={['#FBBF24', '#EAB308']} style={styles.medal}>
          <MaterialIcons name="military-tech" size={13} color={colors.white} />
        </LinearGradient>
      ) : mission.actionLabel ? (
        <Pressable
          onPress={mission.onPress}
          style={({ pressed }) => [styles.missionButton, pressed && styles.pressed]}
        >
          <Text style={styles.missionButtonText}>{mission.actionLabel}</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  section: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  headerSpacer: { flex: 1 },
  readerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  readerBadgeText: { color: colors.white, fontSize: fontSize.xs, fontWeight: '900' },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  coinPillText: { fontSize: fontSize.xs, fontWeight: '900', color: '#B45309' },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  missionCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionCircleText: { fontSize: fontSize.base, fontWeight: '700', color: colors.primary },
  missionBody: { flex: 1 },
  missionTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800, lineHeight: 16 },
  missionStatus: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primaryLight, marginTop: 2 },
  missionStatusDone: { color: colors.primary },
  medal: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.md,
  },
  missionButtonText: { color: colors.white, fontSize: fontSize.base, fontWeight: '700' },
});
