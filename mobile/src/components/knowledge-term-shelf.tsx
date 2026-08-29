/**
 * Horizontal shelf of "Thuật ngữ cần chú ý" cards, closing with the shortcut
 * into the medical dictionary.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { KnowledgeTerm } from '@/data/articles';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface KnowledgeTermShelfProps {
  terms: KnowledgeTerm[];
  onOpenTerm: (term: KnowledgeTerm) => void;
  onOpenDictionary: () => void;
}

export function KnowledgeTermShelf({ terms, onOpenTerm, onOpenDictionary }: KnowledgeTermShelfProps) {
  return (
    <ScrollView
      style={styles.horizontalRail} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.termsShelf}>
      {terms.map((term) => (
        <TermCard key={term.title} term={term} onPress={() => onOpenTerm(term)} />
      ))}
      <Pressable
        onPress={onOpenDictionary}
        style={({ pressed }) => [styles.dictionaryCard, pressed && styles.pressed]}
      >
        <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
        <Text style={styles.dictionaryCardText}>Mở từ điển y khoa</Text>
      </Pressable>
    </ScrollView>
  );
}

function TermCard({ term, onPress }: { term: KnowledgeTerm; onPress: () => void }) {
  const needsReview = term.badge.includes('ôn tập');
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.termCard, pressed && styles.pressed]}>
      <View style={[styles.termBadge, needsReview ? styles.termBadgeAmber : styles.termBadgeBlue]}>
        <Text style={[styles.termBadgeText, needsReview ? styles.termBadgeTextAmber : styles.termBadgeTextBlue]}>
          {term.badge}
        </Text>
      </View>
      <Text numberOfLines={1} style={styles.termTitle}>
        {term.title}
      </Text>
      <Text numberOfLines={2} style={styles.termDesc}>
        {term.desc}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /** A horizontal ScrollView stretches to fill its parent's cross axis
   *  unless flexGrow is pinned, which would leave a tall blank gap. */
  horizontalRail: { flexGrow: 0, flexShrink: 0 },
  pressed: { opacity: 0.85 },
  termsShelf: { gap: spacing.md, paddingBottom: spacing.sm, paddingHorizontal: 4 },
  termCard: {
    width: 176,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  termBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  termBadgeAmber: { backgroundColor: colors.amberSoft, borderColor: '#FDE68A' },
  termBadgeBlue: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder },
  termBadgeText: { fontSize: fontSize.xs, fontWeight: '800' },
  termBadgeTextAmber: { color: '#B45309' },
  termBadgeTextBlue: { color: colors.primary },
  termTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate800, marginTop: spacing.sm },
  termDesc: { fontSize: fontSize.xs, fontWeight: '600', color: colors.slate500, lineHeight: 15, marginTop: 4 },
  dictionaryCard: {
    width: 128,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  dictionaryCardText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 6,
  },
});
