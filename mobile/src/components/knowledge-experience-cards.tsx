/**
 * Cards used by the knowledge experience hub (#view-knowledge-experience):
 * the "Theo sách của bạn" review card and the "Lịch sử & Thành tích" rows.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { resolveCover } from '@/data/cover-images';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export interface KnowledgeReviewBook {
  bookId: string;
  title: string;
  author: string;
  /** Web-style cover path; resolved through `resolveCover`. */
  cover: string;
  masteryLabel: string;
  /** 0..100 */
  progress: number;
}

export interface KnowledgeHistoryItem {
  bookId: string;
  title: string;
  cover: string;
  meta: string;
  /** 0..100 */
  score: number;
}

export function KnowledgeReviewBookCard({
  book,
  onContinue,
}: {
  book: KnowledgeReviewBook;
  onContinue: () => void;
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewRow}>
        <Image source={resolveCover(book.cover)} style={styles.reviewCover} contentFit="cover" transition={150} />
        <View style={styles.reviewInfo}>
          <Text numberOfLines={1} style={styles.reviewTitle}>
            {book.title}
          </Text>
          <Text style={styles.reviewAuthor}>{book.author}</Text>
          <View style={styles.masteryPill}>
            <MaterialIcons name="stars" size={11} color="#B45309" />
            <Text style={styles.masteryPillText}>{book.masteryLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.thinTrack}>
        <View style={[styles.thinFill, { width: `${book.progress}%` }]} />
      </View>

      <Pressable onPress={onContinue} style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}>
        <Text style={styles.outlineButtonText}>Tiếp tục ôn tập</Text>
      </Pressable>
    </View>
  );
}

export function KnowledgeHistoryCard({ item, onPress }: { item: KnowledgeHistoryItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.historyCard, pressed && styles.pressed]}>
      <Image source={resolveCover(item.cover)} style={styles.historyCover} contentFit="cover" transition={150} />
      <View style={styles.historyInfo}>
        <Text numberOfLines={1} style={styles.historyTitle}>
          {item.title}
        </Text>
        <Text style={styles.historyMeta}>{item.meta}</Text>
      </View>
      <Text style={styles.historyScore}>{item.score}%</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },

  reviewCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow.card,
  },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  reviewCover: {
    width: 56,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
  },
  reviewInfo: { flex: 1, minWidth: 0 },
  reviewTitle: { fontSize: fontSize.base, fontWeight: '900', color: colors.slate800, lineHeight: 16 },
  reviewAuthor: { fontSize: fontSize.xs, fontWeight: '600', color: colors.slate500, marginTop: 2 },
  masteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.amberSoft,
  },
  masteryPillText: { fontSize: fontSize.xs, fontWeight: '800', color: '#B45309' },
  thinTrack: { height: 4, borderRadius: radius.pill, backgroundColor: colors.slate100, overflow: 'hidden' },
  thinFill: { height: '100%', borderRadius: radius.pill, backgroundColor: '#D97706' },
  outlineButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outlineButtonText: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate700 },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadow.card,
  },
  historyCover: {
    width: 40,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
  },
  historyInfo: { flex: 1, minWidth: 0 },
  historyTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800, lineHeight: 16 },
  historyMeta: { fontSize: fontSize.xs, fontWeight: '600', color: colors.slate500, marginTop: 2 },
  historyScore: { fontSize: fontSize.lg, fontWeight: '900', color: colors.primary },
});
