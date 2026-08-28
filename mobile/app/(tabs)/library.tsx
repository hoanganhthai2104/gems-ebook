/**
 * Library tab - the React Native port of the web "Kho Sách Y Khoa LIMES"
 * catalog: a Netflix-style category sub-hub with category filter chips and the
 * three view modes (hub / grid / list) driven by window.renderCatalogBooks().
 */
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen, EmptyState } from '@/components/screen';
import { BookGridTile, BookListRow } from '@/components/book-card';
import { HubHero } from '@/components/library-hub-hero';
import { HubShelves } from '@/components/library-hub-shelves';
import {
  CategoryChips,
  HubTagline,
  ViewModeSwitch,
  type CatalogViewMode,
} from '@/components/library-toolbar';
import { BOOKS, CATEGORY_HUBS, getBook, getFilteredBooks, getHub } from '@/data/catalog';
import type { Book } from '@/data/types';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

export default function LibraryScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('all');
  const [mode, setMode] = useState<CatalogViewMode>('hub');

  const hub = getHub(category) ?? CATEGORY_HUBS.all;
  const books = useMemo(() => getFilteredBooks(category), [category]);
  const spotlight: Book | undefined = getBook(hub?.spotlightId) ?? BOOKS[0];

  const openBookDetails = (id: string) =>
    router.push({ pathname: '/book/[id]', params: { id } });
  const openAudiobook = (id: string) =>
    router.push({ pathname: '/audiobook/[bookId]', params: { bookId: id } });

  return (
    <Screen variant="surface">
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {(hub?.title ?? 'Kho Sách Y Khoa LIMES').toUpperCase()}
        </Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/search')} hitSlop={8} style={styles.searchButton}>
            <MaterialIcons name="search" size={20} color={colors.primary} />
          </Pressable>
          <ViewModeSwitch mode={mode} onChange={setMode} />
        </View>
      </View>

      <CategoryChips category={category} onChange={setCategory} />
      {hub?.tagline ? <HubTagline tagline={hub.tagline} /> : null}

      {mode === 'hub' ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.hubContent}
          showsVerticalScrollIndicator={false}
        >
          {hub && spotlight ? (
            <HubHero
              hub={hub}
              book={spotlight}
              onOpenBook={() => openBookDetails(spotlight.id)}
              onListenAudio={() => openAudiobook(spotlight.id)}
            />
          ) : null}
          {hub ? <HubShelves shelves={hub.shelves} onSelectBook={openBookDetails} /> : null}
        </ScrollView>
      ) : null}

      {mode === 'grid' ? (
        <FlatList
          key="grid"
          data={books}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookGridTile book={item} onPress={() => openBookDetails(item.id)} />
          )}
          ListEmptyComponent={<CatalogEmpty />}
        />
      ) : null}

      {mode === 'list' ? (
        <FlatList
          key="list"
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListGap}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookListRow book={item} onPress={() => openBookDetails(item.id)} />
          )}
          ListEmptyComponent={<CatalogEmpty />}
        />
      ) : null}
    </Screen>
  );
}

function ListGap() {
  return <View style={styles.listGap} />;
}

function CatalogEmpty() {
  return (
    <EmptyState
      icon="menu-book"
      title="Không tìm thấy kết quả"
      message="Chúng tôi không tìm thấy kết quả phù hợp với từ khóa của bạn. Hãy thử tìm từ khóa khác nhé."
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '900',
    color: colors.slate900,
    letterSpacing: -0.2,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchButton: { padding: 6, borderRadius: radius.pill },
  hubContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 112,
    gap: spacing.xxl,
  },
  listContent: { padding: spacing.md, paddingBottom: 112 },
  gridRow: { gap: spacing.md, marginBottom: spacing.md },
  listGap: { height: spacing.md },
});
