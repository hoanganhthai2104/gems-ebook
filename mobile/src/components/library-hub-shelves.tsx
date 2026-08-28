/**
 * Pure-typography shelf headers plus horizontal poster rails.
 * Port of the `shelvesHtml` block inside window.renderNetflixSubHub().
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { getBooksByIds } from '@/data/catalog';
import { resolveCover } from '@/data/cover-images';
import type { Book, CategoryShelf } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface HubShelvesProps {
  shelves: CategoryShelf[];
  onSelectBook: (bookId: string) => void;
}

export function HubShelves({ shelves, onSelectBook }: HubShelvesProps) {
  return (
    <View style={styles.stack}>
      {shelves.map((shelf) => {
        const books = getBooksByIds(shelf.bookIds);
        if (books.length === 0) return null;
        return <HubShelf key={shelf.title} shelf={shelf} books={books} onSelectBook={onSelectBook} />;
      })}
    </View>
  );
}

interface HubShelfProps {
  shelf: CategoryShelf;
  books: Book[];
  onSelectBook: (bookId: string) => void;
}

function HubShelf({ shelf, books, onSelectBook }: HubShelfProps) {
  return (
    <View style={styles.shelf}>
      <View style={styles.shelfHeader}>
        <View style={styles.shelfHeadings}>
          <Text style={styles.shelfTitle}>{shelf.title.toUpperCase()}</Text>
          {shelf.subtitle ? <Text style={styles.shelfSubtitle}>{shelf.subtitle}</Text> : null}
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{books.length} cuốn</Text>
        </View>
      </View>

      <ScrollView
      style={styles.horizontalRail}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {books.map((book) => (
          <ShelfCard key={book.id} book={book} onPress={() => onSelectBook(book.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

function ShelfCard({ book, onPress }: { book: Book; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardCoverWrap}>
        <Image source={resolveCover(book.cover)} style={styles.cardCover} contentFit="cover" transition={150} />
        <View style={styles.cardRating}>
          <MaterialIcons name="star" size={9} color={colors.amber} />
          <Text style={styles.cardRatingText}>{book.rating || '4.8'}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.cardTitle}>
        {book.title}
      </Text>
      <Text numberOfLines={1} style={styles.cardAuthor}>
        {book.author || 'LIMES Academic'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /** A horizontal ScrollView stretches to fill its parent's cross axis
   *  unless flexGrow is pinned, which would leave a tall blank gap. */
  horizontalRail: { flexGrow: 0, flexShrink: 0 },
  stack: { gap: spacing.xxl },
  shelf: { gap: 10 },
  shelfHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    gap: spacing.sm,
  },
  shelfHeadings: { flexShrink: 1 },
  shelfTitle: {
    fontSize: fontSize.base,
    fontWeight: '900',
    color: colors.slate900,
    letterSpacing: 0.4,
    lineHeight: 15,
  },
  shelfSubtitle: { fontSize: fontSize.xs, color: colors.slate400, fontWeight: '500', marginTop: 2 },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.slate100,
  },
  countPillText: { fontSize: 9.5, fontWeight: '700', color: colors.slate600 },

  rail: { gap: 14, paddingHorizontal: 4, paddingTop: 4, paddingBottom: spacing.sm },
  card: { width: 128 },
  cardCoverWrap: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.slate200,
    ...shadow.card,
  },
  cardCover: { width: '100%', height: '100%' },
  cardRating: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardRatingText: { fontSize: 8.5, fontWeight: '900', color: colors.amber },
  cardTitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    fontWeight: '900',
    color: colors.slate800,
    lineHeight: 14,
  },
  cardAuthor: { marginTop: 2, fontSize: 9.5, fontWeight: '600', color: colors.slate400 },
});
