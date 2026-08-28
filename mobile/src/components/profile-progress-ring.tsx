/**
 * Circular goal gauge for the reading-habit screen.
 * react-native-svg is not part of this project, so the web's SVG ring is
 * rebuilt from two clipped, rotated half-rings (the classic RN technique).
 * The blue -> teal gradient of the web version is approximated by giving each
 * half of the ring its own colour.
 */
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

interface ProgressRingProps {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  startColor?: string;
  endColor?: string;
  children?: ReactNode;
}

export function ProgressRing({
  progress,
  size = 128,
  strokeWidth = 10,
  trackColor = colors.slate100,
  startColor = colors.primary,
  endColor = colors.accent,
  children,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const degrees = clamped * 360;
  const half = size / 2;

  const ringBase = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: strokeWidth,
  };

  // A square view with only its top+right border coloured draws a 180° arc that
  // starts at the 45° mark; rotating by -135° moves that start to 12 o'clock.
  const firstHalfRotation = `${Math.min(degrees, 180) - 135}deg`;
  const secondHalfRotation = `${degrees - 135}deg`;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[ringBase, { borderColor: trackColor }]} />

      {/* Right half of the ring: 0% -> 50% */}
      <View style={[styles.clip, { left: half, width: half, height: size }]}>
        <View
          style={[
            ringBase,
            styles.arc,
            {
              left: -half,
              borderTopColor: startColor,
              borderRightColor: startColor,
              transform: [{ rotate: firstHalfRotation }],
            },
          ]}
        />
      </View>

      {/* Left half of the ring: only drawn once the sweep passes 50% */}
      {degrees > 180 ? (
        <View style={[styles.clip, { left: 0, width: half, height: size }]}>
          <View
            style={[
              ringBase,
              styles.arc,
              {
                left: 0,
                borderTopColor: endColor,
                borderRightColor: endColor,
                transform: [{ rotate: secondHalfRotation }],
              },
            ]}
          />
        </View>
      ) : null}

      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { position: 'absolute', top: 0, overflow: 'hidden' },
  arc: { top: 0, borderColor: 'transparent' },
  center: { alignItems: 'center', justifyContent: 'center' },
});
