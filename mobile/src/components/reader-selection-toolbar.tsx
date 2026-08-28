/**
 * Floating selection toolbar - the native port of the web reader's
 * #selection-toolbar. Appears above the selected text with the highlight
 * swatches, the copy and note actions and a dictionary lookup.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fontSize, highlightColors, radius, spacing, type HighlightColorKey } from '@/theme/tokens';

const COLOR_KEYS: HighlightColorKey[] = ['yellow', 'green', 'blue', 'pink'];

interface ReaderSelectionToolbarProps {
  visible: boolean;
  /** Selection rect top inside the content area, in CSS pixels. */
  anchorTop: number;
  contentHeight: number;
  onHighlight: (color: HighlightColorKey) => void;
  onCopy: () => void;
  onNote: () => void;
  onLookup: () => void;
}

export function ReaderSelectionToolbar({
  visible,
  anchorTop,
  contentHeight,
  onHighlight,
  onCopy,
  onNote,
  onLookup,
}: ReaderSelectionToolbarProps) {
  if (!visible) return null;

  const top = Math.min(Math.max(anchorTop - 58, spacing.sm), Math.max(spacing.sm, contentHeight - 70));

  return (
    <View style={[styles.toolbar, { top }]} pointerEvents="box-none">
      <View style={styles.pill}>
        <View style={styles.swatchGroup}>
          {COLOR_KEYS.map((key) => (
            <Pressable
              key={key}
              onPress={() => onHighlight(key)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: highlightColors[key].swatch },
                pressed && styles.pressed,
              ]}
            />
          ))}
        </View>
        <ToolbarAction icon="content-copy" label="Sao chép" onPress={onCopy} />
        <ToolbarAction icon="edit" label="Ghi chú" onPress={onNote} />
        <ToolbarAction icon="search" label="Tra cứu" onPress={onLookup} />
      </View>
    </View>
  );
}

function ToolbarAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={14} color="#FFFFFF" />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  swatchGroup: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: spacing.md,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(148, 163, 184, 0.5)',
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  action: { alignItems: 'center', gap: 2 },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },
  pressed: { opacity: 0.6 },
});
