/**
 * Pieces shared by every onboarding slide: the headline/paragraph block and
 * the mockup-card shell used by slides 2 and 3.
 */
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export interface SlideProps {
  /** Page width handed down by the carousel so each slide fills one page. */
  width: number;
}

interface SlideCopyProps {
  title: string;
  /** Second headline line, rendered in the brand blue like the web original. */
  highlight: string;
  body: string;
}

export function SlideCopy({ title, highlight, body }: SlideCopyProps) {
  return (
    <View style={slideStyles.copyBlock}>
      <Text style={slideStyles.slideTitle}>
        {title}
        {'\n'}
        <Text style={slideStyles.slideTitleAccent}>{highlight}</Text>
      </Text>
      <Text style={slideStyles.slideBody}>{body}</Text>
    </View>
  );
}

export const slideStyles = StyleSheet.create({
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  fillImage: { width: '100%', height: '100%' },

  copyBlock: { maxWidth: 320, alignItems: 'center', gap: spacing.sm },
  slideTitle: {
    fontSize: fontSize.h3,
    fontWeight: '900',
    color: colors.slate900,
    textAlign: 'center',
    lineHeight: 27,
  },
  slideTitleAccent: { color: colors.primary },
  slideBody: { fontSize: fontSize.base, color: colors.slate500, textAlign: 'center', lineHeight: 19 },

  demoWrap: { width: '100%', maxWidth: 300, marginBottom: spacing.xl, alignItems: 'center' },
  demoGlow: { position: 'absolute', top: -6, bottom: -6, left: -6, right: -6, borderRadius: radius.xxl },
  demoCard: {
    width: '100%',
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    padding: spacing.lg,
    ...shadow.card,
  },
});
