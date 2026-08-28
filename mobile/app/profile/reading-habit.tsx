/**
 * "Thói quen đọc" - port of the web `view-reading-habit` panel.
 * All figures are derived from the local store (pages read, streak, bookmarks,
 * highlights, notes) instead of the web demo's hard-coded numbers.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { IconButton } from '@/components/ui';
import { ProgressRing } from '@/components/profile-progress-ring';
import {
  FocusBar,
  GoalRow,
  HabitStatTile,
  WeeklyActivityChart,
  type FocusSlice,
  type HabitGoal,
  type WeeklyBar,
} from '@/components/profile-habit-cards';
import { Toast, useToast } from '@/components/toast';
import { getBook } from '@/data/catalog';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Rough pace used to turn stored page counts into study hours. */
const MINUTES_PER_PAGE = 2;
/** The app has no per-session timing, so reading speed stays an estimate. */
const WORDS_PER_MINUTE = 250;
const FOCUS_COLORS = ['#1E3A8A', colors.primaryDark, colors.primaryLight];

interface Activity {
  bookId: string;
  createdAt: number;
}

export default function ReadingHabitScreen() {
  const router = useRouter();
  const { toast, show } = useToast();

  const pagesRead = useAppStore((s) => s.pagesRead);
  const streakDays = useAppStore((s) => s.streakDays);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const highlights = useAppStore((s) => s.highlights);
  const notes = useAppStore((s) => s.notes);
  const lastReadingPosition = useAppStore((s) => s.lastReadingPosition);

  const activities = useMemo<Activity[]>(
    () =>
      [...bookmarks, ...highlights, ...notes].map((item) => ({
        bookId: item.bookId,
        createdAt: item.createdAt,
      })),
    [bookmarks, highlights, notes],
  );

  const goals = useMemo<HabitGoal[]>(
    () => [
      {
        id: 'reading',
        title: 'Đọc 30 phút Cẩm nang Chẩn đoán',
        current: Math.min(pagesRead * MINUTES_PER_PAGE, 30),
        target: 30,
        unit: 'phút',
      },
      {
        id: 'lookup',
        title: 'Tra cứu 5 thuật ngữ',
        current: Math.min(highlights.length, 5),
        target: 5,
        unit: 'thuật ngữ',
      },
      {
        id: 'quiz',
        title: 'Hoàn thành bài kiểm tra chương 4',
        current: Math.min(notes.length, 5),
        target: 5,
        unit: 'câu hỏi',
      },
    ],
    [pagesRead, highlights.length, notes.length],
  );

  const completionRatio = useMemo(
    () => goals.reduce((sum, g) => sum + Math.min(1, g.current / g.target), 0) / goals.length,
    [goals],
  );
  const completedGoals = goals.filter((g) => g.current >= g.target).length;
  const percent = Math.round(completionRatio * 100);
  const accuracy = Math.round((completedGoals / goals.length) * 100);

  const bookCount = useMemo(() => {
    const ids = new Set(activities.map((a) => a.bookId));
    if (lastReadingPosition?.bookId) ids.add(lastReadingPosition.bookId);
    return ids.size;
  }, [activities, lastReadingPosition]);

  const studyHours = Math.round((pagesRead * MINUTES_PER_PAGE) / 60);

  const weeklyBars = useMemo<WeeklyBar[]>(() => buildWeeklyBars(activities), [activities]);
  const focusSlices = useMemo<FocusSlice[]>(() => buildFocusSlices(activities), [activities]);

  return (
    <Screen variant="surface">
      <View style={styles.header}>
        <View style={styles.headerSlot}>
          <IconButton
            icon="arrow-back"
            color={colors.slate600}
            background="transparent"
            style={styles.headerButton}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
          />
        </View>
        <Text numberOfLines={1} style={styles.headerTitle}>
          Thói quen đọc
        </Text>
        <View style={styles.headerSlot} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.gaugeCard}>
          <ProgressRing progress={completionRatio}>
            <Text style={styles.gaugeValue}>{`${percent}%`}</Text>
            <Text style={styles.gaugeCaption}>HOÀN THÀNH</Text>
          </ProgressRing>

          <Text style={styles.gaugeTitle}>THIẾT LẬP MỤC TIÊU HÔM NAY</Text>

          <View style={styles.goalList}>
            {goals.map((goal) => (
              <GoalRow key={goal.id} goal={goal} />
            ))}
            <Pressable
              onPress={() => show('Thêm mục tiêu cá nhân thành công!')}
              style={({ pressed }) => [styles.addGoal, pressed && styles.pressed]}
            >
              <MaterialIcons name="add-circle" size={14} color={colors.slate600} />
              <Text style={styles.addGoalText}>Thêm mục tiêu cá nhân</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phân tích học tập</Text>
          <View style={styles.statGrid}>
            <View style={styles.statRow}>
              <HabitStatTile
                icon="local-fire-department"
                tint={colors.amber}
                value={`${streakDays}`}
                label="Chuỗi ngày"
              />
              <HabitStatTile icon="menu-book" tint={colors.primaryLight} value={`${bookCount}`} label="Cuốn sách" />
            </View>
            <View style={styles.statRow}>
              <HabitStatTile icon="schedule" tint={colors.primaryLight} value={`${studyHours}`} label="Giờ học" />
              <HabitStatTile icon="military-tech" tint="#EAB308" value={`${percent}%`} label="Điểm TB" />
            </View>
            <View style={styles.statRow}>
              <HabitStatTile
                icon="verified-user"
                tint={colors.primaryLight}
                value={`${accuracy}%`}
                label="Độ chính xác"
              />
              <HabitStatTile
                icon="speed"
                tint={colors.primaryLight}
                value={`${WORDS_PER_MINUTE}`}
                label="Từ/phút"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động hàng tuần</Text>
          <WeeklyActivityChart bars={weeklyBars} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Trọng tâm kiến thức</Text>
            <Text style={styles.sectionNote}>So với tuần trước</Text>
          </View>
          <View style={styles.focusCard}>
            {focusSlices.length === 0 ? (
              <Text style={styles.focusEmpty}>Chưa có dữ liệu học tập trong tuần này.</Text>
            ) : (
              focusSlices.map((slice) => <FocusBar key={slice.label} slice={slice} />)
            )}
          </View>
        </View>
      </ScrollView>

      <Toast toast={toast} bottom={spacing.xxl} />
    </Screen>
  );
}

