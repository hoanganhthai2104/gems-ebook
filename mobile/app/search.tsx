/**
 * Library search overlay - port of #view-library-search.
 * Shows recent searches and popular tags while the query is empty, then splits
 * matches into "Sách & Tài liệu" and "Sách nói" sections.
 */
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { BookListRow } from '@/components/book-card';
import { searchBooks } from '@/data/catalog';
import { resolveCover } from '@/data/cover-images';
import type { Book } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

const POPULAR_TAGS = [
  'Chẩn đoán',
  'Tim mạch',
  'Thần kinh',
  'Thảo dược quý',
  'Giải phẫu',
  'Dược lý',
];

const MAX_RECENT = 6;

export default function LibrarySearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  const results = useMemo(() => searchBooks(query), [query]);
  const audiobooks = results.slice(0, 3);
  const hasQuery = query.trim().length > 0;

  const rememberQuery = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecent((prev) => [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, MAX_RECENT));
  };

  const applyTag = (tag: string) => {
    setQuery(tag);
    rememberQuery(tag);
  };

  const openBookDetails = (id: string) => {
    rememberQuery(query);
    router.push({ pathname: '/book/[id]', params: { id } });
  };

  const openAudiobook = (id: string) => {
    rememberQuery(query);
    router.push({ pathname: '/audiobook/[bookId]', params: { bookId: id } });
  };

  return (
    <Screen variant="plain">
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))}
          hitSlop={8}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.slate600} />
        </Pressable>
        <View style={styles.searchField}>
          <MaterialIcons name="search" size={18} color={colors.slate400} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => rememberQuery(query)}
            placeholder="Tìm kiếm sách, tác giả, tài liệu..."
            placeholderTextColor={colors.slate400}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />
          {hasQuery ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8} style={styles.clearButton}>
              <MaterialIcons name="close" size={14} color={colors.slate400} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={hasQuery ? styles.resultsContent : styles.defaultContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!hasQuery ? (
          <>
            {recent.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeadRow}>
                  <Text style={styles.sectionLabel}>Tìm kiếm gần đây</Text>
                  <Pressable onPress={() => setRecent([])} hitSlop={8}>
                    <Text style={styles.clearAll}>Xóa tất cả</Text>
                  </Pressable>
                </View>
                <View style={styles.pillWrap}>
                  {recent.map((item) => (
                    <Pressable key={item} onPress={() => applyTag(item)} style={styles.pill}>
                      <Text style={styles.pillText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Từ khóa nổi bật</Text>
              <View style={styles.pillWrap}>
                {POPULAR_TAGS.map((tag) => (
                  <Pressable key={tag} onPress={() => applyTag(tag)} style={styles.pill}>
                    <Text style={styles.pillText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : results.length === 0 ? (
          <View style={styles.noResults}>
            <MaterialIcons name="search-off" size={40} color={colors.slate300} />
            <Text style={styles.noResultsTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.noResultsMessage}>
              Chúng tôi không tìm thấy kết quả phù hợp với từ khóa của bạn. Hãy thử tìm từ khóa khác
              nhé.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultSection}>
              <Text style={styles.resultHeading}>Sách &amp; Tài liệu</Text>
              <View style={styles.resultList}>
                {results.map((book) => (
                  <BookListRow key={book.id} book={book} onPress={() => openBookDetails(book.id)} />
                ))}
              </View>
            </View>

            {audiobooks.length > 0 ? (
              <View style={styles.resultSection}>
                <Text style={styles.resultHeading}>Sách nói</Text>
                <View style={styles.resultList}>
                  {audiobooks.map((book) => (
                    <AudiobookRow
                      key={book.id}
                      book={book}
                      onPress={() => openAudiobook(book.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function AudiobookRow({ book, onPress }: { book: Book; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.audioRow}>
      <Image source={resolveCover(book.cover)} style={styles.audioCover} contentFit="cover" transition={150} />
      <View style={styles.audioBody}>
        <Text numberOfLines={2} style={styles.audioTitle}>
          {book.title}
        </Text>
        <Text numberOfLines={1} style={styles.audioAuthor}>
          {book.author}
        </Text>
      </View>
      <View style={styles.audioPlay}>
        <MaterialIcons name="headphones" size={16} color={colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  backButton: { padding: spacing.sm, borderRadius: radius.pill },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.slate100,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.4)',
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.slate700,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.slate200,
  },

  defaultContent: { padding: spacing.xl, gap: spacing.xxl },
  resultsContent: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl },
  section: { gap: spacing.md },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.slate800,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  clearAll: { fontSize: fontSize.xxs, fontWeight: '800', color: '#005A9C' },
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  pillText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate700 },

  resultSection: { gap: spacing.md },
  resultHeading: {
    fontSize: fontSize.xs,
    fontWeight: '900',
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingLeft: 4,
  },
  resultList: { gap: 10 },

  noResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: spacing.sm },
  noResultsTitle: { fontSize: fontSize.base, fontWeight: '900', color: colors.slate800 },
  noResultsMessage: {
    fontSize: fontSize.xs,
    color: colors.slate400,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 240,
  },

  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.md,
    ...shadow.card,
  },
  audioCover: { width: 44, aspectRatio: 2 / 3, borderRadius: radius.sm, backgroundColor: colors.slate200 },
  audioBody: { flex: 1, gap: 2 },
  audioTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.slate800, lineHeight: 16 },
  audioAuthor: { fontSize: fontSize.sm, color: colors.slate400 },
  audioPlay: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
