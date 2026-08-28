/**
 * Audiobook player - port of the web `view-audiobook` panel.
 * Playback is a simulation (see @/components/audio-playback): there are no
 * audio files in the product, a 1s ticker advances the elapsed time instead.
 */
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/screen';
import { IconButton } from '@/components/ui';
import { AudioCoverStage } from '@/components/audio-cover-stage';
import { AudioChaptersSheet } from '@/components/audio-chapters-sheet';
import { AudioPlayerControls } from '@/components/audio-player-controls';
import { useAudiobookPlayer, type AudioChapter } from '@/components/audio-playback';
import { Toast, useToast, type ToastTone } from '@/components/toast';
import { getBook } from '@/data/catalog';
import { getChaptersForBook } from '@/data/chapters';
import { colors, fontSize, spacing } from '@/theme/tokens';

const FALLBACK_BOOK_ID = 'thaoduoc';
/** Narration pace used to turn a chapter's page count into a running time. */
const SECONDS_PER_PAGE = 300;
const MIN_CHAPTER_SECONDS = 600;

export default function AudiobookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bookId: string }>();
  const bookId = params.bookId ?? FALLBACK_BOOK_ID;
  const { toast, show } = useToast();
  const [sheetVisible, setSheetVisible] = useState(false);

  const book = getBook(bookId) ?? getBook(FALLBACK_BOOK_ID);

  const chapters = useMemo<AudioChapter[]>(() => {
    const source = getChaptersForBook(bookId);
    if (source.length === 0) {
      return [
        {
          id: `${bookId}-1`,
          title: `Chương 1: ${book?.title ?? 'Sách nói Y khoa GEMS'}`,
          durationSecs: MIN_CHAPTER_SECONDS,
        },
      ];
    }
    return source.map((chapter, index) => ({
      id: chapter.id,
      title: `Chương ${index + 1}: ${chapter.title}`,
      durationSecs: Math.max(MIN_CHAPTER_SECONDS, chapter.pages.length * SECONDS_PER_PAGE),
    }));
  }, [bookId, book?.title]);

  const notify = useCallback((text: string, tone: ToastTone) => show(text, tone), [show]);
  const player = useAudiobookPlayer(chapters, notify);

  const activeChapter = chapters[player.currentChapterIdx];

  const handleSelectChapter = (index: number) => {
    player.playChapter(index);
    setSheetVisible(false);
  };

  return (
    <Screen variant="surface">
      <View style={styles.header}>
        <View style={styles.headerSlot}>
          <IconButton
            icon="expand-more"
            color={colors.slate600}
            background="transparent"
            style={styles.headerButton}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          />
        </View>
        <Text numberOfLines={1} style={styles.headerTitle}>
          Đang phát
        </Text>
        <View style={[styles.headerSlot, styles.headerSlotRight]}>
          <IconButton
            icon="more-vert"
            color={colors.slate600}
            background="transparent"
            style={styles.headerButton}
            onPress={() => show('Thêm tùy chọn sách nói.')}
          />
        </View>
      </View>

      <View style={styles.body}>
        <AudioCoverStage
          bookId={bookId}
          cover={book?.cover ?? 'covers/thaoduoc.png'}
          chapterTitle={activeChapter?.title ?? 'Chương 1'}
          onPressChapter={() => setSheetVisible(true)}
        />

        <AudioPlayerControls
          currentTime={player.currentTime}
          duration={player.duration}
          isPlaying={player.isPlaying}
          speed={player.speed}
          skipSeconds={player.skipSeconds}
          sleepTimerActive={player.sleepTimerActive}
          onSeekPercent={player.seekToPercent}
          onTogglePlayback={player.togglePlayback}
          onSkip={player.skipTime}
          onChangeChapter={player.changeChapter}
          onCycleSpeed={player.cycleSpeed}
          onOpenChapters={() => setSheetVisible(true)}
          onToggleSleepTimer={player.toggleSleepTimer}
        />
      </View>

      <AudioChaptersSheet
        visible={sheetVisible}
        title={book?.title ?? 'Sách nói Y khoa GEMS'}
        author={book?.author ?? 'Ban Biên Tập GEMS'}
        cover={book?.cover ?? 'covers/thaoduoc.png'}
        chapters={chapters}
        activeIndex={player.currentChapterIdx}
        isPlaying={player.isPlaying}
        duration={player.duration}
        onSelect={handleSelectChapter}
        onClose={() => setSheetVisible(false)}
      />

      <Toast toast={toast} bottom={spacing.xxxl * 3} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
    backgroundColor: colors.white,
  },
  headerSlot: { width: 40 },
  headerSlotRight: { alignItems: 'flex-end' },
  headerButton: { borderWidth: 0, width: 36, height: 36 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: fontSize.h3, fontWeight: '900', color: colors.slate900 },

  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
    justifyContent: 'space-between',
  },
});
