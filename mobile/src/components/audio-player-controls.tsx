/**
 * Player controls card: scrub bar, transport buttons and the speed / chapter /
 * sleep-timer action row (port of the web player's control box).
 */
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatAudioTime, formatSpeed } from '@/components/audio-playback';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface AudioPlayerControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  speed: number;
  skipSeconds: number;
  sleepTimerActive: boolean;
  onSeekPercent: (percent: number) => void;
  onTogglePlayback: () => void;
  onSkip: (secs: number) => void;
  onChangeChapter: (direction: number) => void;
  onCycleSpeed: () => void;
  onOpenChapters: () => void;
  onToggleSleepTimer: () => void;
}

export function AudioPlayerControls({
  currentTime,
  duration,
  isPlaying,
  speed,
  skipSeconds,
  sleepTimerActive,
  onSeekPercent,
  onTogglePlayback,
  onSkip,
  onChangeChapter,
  onCycleSpeed,
  onOpenChapters,
  onToggleSleepTimer,
}: AudioPlayerControlsProps) {
  const trackWidth = useRef(0);
  const percent = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  const handleSeek = (event: GestureResponderEvent) => {
    if (trackWidth.current <= 0) return;
    onSeekPercent(event.nativeEvent.locationX / trackWidth.current);
  };

  return (
    <View style={styles.card}>
      <View style={styles.progressBlock}>
        <Pressable
          onPress={handleSeek}
          onLayout={(event) => {
            trackWidth.current = event.nativeEvent.layout.width;
          }}
          hitSlop={{ top: 10, bottom: 10 }}
          style={styles.track}
        >
          <View style={[styles.fill, { width: `${percent * 100}%` }]} />
          <View style={[styles.thumb, { left: `${percent * 100}%` }]} />
        </Pressable>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatAudioTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatAudioTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.transportRow}>
        <TransportButton icon="skip-previous" onPress={() => onChangeChapter(-1)} />
        <TransportButton icon="replay-10" onPress={() => onSkip(-skipSeconds)} />
        <Pressable
          onPress={onTogglePlayback}
          style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
        >
          <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={28} color={colors.white} />
        </Pressable>
        <TransportButton icon="forward-10" onPress={() => onSkip(skipSeconds)} />
        <TransportButton icon="skip-next" onPress={() => onChangeChapter(1)} />
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <Pressable onPress={onCycleSpeed} style={({ pressed }) => [styles.speedButton, pressed && styles.pressed]}>
          <Text style={styles.speedText}>{formatSpeed(speed)}</Text>
        </Pressable>
        <Pressable
          onPress={onOpenChapters}
          style={({ pressed }) => [styles.chapterButton, pressed && styles.pressed]}
        >
          <MaterialIcons name="list" size={15} color={colors.slate700} />
          <Text style={styles.chapterText}>Danh sách chương</Text>
        </Pressable>
        <Pressable
          onPress={onToggleSleepTimer}
          hitSlop={8}
          style={({ pressed }) => [styles.timerButton, pressed && styles.pressed]}
        >
          <MaterialIcons
            name={sleepTimerActive ? 'timer-3' : 'timer'}
            size={18}
            color={sleepTimerActive ? colors.primary : colors.slate600}
          />
        </Pressable>
      </View>
    </View>
  );
}

function TransportButton({
  icon,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.transportButton, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={24} color={colors.slate600} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.xl,
    ...shadow.card,
  },
  progressBlock: { gap: spacing.sm },
  track: { height: 6, borderRadius: radius.pill, backgroundColor: colors.slate100, justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, height: 6, borderRadius: radius.pill, backgroundColor: colors.primary },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    ...shadow.card,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xs },
  timeText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate500 },

  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 280,
  },
  transportButton: { padding: spacing.sm },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  pressed: { opacity: 0.8 },

  divider: { height: 1, backgroundColor: colors.slate100, width: '100%' },

  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xs },
  speedButton: {
    minWidth: 56,
    alignItems: 'center',
    backgroundColor: colors.slate100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  speedText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate700 },
  chapterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.slate200,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  chapterText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.slate700 },
  timerButton: { padding: spacing.sm },
});
