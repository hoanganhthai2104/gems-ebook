/**
 * Home tab — the React Native port of #view-home.
 * Greeting, streak/pages stats, daily missions, continue reading,
 * news shelf, quick explore and recommendations.
 */
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { HomeMissions, type HomeMission } from '@/components/home-missions';
import { HomeContinueReading } from '@/components/home-continue-reading';
import { ExploreRow, RecommendationTile, StatCard } from '@/components/home-tiles';
import { NewsShelfCard } from '@/components/news-cards';
import { Toast, useToast } from '@/components/toast';
import { HOME_NEWS_CARDS } from '@/data/articles';
import { getBook } from '@/data/catalog';
import { useAppStore } from '@/store/app-store';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

const LOGO = require('../../assets/logo.png');

/** Typewriter greetings from `initTypewriter('home-typewriter-greeting', ...)`. */
const GREETINGS = ['Chào buổi sáng', 'Chào ngày mới', 'Chào mừng bác sĩ'];
const GREETING_INTERVAL_MS = 4000;

/** Recommendation tiles are hand-picked on web; the badge/subtitle copy is theirs. */
const RECOMMENDATIONS: { bookId: string; badge: string; badgeColor: string; subtitle: string }[] = [
  { bookId: 'lamsangnoikhoa', badge: 'Mới', badgeColor: colors.primary, subtitle: 'Dành cho Bác sĩ nội khoa' },
  { bookId: 'capnhatyvan', badge: 'Hot', badgeColor: '#8C5A2C', subtitle: 'Y văn mới' },
];

export default function HomeScreen() {
  const router = useRouter();
  const userName = useAppStore((s) => s.userName);
  const userCoins = useAppStore((s) => s.userCoins);
  const streakDays = useAppStore((s) => s.streakDays);
  const pagesRead = useAppStore((s) => s.pagesRead);
  const greeting = useRotatingGreeting();
  const { toast, show } = useToast();

  /** Both home CTAs open the knowledge hub, matching `openKnowledgeExperience`. */
  const openKnowledge = () => router.push('/knowledge');
  const openReadingHabit = () => router.push('/profile/reading-habit');

  const missions = useMemo<HomeMission[]>(
    () => [
      { id: 'read', title: 'Đọc 15 phút', state: 'done', statusLabel: 'Hoàn thành' },
      {
        id: 'quiz',
        title: 'Hoàn thành bài kiểm tra chương 4',
        state: 'progress',
        progressLabel: '3/5',
        statusLabel: 'Đang tiến hành',
        actionLabel: 'Làm ngay',
        onPress: () => router.push('/knowledge'),
      },
      {
        id: 'lookup',
        title: 'Tra cứu 5 thuật ngữ',
        state: 'progress',
        progressLabel: '4/5',
        statusLabel: 'Đang tiến hành',
        actionLabel: 'Làm ngay',
        onPress: () => router.push('/dictionary'),
      },
    ],
    [router],
  );

  return (
    <Screen variant="mesh">
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
        <View style={[styles.headerSide, styles.headerSideEnd]}>
          <Pressable
            onPress={() => show('Chưa có thông báo lâm sàng mới.')}
            hitSlop={8}
            style={styles.bellButton}
          >
            <MaterialIcons name="notifications" size={22} color={colors.primary} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="local-fire-department"
            iconTint={colors.amber}
            iconBg={colors.amberSoft}
            value={`${streakDays} Ngày`}
            label="Chuỗi đọc"
            onPress={openReadingHabit}
          />
          <StatCard
            icon="menu-book"
            iconTint={colors.primary}
            iconBg={colors.primarySoft}
            value={`${pagesRead} trang`}
            label="Trang đã đọc"
            onPress={openReadingHabit}
          />
        </View>

        <HomeMissions missions={missions} coins={userCoins} />

        <HomeContinueReading />

        <View>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="article" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Tin tức &amp; Blog</Text>
            </View>
            <Pressable onPress={() => router.push('/news')} hitSlop={8} style={styles.moreLink}>
              <Text style={styles.moreLinkText}>Xem thêm</Text>
              <MaterialIcons name="chevron-right" size={14} color={colors.primaryLight} />
            </Pressable>
          </View>
          <FlatList
            data={HOME_NEWS_CARDS}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => <NewsShelfCard article={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shelf}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderLeft}>
            <MaterialIcons name="explore" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Khám phá nhanh</Text>
          </View>
          <View style={styles.exploreList}>
            <ExploreRow
              icon="translate"
              iconTint={colors.primary}
              iconBg={colors.primarySoft}
              title="Từ điển Y khoa"
              subtitle="Tra cứu nhanh thuật ngữ"
              onPress={() => router.push('/dictionary')}
            />
            <ExploreRow
              icon="quiz"
              iconTint="#B45309"
              iconBg={colors.amberSoft}
              title="Trắc nghiệm kiến thức"
              subtitle="Ôn tập bài học"
              onPress={openKnowledge}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderLeft}>
            <MaterialIcons name="thumb-up" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Dành cho bạn</Text>
          </View>
          <View style={styles.recommendGrid}>
            {RECOMMENDATIONS.map((item) => {
              const book = getBook(item.bookId);
              if (!book) return null;
              return (
                <RecommendationTile
                  key={item.bookId}
                  book={book}
                  badge={item.badge}
                  badgeColor={item.badgeColor}
                  subtitle={item.subtitle}
                  onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Toast toast={toast} />
    </Screen>
  );
}

/** Cycles the greeting line the way the web typewriter effect does. */
function useRotatingGreeting(): string {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % GREETINGS.length), GREETING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);
  return GREETINGS[index] ?? GREETINGS[0]!;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerSide: { width: 40 },
  headerSideEnd: { alignItems: 'flex-end' },
  logo: { width: 104, height: 28 },
  bellButton: { padding: 6 },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#EF4444',
  },

  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: 100, gap: spacing.xxl },
  greetingBlock: { paddingBottom: spacing.sm },
  greeting: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  userName: { fontSize: fontSize.h3, fontWeight: '900', color: '#1E3A8A', lineHeight: 24, marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: spacing.lg },

  section: { gap: spacing.md },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  moreLink: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  moreLinkText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primaryLight },
  shelf: { gap: spacing.lg, paddingBottom: spacing.sm },

  exploreList: { gap: 10 },
  recommendGrid: { flexDirection: 'row', gap: spacing.lg },
});
