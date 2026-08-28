/**
 * Native reader chrome: the top header bar and the bottom control bar with the
 * progress indicator and the four-up navigation grid (MỤC LỤC / CÀI ĐẶT /
 * TẬP TRUNG / AUDIO) ported from the web reader's #reader-header / #reader-footer.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressBar } from '@/components/ui';
import { fontSize, radius, spacing, type ReaderTheme } from '@/theme/tokens';

interface ReaderHeaderProps {
  theme: ReaderTheme;
  bookTitle: string;
  chapterMeta: string;
  bookmarked: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onOpenAnnotations: () => void;
  paddingTop: number;
}

export function ReaderHeader({
  theme,
  bookTitle,
  chapterMeta,
  bookmarked,
  onBack,
  onToggleBookmark,
  onOpenAnnotations,
  paddingTop,
}: ReaderHeaderProps) {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.chrome, borderBottomColor: theme.border, paddingTop: paddingTop + spacing.sm },
      ]}
    >
      <Pressable onPress={onBack} hitSlop={10} style={styles.headerIcon}>
        <MaterialIcons name="arrow-back-ios-new" size={18} color={theme.text} />
      </Pressable>
      <View style={styles.headerTitles}>
        <Text numberOfLines={1} style={[styles.bookTitle, { color: theme.text }]}>
          {bookTitle}
        </Text>
        <Text numberOfLines={1} style={[styles.chapterMeta, { color: theme.muted }]}>
          {chapterMeta}
        </Text>
      </View>
      <Pressable onPress={onOpenAnnotations} hitSlop={10} style={styles.headerIcon}>
        <MaterialIcons name="sticky-note-2" size={20} color={theme.muted} />
      </Pressable>
      <Pressable onPress={onToggleBookmark} hitSlop={10} style={styles.headerIcon}>
        <MaterialIcons
          name={bookmarked ? 'bookmark' : 'bookmark-border'}
          size={22}
          color={bookmarked ? '#2563EB' : theme.muted}
        />
      </Pressable>
    </View>
  );
}

interface ReaderFooterProps {
  theme: ReaderTheme;
  /** 0..1 across the whole book. */
  progress: number;
  pageLabel: string;
  focusMode: boolean;
  onOpenToc: () => void;
  onOpenSettings: () => void;
  onToggleFocus: () => void;
  onOpenAudio: () => void;
  paddingBottom: number;
}

export function ReaderFooter({
  theme,
  progress,
  pageLabel,
  focusMode,
  onOpenToc,
  onOpenSettings,
  onToggleFocus,
  onOpenAudio,
  paddingBottom,
}: ReaderFooterProps) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <View
      style={[
        styles.footer,
        { backgroundColor: theme.chrome, borderTopColor: theme.border, paddingBottom: paddingBottom + spacing.sm },
      ]}
    >
      <View style={[styles.progressRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.progressLabel, { color: theme.muted }]}>{percent}%</Text>
        <ProgressBar
          progress={progress}
          color="#1D4ED8"
          height={4}
          trackColor={theme.border}
          style={styles.progressBar}
        />
        <Text style={[styles.progressLabel, { color: theme.muted }]}>{pageLabel}</Text>
      </View>
      <View style={styles.navRow}>
        <ReaderNavButton theme={theme} icon="format-list-bulleted" label="MỤC LỤC" onPress={onOpenToc} />
        <ReaderNavButton theme={theme} icon="settings" label="CÀI ĐẶT" onPress={onOpenSettings} />
        <ReaderNavButton
          theme={theme}
          icon={focusMode ? 'visibility-off' : 'visibility'}
          label="TẬP TRUNG"
          active={focusMode}
          onPress={onToggleFocus}
        />
        <ReaderNavButton theme={theme} icon="headphones" label="AUDIO" onPress={onOpenAudio} />
      </View>
    </View>
  );
}

interface ReaderNavButtonProps {
  theme: ReaderTheme;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
}

function ReaderNavButton({ theme, icon, label, onPress, active }: ReaderNavButtonProps) {
  const tint = active ? '#1D4ED8' : theme.muted;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={24} color={tint} />
      <Text style={[styles.navLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

/** Small floating chevrons that mirror #flip-prev-btn / #flip-next-btn. */
interface ReaderFlipButtonProps {
  theme: ReaderTheme;
  direction: 'prev' | 'next';
  disabled?: boolean;
  onPress: () => void;
}

export function ReaderFlipButton({ theme, direction, disabled, onPress }: ReaderFlipButtonProps) {
  if (disabled) return null;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.flipButton,
        direction === 'prev' ? styles.flipLeft : styles.flipRight,
        { backgroundColor: theme.chrome, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={direction === 'prev' ? 'chevron-left' : 'chevron-right'}
        size={22}
        color={theme.muted}
      />
    </Pressable>
  );
}

/** Floating pill shown while focus mode hides the chrome. */
export function ReaderFocusExitButton({ theme, onPress, top }: { theme: ReaderTheme; onPress: () => void; top: number }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.focusExit,
        { top: top + spacing.sm, backgroundColor: theme.chrome, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons name="visibility-off" size={18} color={theme.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerIcon: { width: 30, alignItems: 'center', justifyContent: 'center' },
  headerTitles: { flex: 1, minWidth: 0 },
  bookTitle: { fontSize: fontSize.md, fontWeight: '700' },
  chapterMeta: {
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },

  footer: { borderTopWidth: StyleSheet.hairlineWidth },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  progressBar: { flex: 1 },
  progressLabel: { fontSize: fontSize.xs, fontWeight: '700' },
  navRow: { flexDirection: 'row', paddingTop: spacing.sm },
  navButton: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: spacing.sm },
  navLabel: { fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1 },
  pressed: { opacity: 0.6 },

  flipButton: {
    position: 'absolute',
    top: '46%',
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  flipLeft: { left: spacing.sm },
  flipRight: { right: spacing.sm },

  focusExit: {
    position: 'absolute',
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
});
