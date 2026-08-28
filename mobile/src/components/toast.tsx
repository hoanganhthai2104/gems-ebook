/**
 * Lightweight toast used across the app.
 * Port of the web app's showToast() helper: a short-lived pill anchored to the
 * bottom of the screen, auto-dismissed after a few seconds.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

export type ToastTone = 'info' | 'success' | 'warning';

export interface ToastMessage {
  text: string;
  tone: ToastTone;
}

const TOAST_DURATION_MS = 2600;

const TONE_STYLES: Record<ToastTone, { bg: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  info: { bg: colors.slate800, icon: 'info' },
  success: { bg: '#047857', icon: 'check-circle' },
  warning: { bg: '#B45309', icon: 'warning' },
};

/** Returns the current toast plus a `show(text, tone)` dispatcher. */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(
    (text: string, tone: ToastTone = 'info') => {
      clearTimer();
      setToast({ text, tone });
      timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  return { toast, show };
}

export function Toast({ toast, bottom = spacing.xxxl }: { toast: ToastMessage | null; bottom?: number }) {
  if (!toast) return null;
  const tone = TONE_STYLES[toast.tone];
  return (
    <View pointerEvents="none" style={[styles.wrapper, { bottom }]}>
      <View style={[styles.toast, { backgroundColor: tone.bg }]}>
        <MaterialIcons name={tone.icon} size={16} color={colors.white} />
        <Text style={styles.text}>{toast.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: spacing.lg, right: spacing.lg, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    maxWidth: '100%',
    ...shadow.raised,
  },
  text: { flexShrink: 1, color: colors.white, fontSize: fontSize.base, fontWeight: '700', lineHeight: 17 },
});
