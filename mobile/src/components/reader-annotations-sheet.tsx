/**
 * "Ghi chú & Dấu trang" sheet reached from the reader header - the port of
 * openNoteHistoryList(). Lists the current book's bookmarks, highlights and
 * notes, each one jumping straight back to the page it came from.
 */
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ReaderBottomSheet } from '@/components/reader-bottom-sheet';
import type { Bookmark, Highlight, Note } from '@/data/types';
import {
  fontSize,
  highlightColors,
  radius,
  spacing,
  type HighlightColorKey,
  type ReaderTheme,
} from '@/theme/tokens';

interface ReaderAnnotationsSheetProps {
  visible: boolean;
  onClose: () => void;
  theme: ReaderTheme;
  bookTitle: string;
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];
  onJump: (chapterId: string, pageIndex: number) => void;
  onRemoveBookmark: (bookmark: Bookmark) => void;
  onRemoveHighlight: (id: string) => void;
  onRemoveNote: (id: string) => void;
}

export function ReaderAnnotationsSheet({
  visible,
  onClose,
  theme,
  bookTitle,
  bookmarks,
  highlights,
  notes,
  onJump,
  onRemoveBookmark,
  onRemoveHighlight,
  onRemoveNote,
}: ReaderAnnotationsSheetProps) {
  const isEmpty = bookmarks.length === 0 && highlights.length === 0 && notes.length === 0;

  return (
    <ReaderBottomSheet
      visible={visible}
      onClose={onClose}
      title="Ghi chú & Dấu trang"
      subtitle={bookTitle}
      theme={theme}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {isEmpty ? (
          <Text style={[styles.empty, { color: theme.muted }]}>
            Chưa có dấu trang hoặc ghi chú nào trong cuốn sách này.
          </Text>
        ) : null}

        {bookmarks.length > 0 ? (
          <Section theme={theme} label="DẤU TRANG">
            {bookmarks.map((bookmark) => (
              <Row
                key={bookmark.id}
                theme={theme}
                icon="bookmark"
                accent="#2563EB"
                title={bookmark.title}
                meta={`Trang ${bookmark.pageIndex + 1}`}
                onPress={() => onJump(bookmark.chapterId, bookmark.pageIndex)}
                onRemove={() => onRemoveBookmark(bookmark)}
              />
            ))}
          </Section>
        ) : null}

        {highlights.length > 0 ? (
          <Section theme={theme} label="ĐÁNH DẤU">
            {highlights.map((highlight) => (
              <Row
                key={highlight.id}
                theme={theme}
                icon="brush"
                accent={swatchFor(highlight.color)}
                title={highlight.text}
                meta={`Trang ${highlight.pageIndex + 1}`}
                onPress={() => onJump(highlight.chapterId, highlight.pageIndex)}
                onRemove={() => onRemoveHighlight(highlight.id)}
              />
            ))}
          </Section>
        ) : null}

        {notes.length > 0 ? (
          <Section theme={theme} label="GHI CHÚ CỦA TÔI">
            {notes.map((note) => (
              <Row
                key={note.id}
                theme={theme}
                icon="sticky-note-2"
                accent={swatchFor(note.color)}
                title={note.note || note.text}
                meta={`Trang ${note.pageIndex + 1}`}
                onPress={() => onJump(note.chapterId, note.pageIndex)}
                onRemove={() => onRemoveNote(note.id)}
              />
            ))}
          </Section>
        ) : null}
      </ScrollView>
    </ReaderBottomSheet>
  );
}

function swatchFor(color: string): string {
  return highlightColors[color as HighlightColorKey]?.swatch ?? highlightColors.yellow.swatch;
}

function Section({
  theme,
  label,
  children,
}: {
  theme: ReaderTheme;
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.muted }]}>{label}</Text>
      {children}
    </View>
  );
}

interface RowProps {
  theme: ReaderTheme;
  icon: keyof typeof MaterialIcons.glyphMap;
  accent: string;
  title: string;
  meta: string;
  onPress: () => void;
  onRemove: () => void;
}

function Row({ theme, icon, accent, title, meta, onPress, onRemove }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.background, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons name={icon} size={16} color={accent} />
      <View style={styles.rowBody}>
        <Text numberOfLines={2} style={[styles.rowTitle, { color: theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.rowMeta, { color: theme.muted }]}>{meta}</Text>
      </View>
      <Pressable onPress={onRemove} hitSlop={8}>
        <MaterialIcons name="close" size={16} color={theme.muted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.sm, gap: spacing.lg },
  empty: { fontSize: fontSize.base, paddingVertical: spacing.xl, textAlign: 'center' },
  section: { gap: spacing.sm },
  sectionLabel: { fontSize: fontSize.xs, fontWeight: '900', letterSpacing: 1.2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { fontSize: fontSize.base, fontWeight: '700', lineHeight: 17 },
  rowMeta: { fontSize: fontSize.xs, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
