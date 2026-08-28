/**
 * Onboarding slide 3: smart annotations plus the one-tap medical glossary
 * popover (setDemoHighlightColor on web). Vietnamese copy is verbatim.
 */
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SlideCopy, slideStyles, type SlideProps } from '@/components/onboarding-slide-shared';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

type DemoHighlightKey = 'yellow' | 'blue' | 'green';

const DEMO_HIGHLIGHTS: Record<
  DemoHighlightKey,
  { swatch: string; ring: string; bg: string; fg: string; border: string }
> = {
  yellow: { swatch: '#FBBF24', ring: 'rgba(245,158,11,0.5)', bg: 'rgba(254,243,199,0.9)', fg: '#451A03', border: '#F59E0B' },
  blue: { swatch: '#38BDF8', ring: 'rgba(14,165,233,0.5)', bg: 'rgba(224,242,254,0.9)', fg: '#082F49', border: '#0EA5E9' },
  green: { swatch: '#34D399', ring: 'rgba(16,185,129,0.5)', bg: 'rgba(209,250,229,0.9)', fg: '#022C22', border: '#10B981' },
};

const DEMO_HIGHLIGHT_KEYS: DemoHighlightKey[] = ['yellow', 'blue', 'green'];

export function OnboardingSlideAnnotations({ width }: SlideProps) {
  const [highlight, setHighlight] = useState<DemoHighlightKey>('yellow');
  const palette = DEMO_HIGHLIGHTS[highlight];

  return (
    <View style={[slideStyles.slide, { width }]}>
      <View style={slideStyles.demoWrap}>
        <View style={[slideStyles.demoGlow, styles.annotationGlow]} />

        <View style={slideStyles.demoCard}>
          <View style={styles.toolbar}>
            <View style={styles.pens}>
              <Text style={styles.penLabel}>Màu bút:</Text>
              {DEMO_HIGHLIGHT_KEYS.map((key) => (
                <Pressable
                  key={key}
                  onPress={() => setHighlight(key)}
                  hitSlop={8}
                  style={[
                    styles.penDot,
                    { backgroundColor: DEMO_HIGHLIGHTS[key].swatch, borderColor: DEMO_HIGHLIGHTS[key].ring },
                    highlight === key && styles.penDotActive,
                  ]}
                />
              ))}
            </View>
            <View style={styles.glossaryTag}>
              <MaterialIcons name="translate" size={10} color={colors.primary} />
              <Text style={styles.glossaryTagText}>Tra từ điển 1-chạm</Text>
            </View>
          </View>

          <View style={[styles.snippet, { backgroundColor: palette.bg, borderLeftColor: palette.border }]}>
            <Text style={[styles.snippetText, { color: palette.fg }]}>
              &quot;Chỉ định can thiệp mạch vành qua da (PCI) khẩn cấp trong vòng 90 phút từ lúc tiếp cận y tế...&quot;
            </Text>
          </View>

          <View style={styles.popover}>
            <View style={styles.popoverHeader}>
              <Text style={styles.term}>PCI - Can Thiệp Mạch Vành Qua Da</Text>
              <Text style={styles.phonetic}>[ˌpɜː.kjuːˈteɪ.ni.əs]</Text>
            </View>
            <Text style={styles.definition}>
              Thủ thuật nong và đặt stent tái thông dòng chảy mạch vành bị tắc nghẽn cấp.
            </Text>
          </View>
        </View>
      </View>

      <SlideCopy
        title="Ghi Chú Thông Minh."
        highlight="Tra Cứu Thuật Ngữ 1-Chạm."
        body="Tự động dịch thuật ngữ Y khoa khi bôi đen, đính kèm ghi chú lâm sàng và đồng bộ an toàn dữ liệu trên đám mây."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  annotationGlow: { backgroundColor: 'rgba(245,158,11,0.08)' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  pens: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  penLabel: { fontSize: fontSize.xxs, fontWeight: '700', color: colors.slate400, textTransform: 'uppercase' },
  penDot: { width: 14, height: 14, borderRadius: radius.pill, borderWidth: 1 },
  penDotActive: { transform: [{ scale: 1.2 }] },
  glossaryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  glossaryTagText: { fontSize: 8.5, fontWeight: '700', color: colors.primary },
  snippet: { padding: 10, borderRadius: radius.md, borderLeftWidth: 3 },
  snippetText: { fontSize: 10.5, lineHeight: 16, fontWeight: '500' },
  popover: {
    marginTop: 10,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.slate900,
    borderWidth: 1,
    borderColor: '#1E293B',
    ...shadow.card,
  },
  popoverHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  term: { flexShrink: 1, fontSize: fontSize.xs, fontWeight: '700', color: '#38BDF8' },
  phonetic: { fontSize: 8.5, color: colors.slate400 },
  definition: { marginTop: 2, fontSize: fontSize.xxs, color: colors.slate300, lineHeight: 13 },
});
