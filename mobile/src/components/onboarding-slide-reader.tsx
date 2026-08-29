/**
 * Onboarding slide 2: the mini e-reader mockup with a live reading-theme
 * switcher (setDemoReaderTheme on web). Vietnamese copy is verbatim.
 */
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SlideCopy, slideStyles, type SlideProps } from '@/components/onboarding-slide-shared';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

type DemoThemeKey = 'light' | 'sepia' | 'dark';

const DEMO_THEMES: Record<
  DemoThemeKey,
  { card: string; border: string; header: string; text: string; ring: string }
> = {
  light: { card: '#FFFFFF', border: 'rgba(226,232,240,0.9)', header: '#64748B', text: '#1E293B', ring: colors.primary },
  sepia: { card: '#FBF0D9', border: 'rgba(217,119,6,0.3)', header: '#8C6D48', text: '#45321F', ring: '#D97706' },
  dark: { card: '#0F172A', border: 'rgba(51,65,85,0.9)', header: '#94A3B8', text: '#E2E8F0', ring: '#38BDF8' },
};

const DEMO_THEME_BUTTONS: { key: DemoThemeKey; label: string; bg: string; fg: string; border: string }[] = [
  { key: 'light', label: '☀️ Sáng', bg: colors.white, fg: colors.slate800, border: colors.slate200 },
  { key: 'sepia', label: '📜 Sepia', bg: '#FBF0D9', fg: '#78350F', border: '#FCD34D' },
  { key: 'dark', label: '🌙 Đêm', bg: colors.slate900, fg: colors.slate100, border: colors.slate700 },
];

export function OnboardingSlideReader({ width }: SlideProps) {
  const [theme, setTheme] = useState<DemoThemeKey>('light');
  const palette = DEMO_THEMES[theme];

  return (
    <View style={[slideStyles.slide, { width }]}>
      <View style={slideStyles.demoWrap}>
        <View style={[slideStyles.demoGlow, styles.readerGlow]} />

        <View style={[slideStyles.demoCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="format-size" size={13} color={palette.header} />
              <Text style={[styles.headerText, { color: palette.header }]}>Sinh Lý Não Bộ</Text>
            </View>
            <Text style={[styles.headerText, { color: palette.header }]}>Trang 88</Text>
          </View>

          <Text style={[styles.paragraph, { color: palette.text }]}>
            &quot;Cơ chế tự điều hòa lưu lượng tuần hoàn não duy trì ổn định trong khoảng huyết áp trung bình từ 60 đến
            140 mmHg nhằm bảo vệ nhu mô...&quot;
          </Text>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Chế độ đọc:</Text>
            <View style={styles.themeRow}>
              {DEMO_THEME_BUTTONS.map((button) => {
                const active = theme === button.key;
                return (
                  <Pressable
                    key={button.key}
                    onPress={() => setTheme(button.key)}
                    style={[
                      styles.themeButton,
                      { backgroundColor: button.bg, borderColor: active ? palette.ring : button.border },
                      active ? styles.themeButtonActive : styles.themeButtonIdle,
                    ]}
                  >
                    <Text style={[styles.themeLabel, { color: button.fg }]}>{button.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <SlideCopy
        title="Đọc Sách Chuyên Sâu."
        highlight="Chống Mỏi Mắt Tuyệt Đối."
        body="Tùy biến typography, dãn dòng chuẩn mực và bộ lọc nền Sepia/OLED bảo vệ thị lực trong các ca trực đêm kéo dài."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  readerGlow: { backgroundColor: 'rgba(37,99,235,0.08)' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226,232,240,0.6)',
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerText: { fontSize: fontSize.xxs, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  paragraph: { fontSize: fontSize.sm, lineHeight: 17 },
  footerRow: {
    marginTop: spacing.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226,232,240,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: fontSize.xxs,
    fontWeight: '700',
    color: colors.slate400,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  themeButton: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm, borderWidth: 1 },
  themeButtonActive: { borderWidth: 2, opacity: 1, transform: [{ scale: 1.05 }] },
  themeButtonIdle: { opacity: 0.7 },
  themeLabel: { fontSize: 9.5, fontWeight: '700' },
});
