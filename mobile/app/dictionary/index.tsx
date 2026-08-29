/**
 * Medical dictionary index - the port of the web's #view-dictionary: a search
 * field over the whole glossary and the A-Z grouped term cards.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, EmptyState, Screen } from '@/components/screen';
import { termPreview } from '@/components/dictionary-sections';
import { DICTIONARY_TERMS, groupTermsByLetter, searchTerms } from '@/data/dictionary';
import type { DictionaryTerm } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export default function DictionaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');

  const results = useMemo(() => (query.trim() ? searchTerms(query) : DICTIONARY_TERMS), [query]);
  const groups = useMemo(() => groupTermsByLetter(results), [results]);

  const openTerm = (term: string) => router.push({ pathname: '/dictionary/[term]', params: { term } });

  return (
    <Screen variant="surface">
      <AppHeader title="Từ điển Y khoa" showBack compact />

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color={colors.slate500} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm kiếm thuật ngữ, bệnh lý..."
            placeholderTextColor={colors.slate500}
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <MaterialIcons name="close" size={16} color={colors.slate500} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {groups.length === 0 ? (
        <EmptyState
          icon="search-off"
          title="Không tìm thấy thuật ngữ"
          message="Thử một từ khóa khác hoặc xóa bộ lọc tìm kiếm."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <View key={group.letter} style={styles.group}>
              <Text style={styles.groupLetter}>{group.letter}</Text>
              <View style={styles.groupItems}>
                {group.items.map((term) => (
                  <DictionaryCard key={term.term} term={term} onPress={() => openTerm(term.term)} />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function DictionaryCard({ term, onPress }: { term: DictionaryTerm; onPress: () => void }) {
  const preview = termPreview(term);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTerm}>{term.term}</Text>
        {term.pronunciation ? <Text style={styles.cardPronunciation}>{term.pronunciation}</Text> : null}
      </View>
      {preview ? (
        <Text numberOfLines={2} style={styles.cardPreview}>
          {preview}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.slate100,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.lg,
    color: colors.slate700,
    fontWeight: '500',
    padding: 0,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  group: { gap: spacing.sm },
  groupLetter: { fontSize: fontSize.xl, fontWeight: '900', color: '#1E3A8A' },
  groupItems: { gap: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.lg,
    gap: 4,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTerm: { flex: 1, fontSize: fontSize.lg, fontWeight: '900', color: colors.slate900 },
  cardPronunciation: { fontSize: fontSize.sm, color: colors.primaryLight, fontWeight: '700' },
  cardPreview: { fontSize: fontSize.sm, color: colors.slate500, lineHeight: 16 },
  pressed: { opacity: 0.75 },
});
