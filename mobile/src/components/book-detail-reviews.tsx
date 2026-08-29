/**
 * "Đánh giá & Nhận xét" block of the book detail screen, including the rating
 * histogram and the two sample reviews shipped with the web app.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RatingStars } from '@/components/book-detail-sections';
import { ProgressBar } from '@/components/ui';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const RATING_BARS = [
  { star: '5', ratio: 0.85 },
  { star: '4', ratio: 0.1 },
  { star: '3', ratio: 0.03 },
];

const REVIEWS = [
  {
    author: 'Minh Tuấn (Bác sĩ Nội trú)',
    when: '2 ngày trước',
    body: 'Cuốn sách nghiên cứu thảo dược rất có hệ thống. Hình ảnh và lý luận y học kết hợp hài hòa.',
  },
  {
    author: 'Dược sĩ Hồng Liên',
    when: '1 tuần trước',
    body: 'Bài thuốc Tam Thất viết rất sâu sắc, có đầy đủ so sánh thực nghiệm saponin.',
  },
];

interface ReviewsSectionProps {
  rating: string;
  onWriteReview: () => void;
  onSeeAllReviews: () => void;
}

export function ReviewsSection({ rating, onWriteReview, onSeeAllReviews }: ReviewsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Đánh giá &amp; Nhận xét</Text>
        <Pressable onPress={onWriteReview} hitSlop={8} style={styles.writeButton}>
          <MaterialIcons name="edit-square" size={16} color={colors.primary} />
          <Text style={styles.writeButtonText}>Viết đánh giá</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryScore}>
          <Text style={styles.scoreValue}>{rating}</Text>
          <RatingStars rating={rating} size={12} />
          <Text style={styles.scoreLabel}>128 ĐÁNH GIÁ</Text>
        </View>
        <View style={styles.bars}>
          {RATING_BARS.map((bar) => (
            <View key={bar.star} style={styles.barRow}>
              <Text style={styles.barStar}>{bar.star}</Text>
              <ProgressBar
                progress={bar.ratio}
                color={colors.primary}
                height={6}
                trackColor="rgba(226, 232, 240, 0.5)"
                style={styles.barTrack}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.reviewList}>
        {REVIEWS.map((review) => (
          <View key={review.author} style={styles.reviewCard}>
            <View style={styles.reviewHead}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>
              <Text style={styles.reviewWhen}>{review.when}</Text>
            </View>
            <Text style={styles.reviewBody}>{review.body}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={onSeeAllReviews} style={styles.allReviewsButton}>
        <Text style={styles.allReviewsText}>Xem tất cả 128 đánh giá</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  writeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  writeButtonText: { fontSize: fontSize.base, fontWeight: '600', color: colors.primary },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    ...shadow.card,
  },
  summaryScore: { alignItems: 'center', gap: 4 },
  scoreValue: { fontSize: fontSize.h1, fontWeight: '700', color: colors.primary },
  scoreLabel: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },
  bars: { flex: 1, gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barStar: { width: 10, fontSize: fontSize.xs, fontWeight: '700', color: colors.slate600 },
  barTrack: { flex: 1 },

  reviewList: { gap: spacing.sm },
  reviewCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  reviewHead: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  reviewAuthor: { flexShrink: 1, fontSize: fontSize.xs, fontWeight: '700', color: colors.slate800 },
  reviewWhen: { fontSize: fontSize.xs, color: colors.slate500 },
  reviewBody: { fontSize: fontSize.base, lineHeight: 18, color: colors.slate600 },

  allReviewsButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  allReviewsText: { fontSize: fontSize.base, fontWeight: '700', color: colors.primary },
});
