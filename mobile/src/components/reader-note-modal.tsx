/**
 * Note composer - the port of #reader-note-modal. Shows the selected quote,
 * a note field, the highlight colour picker and the reader's existing notes
 * for the current chapter.
 */
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ReaderBottomSheet } from '@/components/reader-bottom-sheet';
import type { Note } from '@/data/types';
import {
  fontSize,
  highlightColors,
  radius,
  spacing,
  type HighlightColorKey,
  type ReaderTheme,
} from '@/theme/tokens';

const COLOR_KEYS: HighlightColorKey[] = ['yellow', 'green', 'blue', 'pink'];
const EMPTY_SELECTION_HINT = 'Bôi đen đoạn văn bản trong sách để tạo trích dẫn...';

interface ReaderNoteModalProps {
  visible: boolean;
  onClose: () => void;
  theme: ReaderTheme;
  chapterTitle: string;
  selectedText: string;
  chapterNotes: Note[];
  onSave: (noteText: string, color: HighlightColorKey) => void;
  onDeleteNote: (id: string) => void;
}

export function ReaderNoteModal({
  visible,
  onClose,
  theme,
  chapterTitle,
  selectedText,
  chapterNotes,
  onSave,
  onDeleteNote,
}: ReaderNoteModalProps) {
  const [noteText, setNoteText] = useState('');
  const [color, setColor] = useState<HighlightColorKey>('yellow');

  // Reset the composer each time the sheet opens, matching openReaderNoteModal().
  useEffect(() => {
    if (visible) {
      setNoteText('');
      setColor('yellow');
    }
  }, [visible]);

  const canSave = selectedText.trim().length > 0;

  return (
    <ReaderBottomSheet
      visible={visible}
      onClose={onClose}
      title="Ghi chú"
      subtitle={chapterTitle}
      theme={theme}
      maxHeightRatio={0.85}
    >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View
          style={[
            styles.quoteCard,
            {
              backgroundColor: canSave ? highlightColors[color].swatch : theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.quoteText, { color: canSave ? '#334155' : theme.muted }]}>
            {canSave ? `"${selectedText}"` : EMPTY_SELECTION_HINT}
          </Text>
        </View>

        <TextInput
          value={noteText}
          onChangeText={setNoteText}
          multiline
          numberOfLines={3}
          placeholder="Nhập ghi chú của bạn về đoạn văn bản này..."
          placeholderTextColor={theme.muted}
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
          ]}
        />

        <View style={styles.actionsRow}>
          <View style={styles.colorRow}>
            <Text style={[styles.colorLabel, { color: theme.muted }]}>Màu:</Text>
            {COLOR_KEYS.map((key) => (
              <Pressable
                key={key}
                onPress={() => setColor(key)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.colorDot,
                  { backgroundColor: highlightColors[key].swatch },
                  key === color && styles.colorDotActive,
                  pressed && styles.pressed,
                ]}
              />
            ))}
          </View>
          <Pressable
            onPress={() => onSave(noteText.trim(), color)}
            disabled={!canSave}
            style={({ pressed }) => [
              styles.saveButton,
              !canSave && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.saveLabel}>LƯU GHI CHÚ</Text>
          </Pressable>
        </View>

        <View style={[styles.previousBlock, { borderTopColor: theme.border }]}>
          <Text style={[styles.previousHeader, { color: theme.muted }]}>GHI CHÚ CỦA TÔI</Text>
          {chapterNotes.length === 0 ? (
            <Text style={[styles.previousEmpty, { color: theme.muted }]}>
              Chưa có ghi chú nào trong chương này.
            </Text>
          ) : (
            chapterNotes.map((note) => (
              <View
                key={note.id}
                style={[styles.noteCard, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                <View
                  style={[
                    styles.noteStripe,
                    { backgroundColor: highlightColors[note.color as HighlightColorKey]?.swatch ?? highlightColors.yellow.swatch },
                  ]}
                />
                <View style={styles.noteBody}>
                  <Text numberOfLines={2} style={[styles.noteQuote, { color: theme.muted }]}>
                    “{note.text}”
                  </Text>
                  {note.note ? (
                    <Text style={[styles.noteText, { color: theme.text }]}>{note.note}</Text>
                  ) : null}
                </View>
                <Pressable onPress={() => onDeleteNote(note.id)} hitSlop={8}>
                  <MaterialIcons name="delete-outline" size={18} color={theme.muted} />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ReaderBottomSheet>
  );
}

const styles = StyleSheet.create({
  quoteCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
  quoteText: { fontSize: fontSize.base, fontStyle: 'italic', lineHeight: 19, fontWeight: '500' },
  input: {
    marginTop: spacing.lg,
    minHeight: 84,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: fontSize.base,
    lineHeight: 19,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  colorLabel: { fontSize: fontSize.sm, fontWeight: '700' },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotActive: { borderColor: '#1D4ED8' },
  saveButton: {
    backgroundColor: '#005A9C',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  saveLabel: { color: '#FFFFFF', fontSize: fontSize.xs, fontWeight: '900', letterSpacing: 1 },
  previousBlock: { marginTop: spacing.xl, paddingTop: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.sm },
  previousHeader: { fontSize: fontSize.xs, fontWeight: '900', letterSpacing: 1.2 },
  previousEmpty: { fontSize: fontSize.base, paddingVertical: spacing.sm },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  noteStripe: { width: 4, alignSelf: 'stretch', borderRadius: radius.pill },
  noteBody: { flex: 1, gap: 3 },
  noteQuote: { fontSize: fontSize.sm, fontStyle: 'italic', lineHeight: 16 },
  noteText: { fontSize: fontSize.base, fontWeight: '600', lineHeight: 17 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
});
