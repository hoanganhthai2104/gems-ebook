/**
 * Book detail content sections: rating stars, summary, author card and the
 * "Sách cùng thể loại" grid. Ported from #view-book-detail.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthorAvatar } from '@/components/author-avatar';
import { resolveCover } from '@/data/cover-images';
import type { Book } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export const AUTHOR_TAGLINE =
  'Chuyên gia đầu ngành về Y học Cổ truyền với nhiều công trình nghiên cứu được công bố quốc tế.';

interface RatingStarsProps {
  rating: string;
  size?: number;
}

/** Five-star row with a half star for fractional ratings. */
export function RatingStars({ rating, size = 13 }: RatingStarsProps) {
  const value = Number.parseFloat(rating) || 0;
  return (
    <View style={styles.starRow}>
      {[0, 1, 2, 3, 4].map((index) => {
        const filled = value >= index + 1;
        const half = !filled && value > index;
        return (
          <MaterialIcons
            key={index}
            name={filled ? 'star' : half ? 'star-half' : 'star-border'}
            size={size}
            color="#EAB308"
          />
        );
      })}
    </View>
  );
}

export function SummarySection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tóm tắt nội dung</Text>
      <Text numberOfLines={expanded ? undefined : 4} style={styles.summaryText}>
        {description}
      </Text>
      <Pressable onPress={() => setExpanded((prev) => !prev)} style={styles.moreButton} hitSlop={6}>
        <Text style={styles.moreButtonText}>{expanded ? 'Thu gọn' : 'Xem thêm'}</Text>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={16}
          color={colors.primary}
        />
      </Pressable>
    </View>
  );
}

interface AuthorSectionProps {
  authorName: string;
  onPress: () => void;
}

export function AuthorSection({ authorName, onPress }: AuthorSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Về tác giả</Text>
      <Pressable onPress={onPress} style={styles.authorCard}>
        <AuthorAvatar name={authorName} size={56} style={styles.authorAvatar} />
        <View style={styles.authorBody}>
          <Text numberOfLines={1} style={styles.authorName}>
            {authorName}
          </Text>
          <Text numberOfLines={2} style={styles.authorBio}>
            {AUTHOR_TAGLINE}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={18} color={colors.slate400} />
      </Pressable>
    </View>
  );
}

interface RelatedBooksSectionProps {
  books: Book[];
  onSelectBook: (id: string) => void;
  onSeeAll: () => void;
}

export function RelatedBooksSection({ books, onSelectBook, onSeeAll }: RelatedBooksSectionProps) {
  if (books.length === 0) return null;
  return (
    <View style={styles.relatedCard}>
      <View style={styles.relatedHeader}>
        <Text style={styles.sectionTitle}>Sách cùng thể loại</Text>
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={styles.linkText}>Xem tất cả</Text>
        </Pressable>
      </View>
      <View style={styles.relatedGrid}>
        {books.map((book) => (
          <Pressable key={book.id} onPress={() => onSelectBook(book.id)} style={styles.relatedTile}>
            <Image
              source={resolveCover(book.cover)}
              style={styles.relatedCover}
              contentFit="cover"
              transition={150}
            />
            <Text numberOfLines={1} style={styles.relatedTitle}>
              {book.title}
            </Text>
            <Text numberOfLines={1} style={styles.relatedAuthor}>
              {book.author}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate800 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 1 },

  summaryText: { fontSize: fontSize.base, lineHeight: 19, color: colors.slate600 },
  moreButton: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  moreButtonText: { fontSize: fontSize.base, fontWeight: '700', color: colors.primary },

  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  authorAvatar: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  authorBody: { flex: 1, gap: 2 },
  authorName: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800 },
  authorBio: { fontSize: fontSize.xs, lineHeight: 14, color: colors.slate500 },

  relatedCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  relatedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linkText: { fontSize: fontSize.base, fontWeight: '600', color: colors.primary },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  relatedTile: {
    width: '47%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(241, 245, 249, 0.5)',
    borderRadius: radius.lg,
    padding: 10,
    ...shadow.card,
  },
  relatedCover: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.slate100,
    marginBottom: spacing.sm,
  },
  relatedTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800 },
  relatedAuthor: { fontSize: fontSize.xs, color: colors.slate500 },
});
