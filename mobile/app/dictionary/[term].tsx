/**
 * Dictionary term detail - the port of the web's #view-dict-term. Sections are
 * rendered only when the entry actually carries that data, matching
 * openDictionaryTerm()'s show/hide behaviour.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, EmptyState, Screen } from '@/components/screen';
import {
  DictBulletList,
  DictCardSection,
  DictDiagnosisList,
  DictIllustration,
  DictRelatedDoc,
  DictSection,
  readTermExtras,
  toLines,
} from '@/components/dictionary-sections';
import { resolveCover } from '@/data/cover-images';
import { getTerm } from '@/data/dictionary';
import { colors, fontSize, spacing } from '@/theme/tokens';

export default function DictionaryTermScreen() {
  const router = useRouter();
  const { term: termParam } = useLocalSearchParams<{ term: string }>();
  const term = getTerm(termParam);

  if (!term) {
    return (
      <Screen variant="surface">
        <AppHeader title="Chi tiết thuật ngữ" showBack compact />
        <EmptyState
          icon="search-off"
          title="Không tìm thấy thuật ngữ"
          message={`Từ điển chưa có mục "${termParam ?? ''}".`}
        />
      </Screen>
    );
  }

  const extras = readTermExtras(term);
  const symptoms = term.symptoms ?? [];
  const diagnosis = term.diagnosis ?? [];
  const causes = term.causes ?? [];
  const treatment = toLines(term.treatment);

  return (
    <Screen variant="surface">
      <AppHeader title="Chi tiết thuật ngữ" showBack compact />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{term.term}</Text>
          {term.pronunciation ? (
            <View style={styles.pronunciationRow}>
              <MaterialIcons name="volume-up" size={14} color={colors.primaryLight} />
              <Text style={styles.pronunciation}>{term.pronunciation}</Text>
            </View>
          ) : null}
        </View>

        {term.definition ? <DictCardSection title="Định nghĩa" body={term.definition} /> : null}

        {extras.image ? (
          <DictIllustration
            source={resolveCover(extras.image)}
            caption={extras.caption ?? 'Sơ đồ minh họa.'}
          />
        ) : null}

        {symptoms.length > 0 ? (
          <DictSection title="Triệu chứng">
            <DictBulletList items={symptoms} />
          </DictSection>
        ) : null}

        {diagnosis.length > 0 ? (
          <DictSection title="Chẩn đoán">
            <DictDiagnosisList items={diagnosis} />
          </DictSection>
        ) : null}

        {causes.length > 0 ? (
          <DictSection title="Nguyên nhân">
            <DictBulletList items={causes} />
          </DictSection>
        ) : null}

        {extras.prevention.length > 0 ? (
          <DictSection title="Phòng ngừa">
            <DictBulletList items={extras.prevention} />
          </DictSection>
        ) : null}

        {treatment.length > 0 ? (
          <DictSection title="Điều trị">
            {treatment.length === 1 ? (
              <Text style={styles.paragraph}>{treatment[0]}</Text>
            ) : (
              <DictBulletList items={treatment} />
            )}
          </DictSection>
        ) : null}

        {term.note ? (
          <DictSection title="Ghi chú">
            <Text style={styles.paragraph}>{term.note}</Text>
          </DictSection>
        ) : null}

        {extras.relatedDoc ? (
          <DictSection title="Tài liệu liên quan">
            <DictRelatedDoc
              title={extras.relatedDoc.title}
              chapter={extras.relatedDoc.chapter}
              onPress={() =>
                router.push({ pathname: '/book/[id]', params: { id: extras.relatedDoc!.bookId } })
              }
            />
          </DictSection>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.xl },
  hero: { gap: spacing.sm, paddingTop: spacing.sm },
  heroTitle: { fontSize: fontSize.h2, fontWeight: '900', color: colors.slate900, lineHeight: 30 },
  pronunciationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pronunciation: { fontSize: fontSize.sm, fontWeight: '800', color: colors.primaryLight },
  paragraph: { fontSize: fontSize.lg, color: colors.slate700, lineHeight: 21 },
});
