/**
 * Small shared UI primitives: buttons, chips, badges, stat pills and cards.
 */
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  fullWidth,
  style,
}: ButtonProps) {
  const palette = BUTTON_PALETTE[variant];
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        fullWidth && styles.fullWidth,
        pressed && !isInactive && styles.pressed,
        isInactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.text} />
      ) : (
        <>
          {icon ? <MaterialIcons name={icon} size={17} color={palette.text} /> : null}
          <Text style={[styles.buttonLabel, { color: palette.text }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const BUTTON_PALETTE: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.primary, text: colors.white, border: colors.primary },
  secondary: { bg: colors.white, text: colors.slate700, border: colors.border },
  ghost: { bg: 'transparent', text: colors.primary, border: 'transparent' },
  danger: { bg: colors.rose, text: colors.white, border: colors.rose },
};

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export function Chip({ label, active, onPress, icon }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      {icon ? (
        <MaterialIcons name={icon} size={14} color={active ? colors.white : colors.slate500} />
      ) : null}
      <Text numberOfLines={1} style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

interface BadgeProps {
  label: string;
  tone?: 'blue' | 'amber' | 'emerald' | 'rose' | 'slate' | 'violet';
  style?: StyleProp<ViewStyle>;
}

const BADGE_TONES = {
  blue: { bg: colors.primarySoft, fg: colors.primary },
  amber: { bg: colors.amberSoft, fg: '#B45309' },
  emerald: { bg: colors.emeraldSoft, fg: '#047857' },
  rose: { bg: colors.roseSoft, fg: '#BE123C' },
  slate: { bg: colors.slate100, fg: colors.slate600 },
  violet: { bg: colors.violetSoft, fg: '#6D28D9' },
} as const;

export function Badge({ label, tone = 'blue', style }: BadgeProps) {
  const palette = BADGE_TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.badgeText, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

interface StatPillProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string | number;
  label: string;
  tint?: string;
}

export function StatPill({ icon, value, label, tint = colors.primary }: StatPillProps) {
  return (
    <View style={styles.statPill}>
      <MaterialIcons name={icon} size={18} color={tint} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  color?: string;
  height?: number;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progress,
  color = colors.primary,
  height = 6,
  trackColor = colors.slate200,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: trackColor, overflow: 'hidden' }, style]}>
      <View style={{ width: `${clamped * 100}%`, height: '100%', backgroundColor: color }} />
    </View>
  );
}

interface IconButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  size?: number;
  color?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  onPress,
  size = 20,
  color = colors.slate700,
  background = colors.white,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: background },
        pressed && styles.pressed,
        style,
      ]}
    >
      <MaterialIcons name={icon} size={size} color={color} />
    </Pressable>
  );
}

export const textStyles = StyleSheet.create({
  h1: { fontSize: fontSize.h1, fontWeight: '900', color: colors.slate900 },
  h2: { fontSize: fontSize.h2, fontWeight: '800', color: colors.slate900 },
  h3: { fontSize: fontSize.h3, fontWeight: '800', color: colors.slate800 },
  body: { fontSize: fontSize.lg, color: colors.slate600, lineHeight: 21 },
  small: { fontSize: fontSize.base, color: colors.slate500 },
  muted: { fontSize: fontSize.sm, color: colors.slate400 },
} as Record<string, TextStyle>);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  buttonLabel: { fontSize: fontSize.lg, fontWeight: '800' },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: colors.white, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipLabel: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate500 },
  chipLabelActive: { color: colors.white },

  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: fontSize.xs, fontWeight: '800' },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: spacing.lg,
    ...shadow.card,
  },

  statPill: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  statValue: { fontSize: fontSize.xl, fontWeight: '900', color: colors.slate800 },
  statLabel: { fontSize: fontSize.xs, color: colors.slate400, fontWeight: '600' },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
