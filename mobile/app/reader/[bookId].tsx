/**
 * E-Reader screen.
 *
 * Native chrome (header, control bar, sheets, selection toolbar) wrapped around
 * a WebView content area: chapters.json ships each page as Tailwind-classed
 * HTML authored for the web reader, so it is rendered as-is instead of being
 * translated into React Native elements.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { EmptyState } from '@/components/screen';
import { ReaderAnnotationsSheet } from '@/components/reader-annotations-sheet';
import { ReaderChapterEndSheet } from '@/components/reader-chapter-end-sheet';
import { ReaderFlipButton, ReaderFocusExitButton, ReaderFooter, ReaderHeader } from '@/components/reader-chrome';
import { ReaderNoteModal } from '@/components/reader-note-modal';
import { ReaderSelectionToolbar } from '@/components/reader-selection-toolbar';
import { ReaderSettingsSheet } from '@/components/reader-settings-sheet';
import { ReaderTocSheet } from '@/components/reader-toc-sheet';
import { ReaderWebView } from '@/components/reader-webview';
import { Toast, useToast } from '@/components/toast';
import { getBook } from '@/data/catalog';
import { getBookPageCount, getChapter, getChaptersForBook, resolveChapterId } from '@/data/chapters';
import { hasQuiz } from '@/data/quizzes';
import { useAppStore } from '@/store/app-store';
import { fontSize, readerThemes, spacing, type HighlightColorKey } from '@/theme/tokens';

type ReaderSheet = 'none' | 'toc' | 'settings' | 'note' | 'annotations' | 'chapter-end';

export default function ReaderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ bookId: string; chapterId?: string; page?: string }>();
  const bookId = params.bookId ?? '';

  const themeKey = useAppStore((s) => s.readerTheme);
  const fontScale = useAppStore((s) => s.readerFontScale);
  const fontFamily = useAppStore((s) => s.readerFontFamily);
  const setReaderTheme = useAppStore((s) => s.setReaderTheme);
  const setReaderFontScale = useAppStore((s) => s.setReaderFontScale);
  const setReaderFontFamily = useAppStore((s) => s.setReaderFontFamily);
  const storeChapterId = useAppStore((s) => s.currentChapterId);
  const storePageIndex = useAppStore((s) => s.currentPageIndex);
  const openBook = useAppStore((s) => s.openBook);
  const setPage = useAppStore((s) => s.setPage);
  const setChapter = useAppStore((s) => s.setChapter);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const highlights = useAppStore((s) => s.highlights);
  const notes = useAppStore((s) => s.notes);
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const addHighlight = useAppStore((s) => s.addHighlight);
  const removeHighlight = useAppStore((s) => s.removeHighlight);
  const addNote = useAppStore((s) => s.addNote);
  const removeNote = useAppStore((s) => s.removeNote);

  const { toast, show } = useToast();

  const theme = readerThemes[themeKey];
  const book = getBook(bookId);
  const chapters = useMemo(() => getChaptersForBook(bookId), [bookId]);

  const activeChapterId = chapters.some((c) => c.id === storeChapterId)
    ? (storeChapterId as string)
    : (chapters[0]?.id ?? '');
  const chapter = getChapter(activeChapterId);
  const pageCount = chapter?.pages.length ?? 0;
  const pageIndex = Math.min(Math.max(storePageIndex, 0), Math.max(0, pageCount - 1));

  // Resolve the entry position once: an explicit route param wins, then the
  // saved reading position, then the book's first chapter.
  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current || !bookId) return;
    initialised.current = true;
    const resolved = resolveChapterId(bookId, params.chapterId ?? storeChapterId);
    if (!resolved) return;
    const requestedPage = Number.parseInt(params.page ?? '', 10);
    const savedPage = resolved === storeChapterId ? storePageIndex : 0;
    const target = Number.isFinite(requestedPage) ? requestedPage : savedPage;
    const maxIndex = Math.max(0, (getChapter(resolved)?.pages.length ?? 1) - 1);
    openBook(bookId, resolved, Math.min(Math.max(target, 0), maxIndex));
  }, [bookId, params.chapterId, params.page, storeChapterId, storePageIndex, openBook]);

  const [sheet, setSheet] = useState<ReaderSheet>('none');
  const [focusMode, setFocusMode] = useState(false);
  const [selection, setSelection] = useState<{ text: string; top: number } | null>(null);
  const [clearSelectionToken, setClearSelectionToken] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const dismissSelection = useCallback(() => {
    setSelection(null);
    setClearSelectionToken((token) => token + 1);
  }, []);

  const chapterIndex = chapters.findIndex((c) => c.id === activeChapterId);
  const pagesBefore = useMemo(
    () => chapters.slice(0, Math.max(0, chapterIndex)).reduce((sum, c) => sum + c.pages.length, 0),
    [chapters, chapterIndex],
  );
  const totalPages = useMemo(() => getBookPageCount(bookId), [bookId]);
  const globalPage = pagesBefore + pageIndex + 1;
  const progress = totalPages > 0 ? globalPage / totalPages : 0;

  const goToChapter = useCallback(
    (chapterId: string, page = 0) => {
      dismissSelection();
      setChapter(chapterId, page);
      setSheet('none');
    },
    [dismissSelection, setChapter],
  );

  const flip = useCallback(
    (direction: 1 | -1) => {
      dismissSelection();
      if (direction === 1) {
        if (pageIndex < pageCount - 1) {
          setPage(pageIndex + 1);
          const { pagesRead, setPagesRead } = useAppStore.getState();
          setPagesRead(pagesRead + 1);
          return;
        }
        setSheet('chapter-end');
        return;
      }
      if (pageIndex > 0) {
        setPage(pageIndex - 1);
        return;
      }
      const previous = chapters[chapterIndex - 1];
      if (previous) goToChapter(previous.id, Math.max(0, previous.pages.length - 1));
    },
    [dismissSelection, pageIndex, pageCount, setPage, chapters, chapterIndex, goToChapter],
  );

  const bookBookmarks = useMemo(() => bookmarks.filter((b) => b.bookId === bookId), [bookmarks, bookId]);
  const bookHighlights = useMemo(() => highlights.filter((h) => h.bookId === bookId), [highlights, bookId]);
  const bookNotes = useMemo(() => notes.filter((n) => n.bookId === bookId), [notes, bookId]);
  const chapterNotes = useMemo(
    () => bookNotes.filter((n) => n.chapterId === activeChapterId),
    [bookNotes, activeChapterId],
  );

  const currentBookmark = bookBookmarks.find(
    (b) => b.chapterId === activeChapterId && b.pageIndex === pageIndex,
  );

  const pageMarks = useMemo(
    () =>
      [...bookHighlights, ...bookNotes]
        .filter((h) => h.chapterId === activeChapterId && h.pageIndex === pageIndex)
        .map((h) => ({ id: h.id, text: h.text, color: h.color })),
    [bookHighlights, bookNotes, activeChapterId, pageIndex],
  );

  const handleToggleBookmark = useCallback(() => {
    if (!chapter) return;
    toggleBookmark({
      bookId,
      chapterId: activeChapterId,
      pageIndex,
      title: `${chapter.title} — Trang ${pageIndex + 1}`,
    });
  }, [chapter, toggleBookmark, bookId, activeChapterId, pageIndex]);

  const handleHighlight = useCallback(
    (color: HighlightColorKey) => {
      if (!selection) return;
      addHighlight({ bookId, chapterId: activeChapterId, pageIndex, text: selection.text, color });
      dismissSelection();
    },
    [selection, addHighlight, bookId, activeChapterId, pageIndex, dismissSelection],
  );

  const handleSaveNote = useCallback(
    (noteText: string, color: HighlightColorKey) => {
      if (!selection) return;
      addNote({ bookId, chapterId: activeChapterId, pageIndex, text: selection.text, color, note: noteText });
      setSheet('none');
      dismissSelection();
    },
    [selection, addNote, bookId, activeChapterId, pageIndex, dismissSelection],
  );

  const handleLookup = useCallback(() => {
    const query = selection?.text ?? '';
    dismissSelection();
    router.push({ pathname: '/dictionary', params: { q: query } });
  }, [selection, dismissSelection, router]);

  /** Port of the web reader's copyHighlightedText(). */
  const handleCopy = useCallback(() => {
    const text = selection?.text ?? '';
    if (!text) return;
    dismissSelection();
    Clipboard.setStringAsync(text)
      .then(() => show('Đã sao chép vào bộ nhớ tạm.', 'success'))
      .catch(() => show('Không thể sao chép văn bản.', 'warning'));
  }, [selection, dismissSelection, show]);

  const handleTerm = useCallback(
    (term: string) => {
      dismissSelection();
      router.push({ pathname: '/dictionary/[term]', params: { term } });
    },
    [dismissSelection, router],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  if (!chapter || !bookId) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <EmptyState
          icon="menu-book"
          title="Chưa có nội dung"
          message="Cuốn sách này chưa có chương nào để đọc."
        />
      </View>
    );
  }

  const nextChapter = chapters[chapterIndex + 1];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      {focusMode ? null : (
        <ReaderHeader
          theme={theme}
          bookTitle={book?.title ?? chapter.title}
          chapterMeta={chapter.meta}
          bookmarked={Boolean(currentBookmark)}
          onBack={handleBack}
          onToggleBookmark={handleToggleBookmark}
          onOpenAnnotations={() => setSheet('annotations')}
          paddingTop={insets.top}
        />
      )}

      <View
        style={[styles.content, focusMode && { paddingTop: insets.top }]}
        onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
      >
        <ReaderWebView
          html={chapter.pages[pageIndex] ?? ''}
          pageKey={`${activeChapterId}:${pageIndex}`}
          theme={theme}
          fontScale={fontScale}
          fontFamily={fontFamily}
          highlights={pageMarks}
          clearSelectionToken={clearSelectionToken}
          onSelection={(text, top) => setSelection({ text, top })}
          onSelectionCleared={() => setSelection(null)}
          onTerm={handleTerm}
          onFlip={flip}
        />

        <ReaderFlipButton
          theme={theme}
          direction="prev"
          disabled={pageIndex === 0 && chapterIndex <= 0}
          onPress={() => flip(-1)}
        />
        <ReaderFlipButton theme={theme} direction="next" onPress={() => flip(1)} />

        {focusMode ? (
          <ReaderFocusExitButton theme={theme} top={insets.top} onPress={() => setFocusMode(false)} />
        ) : null}

        <ReaderSelectionToolbar
          visible={Boolean(selection)}
          anchorTop={selection?.top ?? 0}
          contentHeight={contentHeight}
          onHighlight={handleHighlight}
          onCopy={handleCopy}
          onNote={() => setSheet('note')}
          onLookup={handleLookup}
        />

        {focusMode ? (
          <View style={styles.focusProgress} pointerEvents="none">
            <Text style={[styles.focusProgressText, { color: theme.muted, backgroundColor: theme.chrome }]}>
              {Math.round(progress * 100)}% · Trang {globalPage}
            </Text>
          </View>
        ) : null}
      </View>

      {focusMode ? null : (
        <ReaderFooter
          theme={theme}
          progress={progress}
          pageLabel={`Trang ${globalPage}`}
          focusMode={focusMode}
          onOpenToc={() => setSheet('toc')}
          onOpenSettings={() => setSheet('settings')}
          onToggleFocus={() => setFocusMode(true)}
          onOpenAudio={() => router.push({ pathname: '/audiobook/[bookId]', params: { bookId } })}
          paddingBottom={insets.bottom}
        />
      )}

      <ReaderTocSheet
        visible={sheet === 'toc'}
        onClose={() => setSheet('none')}
        theme={theme}
        bookTitle={book?.title ?? chapter.title}
        chapters={chapters}
        activeChapterId={activeChapterId}
        onSelectChapter={(id) => goToChapter(id, 0)}
      />

      <ReaderSettingsSheet
        visible={sheet === 'settings'}
        onClose={() => setSheet('none')}
        theme={theme}
        activeThemeKey={themeKey}
        fontScale={fontScale}
        fontFamily={fontFamily}
        onSelectTheme={setReaderTheme}
        onChangeFontScale={setReaderFontScale}
        onSelectFontFamily={setReaderFontFamily}
      />

      <ReaderNoteModal
        visible={sheet === 'note'}
        onClose={() => setSheet('none')}
        theme={theme}
        chapterTitle={chapter.title}
        selectedText={selection?.text ?? ''}
        chapterNotes={chapterNotes}
        onSave={handleSaveNote}
        onDeleteNote={removeNote}
      />

      <ReaderAnnotationsSheet
        visible={sheet === 'annotations'}
        onClose={() => setSheet('none')}
        theme={theme}
        bookTitle={book?.title ?? chapter.title}
        bookmarks={bookBookmarks}
        highlights={bookHighlights}
        notes={bookNotes}
        onJump={(chapterId, page) => goToChapter(chapterId, page)}
        onRemoveBookmark={(bookmark) =>
          toggleBookmark({
            bookId: bookmark.bookId,
            chapterId: bookmark.chapterId,
            pageIndex: bookmark.pageIndex,
            title: bookmark.title,
          })
        }
        onRemoveHighlight={removeHighlight}
        onRemoveNote={removeNote}
      />

      <ReaderChapterEndSheet
        visible={sheet === 'chapter-end'}
        onClose={() => setSheet('none')}
        theme={theme}
        chapterTitle={chapter.title}
        quizAvailable={hasQuiz(activeChapterId)}
        nextChapterTitle={nextChapter?.title}
        onStartQuiz={() => {
          setSheet('none');
          router.push({ pathname: '/quiz/[chapterId]', params: { chapterId: activeChapterId } });
        }}
        onNextChapter={() => {
          if (nextChapter) goToChapter(nextChapter.id, 0);
        }}
      />

      <Toast toast={toast} bottom={insets.bottom + spacing.xxxl * 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, position: 'relative' },
  focusProgress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.md,
    alignItems: 'center',
  },
  focusProgressText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: 999,
    opacity: 0.75,
    overflow: 'hidden',
  },
});