/** Buckets the last 7 days of reading activity into Mon..Sun columns. */
function buildWeeklyBars(activities: Activity[]): WeeklyBar[] {
  const since = Date.now() - 7 * DAY_MS;
  const counts = new Array<number>(7).fill(0);
  activities.forEach((activity) => {
    if (activity.createdAt < since) return;
    const day = (new Date(activity.createdAt).getDay() + 6) % 7;
    counts[day] += 1;
  });
  const max = Math.max(...counts, 1);
  return DAY_LABELS.map((label, index) => ({ label, ratio: (counts[index] ?? 0) / max }));
}

/** Category mix of this week's activity, with the delta against last week. */
function buildFocusSlices(activities: Activity[]): FocusSlice[] {
  const now = Date.now();
  const current = tallyCategories(activities, now - 7 * DAY_MS, now);
  const previous = tallyCategories(activities, now - 14 * DAY_MS, now - 7 * DAY_MS);

  const currentTotal = sumValues(current);
  if (currentTotal === 0) return [];
  const previousTotal = sumValues(previous);

  const ranked = [...current.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const slices: FocusSlice[] = ranked.map(([label, count], index) => {
    const percent = Math.round((count / currentTotal) * 100);
    const previousPercent =
      previousTotal > 0 ? Math.round(((previous.get(label) ?? 0) / previousTotal) * 100) : 0;
    return {
      label,
      percent,
      delta: percent - previousPercent,
      color: FOCUS_COLORS[index] ?? colors.primaryLight,
    };
  });

  const rest = 100 - slices.reduce((sum, s) => sum + s.percent, 0);
  if (rest > 0) {
    slices.push({ label: 'Khác', percent: rest, color: colors.slate200 });
  }
  return slices;
}

function tallyCategories(activities: Activity[], from: number, to: number): Map<string, number> {
  const tally = new Map<string, number>();
  activities.forEach((activity) => {
    if (activity.createdAt < from || activity.createdAt >= to) return;
    const category = getBook(activity.bookId)?.category ?? 'Khác';
    tally.set(category, (tally.get(category) ?? 0) + 1);
  });
  return tally;
}

function sumValues(tally: Map<string, number>): number {
  let total = 0;
  tally.forEach((value) => {
    total += value;
  });
  return total;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: colors.white,
  },
  headerSlot: { width: 40 },
  headerButton: { borderWidth: 0, width: 36, height: 36 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: fontSize.h3, fontWeight: '900', color: colors.slate900 },

  scroll: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl, paddingBottom: spacing.xxxl * 2, gap: spacing.xxl },

  gaugeCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    ...shadow.card,
  },
  gaugeValue: { fontSize: fontSize.h2, fontWeight: '900', color: colors.slate800 },
  gaugeCaption: { fontSize: fontSize.xs, fontWeight: '800', color: colors.primary, letterSpacing: 1, marginTop: 2 },
  gaugeTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.slate900,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  goalList: { width: '100%', gap: spacing.md },
  addGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.slate200,
    backgroundColor: colors.slate50,
  },
  addGoalText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate600 },
  pressed: { opacity: 0.8 },

  section: { gap: spacing.md },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.slate800, paddingHorizontal: spacing.xs },
  sectionNote: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },

  statGrid: { gap: spacing.md },
  statRow: { flexDirection: 'row', gap: spacing.md },

  focusCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadow.card,
  },
  focusEmpty: { fontSize: fontSize.base, color: colors.slate500, textAlign: 'center' },
});
