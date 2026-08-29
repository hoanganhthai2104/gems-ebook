/**
 * Presentation pieces for the dictionary term detail screen, mirroring the
 * section stack in the web's #view-dict-term (Định nghĩa / Triệu chứng /
 * Chẩn đoán / Nguyên nhân / Phòng ngừa / Điều trị / Tài liệu liên quan).
 *
 * dictionary.json carries a few fields that DictionaryTerm does not model
 * (prevention, image, caption, relatedDoc) and stores `treatment` as a single
 * string, so both shapes are read defensively here.
 */
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { DiagnosisEntry, DictionaryTerm } from '@/data/types';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export interface DictionaryTermExtras {
  prevention: string[];
  image?: string;
  caption?: string;
  relatedDoc?: { title: string; chapter: string; bookId: string };
}

/** Normalises a value that may be a string, a string list, or missing. */
export function toLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
}

/** Reads the fields dictionary.json ships beyond the DictionaryTerm contract. */
export function readTermExtras(term: DictionaryTerm): DictionaryTermExtras {
  const raw = term as unknown as Record<string, unknown>;
  const related = raw.relatedDoc as Record<string, unknown> | undefined;

  return {
    prevention: toLines(raw.prevention),
    image: typeof raw.image === 'string' ? raw.image : undefined,
    caption: typeof raw.caption === 'string' ? raw.caption : undefined,
    relatedDoc:
      related && typeof related.title === 'string' && typeof related.bookId === 'string'
        ? {
            title: related.title,
            chapter: typeof related.chapter === 'string' ? related.chapter : '',
            bookId: related.bookId,
          }
        : undefined,
  };
}

/**
 * Short summary line used on the dictionary index cards.
 * No entry in dictionary.json carries a `definition`, so the fallback order
 * runs from most to least descriptive of the term itself - a symptom or cause
 * characterises it, whereas leading with treatment reads as if the card were
 * defining the term by its therapy.
 */
export function termPreview(term: DictionaryTerm): string {
  const candidates = [
    term.definition,
    ...(term.symptoms ?? []),
    ...(term.causes ?? []),
    ...toLines(term.treatment),
  ];
  return candidates.find((value) => typeof value === 'string' && value.trim().length > 0) ?? '';
}

export function DictSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function DictCardSection({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{body}</Text>
    </View>
  );
}

export function DictBulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View key={`${index}-${item.slice(0, 12)}`} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function DictDiagnosisList({ items }: { items: DiagnosisEntry[] }) {
  return (
    <View style={styles.diagnosisList}>
      {items.map((entry, index) => (
        <View key={`${index}-${entry.label}`} style={styles.diagnosisCard}>
          <Text style={styles.diagnosisLabel}>{entry.label}</Text>
          <Text style={styles.diagnosisDesc}>{entry.desc}</Text>
        </View>
      ))}
    </View>
  );
}

export function DictIllustration({
  source,
  caption,
}: {
  source: ImageSourcePropType;
  caption: string;
}) {
  return (
    <View style={styles.illustration}>
      <Image source={source} style={styles.illustrationImage} contentFit="cover" transition={150} />
      <View style={styles.illustrationCaption}>
        <Text style={styles.illustrationCaptionText}>{caption}</Text>
      </View>
    </View>
  );
}

interface DictRelatedDocProps {
  title: string;
  chapter: string;
  onPress: () => void;
}

export function DictRelatedDoc({ title, chapter, onPress }: DictRelatedDocProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.related, pressed && styles.pressed]}>
      <View style={styles.relatedThumb}>
        <MaterialIcons name="menu-book" size={20} color={colors.primaryLight} />
      </View>
      <View style={styles.relatedBody}>
        <Text numberOfLines={1} style={styles.relatedTitle}>
          {title}
        </Text>
        {chapter ? (
          <Text numberOfLines={1} style={styles.relatedChapter}>
            {chapter}
          </Text>
        ) : null}
      </View>
      <MaterialIcons name="chevron-right" size={18} color={colors.slate400} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '800', color: '#1E40AF' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  paragraph: { fontSize: fontSize.lg, color: colors.slate700, lineHeight: 21 },

  bulletList: { gap: 6 },
  bulletRow: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.sm },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.slate400,
    marginTop: 8,
  },
  bulletText: { flex: 1, fontSize: fontSize.lg, color: colors.slate700, lineHeight: 21 },

  diagnosisList: { gap: spacing.md },
  diagnosisCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.lg,
    gap: 3,
    ...shadow.card,
  },
  diagnosisLabel: { fontSize: fontSize.base, fontWeight: '900', color: colors.primaryDark },
  diagnosisDesc: { fontSize: fontSize.sm, color: colors.slate500, fontWeight: '600', lineHeight: 16 },

  illustration: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.white,
    ...shadow.card,
  },
  illustrationImage: { width: '100%', height: 180 },
  illustrationCaption: {
    backgroundColor: colors.slate50,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  illustrationCaptionText: {
    fontSize: fontSize.xs,
    color: colors.slate500,
    fontWeight: '700',
    textAlign: 'center',
  },

  related: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.lg,
    ...shadow.card,
  },
  relatedThumb: {
    width: 48,
    height: 62,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedBody: { flex: 1, gap: 3 },
  relatedTitle: { fontSize: fontSize.base, fontWeight: '800', color: colors.slate800 },
  relatedChapter: { fontSize: fontSize.xs, color: colors.slate500, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
