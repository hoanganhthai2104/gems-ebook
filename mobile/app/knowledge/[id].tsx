/**
 * Knowledge detail — the React Native port of #view-knowledge-details
 * (`openBookKnowledgeDetails`). `[id]` is the book id.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { KnowledgeChapterCard } from '@/components/knowledge-chapter-card';
import { MasteryGauge } from '@/components/knowledge-mastery-gauge';
import { KnowledgeTermShelf } from '@/components/knowledge-term-shelf';
import { Toast, useToast } from '@/components/toast';
import { getBookKnowledge, type KnowledgeHistoryEntry } from '@/data/articles';
import { getChaptersForBook, resolveChapterId } from '@/data/chapters';
import { resolveCover } from '@/data/cover-images';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export default function KnowledgeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const knowledge = useMemo(() => getBookKnowledge(id), [id]);
  const { toast, show } = useToast();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  /** Maps a knowledge chapter number onto the real chapter id for the quiz route. */
  const startChapterQuiz = (chapterNum: number) => {
    const chapters = getChaptersForBook(knowledge.bookId);
    const chapterId = chapters[chapterNum - 1]?.id ?? resolveChapterId(knowledge.bookId);
    if (!chapterId) return;
    router.push({ pathname: '/quiz/[chapterId]', params: { chapterId } });
  };

  return (
    <Screen variant="surface">
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={22} color={colors.slate600} />
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>
          Chi tiết kiến thức
        </Text>
        <Pressable onPress={() => show('Thêm tùy chọn...')} hitSlop={8} style={styles.headerButton}>
          <MaterialIcons name="more-vert" size={22} color={colors.slate600} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.overviewCard}>
          <Image source={resolveCover(knowledge.cover)} style={styles.cover} contentFit="cover" transition={150} />
          <Text style={styles.bookTitle}>{knowledge.title}</Text>
          <Text style={styles.bookAuthor}>{knowledge.author}</Text>

          <View style={styles.gaugeCard}>
            <Text style={styles.gaugeLabel}>Mức độ thông thạo</Text>
            <MasteryGauge percent={knowledge.mastery} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="bar-chart" size={18} color={colors.primary} />
            <Text style={styles.cardHeaderText}>Hiệu suất gần đây</Text>
          </View>
          <View style={styles.historyList}>
            {knowledge.history.map((entry) => (
              <HistoryRow key={entry.name} entry={entry} />
            ))}
          </View>
          <Pressable
            onPress={() => show('Xem toàn bộ lịch sử...')}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Text style={styles.outlineButtonText}>Xem toàn bộ lịch sử</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Cấu trúc Nội dung</Text>
          {knowledge.chapters.map((chapter) => (
            <KnowledgeChapterCard
              key={chapter.num}
              chapter={chapter}
              onQuiz={() => startChapterQuiz(chapter.num)}
              show={show}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="bookmark" size={18} color={colors.primary} />
            <Text style={styles.cardHeaderText}>Thuật ngữ cần chú ý</Text>
          </View>
          <KnowledgeTermShelf
            terms={knowledge.terms}
            onOpenTerm={(term) =>
              router.push({ pathname: '/dictionary/[term]', params: { term: term.title } })
            }
            onOpenDictionary={() => router.push('/dictionary')}
          />
        </View>
      </ScrollView>

      <Toast toast={toast} />
    </Screen>
  );
}

function HistoryRow({ entry }: { entry: KnowledgeHistoryEntry }) {
  const strong = entry.score >= 90;
  return (
    <View style={styles.historyRow}>
      <Text style={styles.historyName}>{entry.name}</Text>
      <View style={[styles.scorePill, strong ? styles.scorePillStrong : styles.scorePillPlain]}>
        <Text style={[styles.scoreText, strong ? styles.scoreTextStrong : styles.scoreTextPlain]}>
          {entry.score}%
        </Text>
      </View>
    </View>
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

  scroll: { padding: spacing.lg, paddingBottom: 80, gap: spacing.lg },

  overviewCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow.card,
  },
  cover: {
    width: 112,
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
    marginBottom: spacing.lg,
  },
  bookTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800, textAlign: 'center', lineHeight: 18 },
  bookAuthor: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate500,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  gaugeCard: {
    width: '100%',
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  gaugeLabel: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadow.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardHeaderText: {
    fontSize: fontSize.base,
    fontWeight: '900',
    color: colors.slate900,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  historyList: { gap: spacing.md },
  historyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  historyName: { flexShrink: 1, fontSize: fontSize.base, fontWeight: '700', color: colors.slate700 },
  scorePill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: radius.pill, borderWidth: 1 },
  scorePillStrong: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder },
  scorePillPlain: { backgroundColor: colors.slate100, borderColor: colors.slate100 },
  scoreText: { fontSize: fontSize.xs, fontWeight: '800' },
  scoreTextStrong: { color: colors.primary },
  scoreTextPlain: { color: colors.slate500 },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outlineButtonText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate600 },

  section: { gap: spacing.md },
  sectionHeading: {
    fontSize: fontSize.base,
    fontWeight: '900',
    color: colors.slate900,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
});
