/**
 * Screen scaffolding primitives: the mesh gradient background, headers and
 * section titles reused by every top-level screen.
 */
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSize, meshGradient, radius, spacing } from '@/theme/tokens';

interface ScreenProps {
  children: ReactNode;
  /** Mesh gradient matches the web `mesh-bg` class; plain uses a flat surface. */
  variant?: 'mesh' | 'plain' | 'surface';
  /** Apply the top safe-area inset as padding. Disable for custom hero headers. */
  edgeTop?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Screen({ children, variant = 'mesh', edgeTop = true, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = edgeTop ? insets.top : 0;

  if (variant === 'mesh') {
    return (
      <LinearGradient
        colors={[...meshGradient.colors]}
        start={meshGradient.start}
        end={meshGradient.end}
        style={[styles.flex, { paddingTop }, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        { paddingTop, backgroundColor: variant === 'plain' ? colors.background : colors.surface },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Shows a back chevron that pops the navigation stack. */
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  /** Compact headers are used inside modals and detail screens. */
  compact?: boolean;
}

export function AppHeader({ title, subtitle, showBack, onBack, right, compact }: AppHeaderProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      {showBack ? (
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios-new" size={18} color={colors.slate700} />
        </Pressable>
      ) : null}
      <View style={styles.headerTitleBlock}>
        <Text numberOfLines={1} style={[styles.headerTitle, compact && styles.headerTitleCompact]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.headerSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.headerRight}>{right}</View> : null}
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.flexShrink}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message?: string;
}

export function EmptyState({ icon = 'inbox', title, message }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <MaterialIcons name={icon} size={28} color={colors.slate400} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerCompact: { paddingVertical: spacing.sm },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleBlock: { flex: 1 },
  headerTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.slate800 },
  headerTitleCompact: { fontSize: fontSize.xl },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.slate400, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.slate800 },
  sectionSubtitle: { fontSize: fontSize.sm, color: colors.slate400, marginTop: 2 },
  sectionAction: { fontSize: fontSize.base, fontWeight: '700', color: colors.primary },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl * 1.5, gap: spacing.sm },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.slate600 },
  emptyMessage: {
    fontSize: fontSize.base,
    color: colors.slate400,
    textAlign: 'center',
    paddingHorizontal: spacing.xxxl,
  },
});
