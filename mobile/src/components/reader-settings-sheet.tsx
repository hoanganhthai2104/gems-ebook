/**
 * Reader settings sheet - the port of #kindle-settings-menu: page background
 * (Trắng / Sepia / Tối), typeface (Sans / Serif) and font size stepping around
 * the web's 18px default.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ReaderBottomSheet } from '@/components/reader-bottom-sheet';
import { fontPxFor } from '@/components/reader-page-document';
import type { ReaderFontFamily } from '@/store/app-store';
import {
  colors,
  fontSize,
  radius,
  readerThemes,
  spacing,
  type ReaderTheme,
  type ReaderThemeKey,
} from '@/theme/tokens';

const THEME_KEYS: ReaderThemeKey[] = ['white', 'sepia', 'dark'];
/** Button copy verbatim from the web settings menu. */
const FONT_FAMILY_OPTIONS: { key: ReaderFontFamily; label: string }[] = [
  { key: 'sans', label: 'Sans (Inter)' },
  { key: 'serif', label: 'Serif (Playfair)' },
];
const FONT_STEP = 0.1;
const MIN_SCALE = 0.8;
const MAX_SCALE = 1.6;

interface ReaderSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  theme: ReaderTheme;
  activeThemeKey: ReaderThemeKey;
  fontScale: number;
  fontFamily: ReaderFontFamily;
  onSelectTheme: (key: ReaderThemeKey) => void;
  onChangeFontScale: (scale: number) => void;
  onSelectFontFamily: (family: ReaderFontFamily) => void;
}

export function ReaderSettingsSheet({
  visible,
  onClose,
  theme,
  activeThemeKey,
  fontScale,
  fontFamily,
  onSelectTheme,
  onChangeFontScale,
  onSelectFontFamily,
}: ReaderSettingsSheetProps) {
  const step = (delta: number) => {
    const next = Math.round((fontScale + delta * FONT_STEP) * 10) / 10;
    onChangeFontScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)));
  };

  return (
    <ReaderBottomSheet
      visible={visible}
      onClose={onClose}
      title="Cài đặt"
      theme={theme}
      maxHeightRatio={0.65}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.muted }]}>Màu nền trang</Text>
        <View style={styles.themeRow}>
          {THEME_KEYS.map((key) => {
            const option = readerThemes[key];
            const active = key === activeThemeKey;
            return (
              <Pressable
                key={key}
                onPress={() => onSelectTheme(key)}
                style={({ pressed }) => [
                  styles.themeButton,
                  {
                    backgroundColor: option.background,
                    borderColor: active ? '#2563EB' : option.border,
                    borderWidth: active ? 2 : 1,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.themeLabel, { color: option.text }]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.muted }]}>Kiểu chữ</Text>
        <View style={styles.themeRow}>
          {FONT_FAMILY_OPTIONS.map((option) => {
            const active = option.key === fontFamily;
            return (
              <Pressable
                key={option.key}
                onPress={() => onSelectFontFamily(option.key)}
                style={({ pressed }) => [
                  styles.themeButton,
                  {
                    backgroundColor: active ? colors.primary : theme.background,
                    borderColor: active ? colors.primary : theme.border,
                    borderWidth: 1,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.themeLabel,
                    option.key === 'serif' && styles.serifLabel,
                    { color: active ? colors.white : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.muted }]}>Cỡ chữ</Text>
        <View style={[styles.stepper, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Pressable
            onPress={() => step(-1)}
            disabled={fontScale <= MIN_SCALE}
            style={({ pressed }) => [
              styles.stepButton,
              { backgroundColor: theme.chrome, borderColor: theme.border },
              fontScale <= MIN_SCALE && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.stepSymbol, { color: theme.text }]}>-</Text>
          </Pressable>
          <Text style={[styles.stepValue, { color: theme.text }]}>{fontPxFor(fontScale)}px</Text>
          <Pressable
            onPress={() => step(1)}
            disabled={fontScale >= MAX_SCALE}
            style={({ pressed }) => [
              styles.stepButton,
              { backgroundColor: theme.chrome, borderColor: theme.border },
              fontScale >= MAX_SCALE && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.stepSymbol, { color: theme.text }]}>+</Text>
          </Pressable>
        </View>
      </View>
    </ReaderBottomSheet>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm, marginBottom: spacing.xl },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  themeRow: { flexDirection: 'row', gap: spacing.sm },
  themeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  themeLabel: { fontSize: fontSize.base, fontWeight: '800' },
  serifLabel: { fontFamily: 'serif' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSymbol: { fontSize: fontSize.xl, fontWeight: '900', lineHeight: 20 },
  stepValue: { fontSize: fontSize.md, fontWeight: '800' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
});
