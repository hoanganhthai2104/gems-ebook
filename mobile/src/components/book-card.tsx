/**
 * Book presentation components in the three variants the web app uses:
 * poster (carousel / shelf), grid tile, and horizontal list row.
 */
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { resolveCover } from '@/data/cover-images';
import type { Book } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const POSTER_WIDTH = 118;

interface BookCardProps {
  book: Book;
  width?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function useOpenBook(book: Book, onPress?: () => void) {
  const router = useRouter();
  return onPress ?? (() => router.push({ pathname: '/book/[id]', params: { id: book.id } }));
}

/** Vertical poster used in horizontal shelves and the home carousel. */
export function BookPoster({ book, width = POSTER_WIDTH, onPress, style }: BookCardProps) {
  const handlePress = useOpenBook(book, onPress);
  return (
    <Pressable onPress={handlePress} style={[{ width }, style]}>
      <Image
        source={resolveCover(book.cover)}
        style={[styles.posterImage, { width, height: width * 1.5 }]}
        contentFit="cover"
        transition={150}
      />
      <Text numberOfLines={2} style={styles.posterTitle}>
        {book.title}
      </Text>
      <Text numberOfLines={1} style={styles.posterAuthor}>
        {book.author}
      </Text>
    </Pressable>
  );
}

/** Grid tile with a rating badge, used by the library grid view. */
export function BookGridTile({ book, onPress, style }: BookCardProps) {
  const handlePress = useOpenBook(book, onPress);
  return (
    <Pressable onPress={handlePress} style={[styles.gridTile, style]}>
      <Image source={resolveCover(book.cover)} style={styles.gridImage} contentFit="cover" transition={150} />
      <View style={styles.gridBody}>
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={11} color={colors.amber} />
          <Text style={styles.ratingText}>{book.rating}</Text>
        </View>
        <Text numberOfLines={2} style={styles.gridTitle}>
          {book.title}
        </Text>
        <Text numberOfLines={1} style={styles.gridAuthor}>
          {book.author}
        </Text>
      </View>
    </Pressable>
  );
}

/** Horizontal row with category badge and read count, used by list view + search. */
export function BookListRow({ book, onPress, style }: BookCardProps) {
  const handlePress = useOpenBook(book, onPress);
  return (
    <Pressable onPress={handlePress} style={[styles.row, style]}>
      <Image source={resolveCover(book.cover)} style={styles.rowImage} contentFit="cover" transition={150} />
      <View style={styles.rowBody}>
        <View style={styles.rowTopLine}>
          <View style={styles.badge}>
            <Text numberOfLines={1} style={styles.badgeText}>
              {book.category}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={11} color={colors.amber} />
            <Text style={styles.ratingText}>{book.rating}</Text>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.rowTitle}>
          {book.title}
        </Text>
        <Text numberOfLines={1} style={styles.rowAuthor}>
          {book.author}
        </Text>
        <View style={styles.rowFooter}>
          <View style={styles.rowFooterItem}>
            <MaterialIcons name="menu-book" size={14} color={colors.primary} />
            <Text style={styles.rowFooterRead}>Đọc sách</Text>
          </View>
          <Text style={styles.rowFooterCount}>{book.reads} đọc</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  posterImage: { borderRadius: radius.md, backgroundColor: colors.slate200, ...shadow.card },
  posterTitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: '800',
    color: colors.slate800,
    lineHeight: 16,
  },
  posterAuthor: { marginTop: 2, fontSize: fontSize.xs, color: colors.slate400 },

  gridTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    overflow: 'hidden',
    ...shadow.card,
  },
  gridImage: { width: '100%', aspectRatio: 2 / 3, backgroundColor: colors.slate200 },
  gridBody: { padding: spacing.sm, gap: 2 },
  gridTitle: { fontSize: fontSize.base, fontWeight: '800', color: colors.slate800, lineHeight: 16 },
  gridAuthor: { fontSize: fontSize.xs, color: colors.slate400 },

  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.md,
    ...shadow.card,
  },
  rowImage: { width: 64, aspectRatio: 2 / 3, borderRadius: radius.md, backgroundColor: colors.slate200 },
  rowBody: { flex: 1, justifyContent: 'space-between', gap: spacing.xs },
  rowTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  rowTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.slate800, lineHeight: 17 },
  rowAuthor: { fontSize: fontSize.sm, color: colors.slate400 },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  rowFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowFooterRead: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  rowFooterCount: { fontSize: fontSize.xs, color: colors.slate400, fontWeight: '600' },

  badge: {
    flexShrink: 1,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: fontSize.xxs, fontWeight: '800', color: colors.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.amber },
});
