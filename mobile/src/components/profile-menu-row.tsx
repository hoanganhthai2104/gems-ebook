/**
 * Bento-style menu rows on the Profile tab (port of the web `glass-card`
 * buttons) plus the collapsible book list that replaces the web's
 * `view-profile-sublist` sub-screen.
 */
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface ProfileMenuRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  /** Renders the error-tinted variant used by "Đăng xuất". */
  danger?: boolean;
  /** When defined, shows an expand chevron reflecting the open state. */
  expanded?: boolean;
}

export function ProfileMenuRow({
  icon,
  title,
  subtitle,
  onPress,
  danger,
  expanded,
}: ProfileMenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, danger && styles.rowDanger, pressed && styles.pressed]}
    >
      <View style={[styles.iconCircle, danger && styles.iconCircleDanger]}>
        <MaterialIcons name={icon} size={20} color={danger ? colors.rose : colors.primary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {expanded === undefined ? null : (
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={20}
          color={colors.slate400}
        />
      )}
    </Pressable>
  );
}

/** Indented container for the book list revealed under an expanded menu row. */
export function ProfileSublist({ children }: { children: ReactNode }) {
  return <View style={styles.sublist}>{children}</View>;
}

export function ProfileSublistEmpty() {
  return (
    <View style={styles.sublistEmpty}>
      <MaterialIcons name="folder-open" size={32} color={colors.slate400} />
      <Text style={styles.sublistEmptyText}>Chưa có dữ liệu sách trong mục này.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.slate100,
    ...shadow.card,
  },
  rowDanger: { backgroundColor: colors.roseSoft, borderColor: '#FECDD3' },
  pressed: { opacity: 0.8 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoftBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDanger: { backgroundColor: colors.white, borderColor: colors.white },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.slate800 },
  rowTitleDanger: { color: colors.rose },
  rowSubtitle: { fontSize: fontSize.base, color: colors.slate500, marginTop: 2 },

  sublist: { gap: spacing.md, paddingLeft: spacing.md, marginTop: -spacing.xs },
  sublistEmpty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  sublistEmptyText: { fontSize: fontSize.base, color: colors.slate500 },
});
