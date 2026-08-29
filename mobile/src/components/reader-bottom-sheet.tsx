/**
 * Shared bottom-sheet shell for the reader's overlays (table of contents,
 * settings, notes). Ports the web app's rounded drawer with the drag handle.
 */
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { fontSize, radius, spacing } from '@/theme/tokens';
import type { ReaderTheme } from '@/theme/tokens';

interface ReaderBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  theme: ReaderTheme;
  children: ReactNode;
  /** Caps the sheet height as a fraction of the screen. */
  maxHeightRatio?: number;
}

export function ReaderBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  theme,
  children,
  maxHeightRatio = 0.78,
}: ReaderBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={[
              styles.sheet,
              {
                backgroundColor: theme.chrome,
                borderColor: theme.border,
                maxHeight: Math.round(height * maxHeightRatio),
                paddingBottom: Math.max(insets.bottom, spacing.lg),
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                {subtitle ? (
                  <Text numberOfLines={1} style={[styles.subtitle, { color: theme.muted }]}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                style={[styles.closeButton, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                <MaterialIcons name="close" size={16} color={theme.muted} />
              </Pressable>
            </View>
            {children}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: radius.pill,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerText: { flex: 1 },
  title: { fontSize: fontSize.xxl, fontWeight: '900' },
  subtitle: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
