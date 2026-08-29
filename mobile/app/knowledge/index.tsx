/**
 * Knowledge experience hub — the React Native port of
 * #view-knowledge-experience (`openKnowledgeExperience`): understanding gauge,
 * 30-day question count, the daily clinical challenge, the per-book review
 * shelf and the history / achievements list.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import {
  KnowledgeHistoryCard,
  KnowledgeReviewBookCard,
  type KnowledgeHistoryItem,
  type KnowledgeReviewBook,
} from '@/components/knowledge-experience-cards';
import { Toast, useToast } from '@/components/toast';
import { resolveChapterId } from '@/data/chapters';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

/** Static demo figures, verbatim from the web panel. */
const UNDERSTANDING_PERCENT = 75;
const QUESTIONS_COMPLETED = '1,248';
const DAILY_CHALLENGE_TITLE = 'Ca lâm sàng: Suy tim sung huyết cấp';
const DAILY_CHALLENGE_DESC =
  'Kiểm tra khả năng chẩn đoán phân biệt và lên phác đồ điều trị với ca bệnh lâm sàng thực tế được cập nhật mới nhất từ hội đồng y khoa.';
const CHALLENGE_BOOK_ID = 'chandoanykhoa';

const REVIEW_BOOK: KnowledgeReviewBook = {
  bookId: 'chandoanykhoa',
  title: 'Cẩm nang Chẩn đoán Y khoa Nội khoa',
  author: 'TS. Nguyễn Văn A',
  cover: 'covers/chandoanykhoa.webp',
  masteryLabel: '42/50 Mastered',
  progress: 84,
};

const HISTORY_ITEMS: KnowledgeHistoryItem[] = [
  {
    bookId: 'thankinh',
    title: 'Giải phẫu học hệ thần kinh',
    cover: 'covers/thankinh.webp',
    meta: 'Hôm qua, 14:30 • 20 câu hỏi',
    score: 95,
  },
  {
    bookId: 'cothe',
    title: 'Sinh lý học tế bào',
    cover: 'covers/cothe.webp',
    meta: '2 ngày trước • 15 câu hỏi',
    score: 68,
  },
];

export default function KnowledgeExperienceScreen() {
  const router = useRouter();
  const { toast, show } = useToast();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const openBookKnowledge = (bookId: string) =>
    router.push({ pathname: '/knowledge/[id]', params: { id: bookId } });

  /** Mirrors the web card's `openQuizScreen()`. */
  const startDailyChallenge = () => {
    const chapterId = resolveChapterId(CHALLENGE_BOOK_ID);
    if (!chapterId) {
      show('Thử thách hôm nay chưa sẵn sàng.', 'warning');
      return;
    }
    router.push({ pathname: '/quiz/[chapterId]', params: { chapterId } });
  };

  return (
    <Screen variant="surface">
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={22} color={colors.slate600} />
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>
          Trải nghiệm Kiến thức
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Understanding rate */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Mức độ thông hiểu</Text>
          <View style={styles.gaugeValueRow}>
            <Text style={styles.gaugeValue}>{UNDERSTANDING_PERCENT}%</Text>
            <Text style={styles.gaugeCaption}>Tổng quan</Text>
          </View>
          <View style={styles.gaugeTrack}>
            <LinearGradient
              colors={[colors.primaryDark, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gaugeFill, { width: `${UNDERSTANDING_PERCENT}%` }]}
            />
          </View>
        </View>

        {/* Review stats */}
        <View style={[styles.card, styles.statsCard]}>
          <View style={styles.statsIcon}>
            <MaterialIcons name="query-stats" size={20} color={colors.primaryDark} />
          </View>
          <View style={styles.statsText}>
            <Text style={styles.statsValue}>{QUESTIONS_COMPLETED}</Text>
            <Text style={styles.statsLabel}>Câu hỏi đã hoàn thành (30 ngày qua)</Text>
          </View>
        </View>

        {/* Daily challenge */}
        <View style={styles.challengeCard}>
          <Text style={styles.challengeWatermark} numberOfLines={1}>
            Exp
          </Text>
          <Text style={styles.challengeKicker}>Thử thách hằng ngày</Text>
          <Text style={styles.challengeTitle}>{DAILY_CHALLENGE_TITLE}</Text>
          <Text style={styles.challengeDesc}>{DAILY_CHALLENGE_DESC}</Text>
          <Pressable
            onPress={startDailyChallenge}
            style={({ pressed }) => [styles.challengeButton, pressed && styles.pressed]}
          >
            <Text style={styles.challengeButtonText}>Bắt đầu ngay</Text>
            <MaterialIcons name="arrow-forward" size={14} color={colors.white} />
          </Pressable>
        </View>

        {/* Based on your books */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Theo sách của bạn</Text>
            <Pressable onPress={() => show('Hiển thị toàn bộ sách ôn tập.')} hitSlop={8}>
              <Text style={styles.sectionAction}>Xem tất cả</Text>
            </Pressable>
          </View>
          <KnowledgeReviewBookCard book={REVIEW_BOOK} onContinue={() => openBookKnowledge(REVIEW_BOOK.bookId)} />
        </View>

        {/* History & achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch sử & Thành tích</Text>
          </View>
          <View style={styles.historyList}>
            {HISTORY_ITEMS.map((item) => (
              <KnowledgeHistoryCard
                key={item.bookId}
                item={item}
                onPress={() => openBookKnowledge(item.bookId)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Toast toast={toast} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: colors.white,
  },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: fontSize.h3, fontWeight: '900', color: colors.slate900 },

  scroll: { padding: spacing.lg, paddingBottom: 96, gap: spacing.xl },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    ...shadow.card,
  },
  cardLabel: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  gaugeValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.md },
  gaugeValue: { fontSize: fontSize.h2, fontWeight: '900', color: '#1E3A8A' },
  gaugeCaption: { fontSize: fontSize.xs, fontWeight: '800', color: colors.slate500 },
  gaugeTrack: {
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.slate200,
    padding: 2,
    overflow: 'hidden',
  },
  gaugeFill: { height: '100%', borderRadius: radius.pill },

  statsCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsText: { flex: 1, minWidth: 0 },
  statsValue: { fontSize: fontSize.h3, fontWeight: '900', color: colors.slate800 },
  statsLabel: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },

  challengeCard: {
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#DCE9FB',
    borderRadius: radius.xxl,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  challengeWatermark: {
    position: 'absolute',
    right: -10,
    top: -18,
    fontSize: 100,
    fontWeight: '900',
    color: 'rgba(29, 78, 216, 0.04)',
  },
  challengeKicker: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  challengeTitle: { fontSize: fontSize.lg, fontWeight: '900', color: colors.slate900, lineHeight: 18 },
  challengeDesc: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.slate500,
    lineHeight: 16,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#004275',
    paddingHorizontal: spacing.xl,
    paddingVertical: 11,
    borderRadius: radius.xl,
  },
  challengeButtonText: { fontSize: fontSize.base, fontWeight: '800', color: colors.white },

  section: { gap: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    gap: spacing.md,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  sectionAction: { fontSize: fontSize.xs, fontWeight: '800', color: colors.primaryLight },
  historyList: { gap: 10 },
});
