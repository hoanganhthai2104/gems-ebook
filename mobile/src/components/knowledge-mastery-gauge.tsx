/**
 * Donut mastery gauge shared by the knowledge screens.
 * Built from two clipped, rotated ring halves so no SVG dependency is needed.
 */
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize } from '@/theme/tokens';

const GAUGE_SIZE = 96;
const GAUGE_THICKNESS = 8;

interface MasteryGaugeProps {
  /** 0..100 */
  percent: number;
}

export function MasteryGauge({ percent }: MasteryGaugeProps) {
  const degrees = Math.min(100, Math.max(0, percent)) * 3.6;
  const firstRotation = 225 + Math.min(degrees, 180);
  const secondRotation = 225 + Math.max(degrees, 180);

  return (
    <View style={styles.gauge}>
      <View style={styles.gaugeTrack} />
      <View style={[styles.gaugeClip, styles.gaugeClipRight]}>
        <View style={[styles.gaugeRing, styles.gaugeRingRight, { transform: [{ rotate: `${firstRotation}deg` }] }]} />
      </View>
      <View style={[styles.gaugeClip, styles.gaugeClipLeft]}>
        <View style={[styles.gaugeRing, styles.gaugeRingLeft, { transform: [{ rotate: `${secondRotation}deg` }] }]} />
      </View>
      <Text style={styles.gaugeValue}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gauge: { width: GAUGE_SIZE, height: GAUGE_SIZE, alignItems: 'center', justifyContent: 'center' },
  gaugeTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    borderRadius: GAUGE_SIZE / 2,
    borderWidth: GAUGE_THICKNESS,
    borderColor: colors.slate100,
  },
  gaugeClip: { position: 'absolute', top: 0, width: GAUGE_SIZE / 2, height: GAUGE_SIZE, overflow: 'hidden' },
  gaugeClipRight: { left: GAUGE_SIZE / 2 },
  gaugeClipLeft: { left: 0 },
  gaugeRing: {
    position: 'absolute',
    top: 0,
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    borderRadius: GAUGE_SIZE / 2,
    borderWidth: GAUGE_THICKNESS,
    borderColor: 'transparent',
    borderTopColor: '#005A9C',
    borderRightColor: '#005A9C',
  },
  gaugeRingRight: { left: -GAUGE_SIZE / 2 },
  gaugeRingLeft: { left: 0 },
  gaugeValue: { fontSize: fontSize.xl, fontWeight: '900', color: colors.slate800 },
});
