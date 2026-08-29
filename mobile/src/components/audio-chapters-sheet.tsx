/**
 * Bottom sheet listing the audiobook chapters (port of #audio-chapters-sheet):
 * a header card with cover / title / badges, then the tappable chapter list.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { formatAudioTime, formatTotalDuration, type AudioChapter } from '@/components/audio-playback';
import { resolveCover } from '@/data/cover-images';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';

interface AudioChaptersSheetProps {
  visible: boolean;
  title: string;
  author: string;
  cover: string;
  chapters: AudioChapter[];
  activeIndex: number;
  isPlaying: boolean;
  duration: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function AudioChaptersSheet({
  visible,
  title,
  author,
  cover,
  chapters,
  activeIndex,
  isPlaying,
  duration,
  onSelect,
  onClose,
}: AudioChaptersSheetProps) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Pressable onPress={onClose} style={styles.handleHit}>
          <View style={styles.handle} />
        </Pressable>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Danh sách chương</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialIcons name="close" size={18} color={colors.slate500} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.bookCard}>
            <Image source={resolveCover(cover)} style={styles.bookCover} contentFit="cover" transition={150} />
            <View style={styles.bookBody}>
              <Text numberOfLines={1} style={styles.bookTitle}>
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.bookAuthor}>
                {author}
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.durationBadge}>
                  <MaterialIcons name="schedule" size={12} color={colors.primary} />
                  <Text style={styles.durationBadgeText}>{formatTotalDuration(duration)}</Text>
                </View>
                <View style={styles.chapterBadge}>
                  <Text style={styles.chapterBadgeText}>{`${chapters.length} Chương`}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.list}>
            {chapters.map((chapter, index) => {
              const active = index === activeIndex;
              return (
                <Pressable
                  key={chapter.id}
                  onPress={() => onSelect(index)}
                  style={({ pressed }) => [styles.chapterRow, active && styles.chapterRowActive, pressed && styles.pressed]}
                >
                  <View style={styles.chapterLeft}>
                    <View style={[styles.chapterIndex, active && styles.chapterIndexActive]}>
                      <Text style={[styles.chapterIndexText, active && styles.chapterIndexTextActive]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.chapterTextBlock}>
                      <Text numberOfLines={2} style={[styles.chapterTitle, active && styles.chapterTitleActive]}>
                        {chapter.title}
                      </Text>
                      <Text style={styles.chapterDuration}>{formatAudioTime(chapter.durationSecs)}</Text>
                    </View>
                  </View>
                  {active && isPlaying ? (
                    <MaterialIcons name="equalizer" size={16} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '82%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
    ...shadow.raised,
  },
  handleHit: { paddingVertical: spacing.md, alignItems: 'center' },
  handle: { width: 48, height: 4, borderRadius: radius.pill, backgroundColor: colors.slate300 },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  sheetTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.slate800 },

  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.slate100,
    borderRadius: radius.xxl,
    padding: spacing.lg,
  },
  bookCover: { width: 80, height: 80, borderRadius: radius.lg, backgroundColor: colors.slate200 },
  bookBody: { flex: 1, gap: spacing.sm },
  bookTitle: { fontSize: fontSize.xl, fontWeight: '900', color: colors.slate800 },
  bookAuthor: { fontSize: fontSize.base, fontWeight: '600', color: colors.slate500 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingTop: 2 },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoftBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  durationBadgeText: { fontSize: fontSize.xs, fontWeight: '900', color: colors.primary },
  chapterBadge: {
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chapterBadgeText: { fontSize: fontSize.xs, fontWeight: '900', color: colors.slate600 },

  list: { gap: 14 },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chapterRowActive: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder, ...shadow.card },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  chapterIndex: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIndexActive: { backgroundColor: colors.primary },
  chapterIndexText: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate500 },
  chapterIndexTextActive: { color: colors.white },
  chapterTextBlock: { flex: 1 },
  chapterTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.slate700, lineHeight: 16 },
  chapterTitleActive: { color: '#1E3A8A' },
  chapterDuration: { fontSize: fontSize.xs, fontWeight: '500', color: colors.slate400, marginTop: 2 },
  pressed: { opacity: 0.85 },
});
