/**
 * GEMS Ebook App - E-Reader & Note Modal Module
 * Encapsulated E-Reader, text selection, note modal & bookmark management module.
 */

window.GEMS = window.GEMS || {};

window.GEMS.Reader = (function () {
    let selectedText = "";
    let selectedRange = null;
    let activeNoteColor = "yellow";
    let editingNoteId = null;

    function initSelectionListeners() {
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (!selection) return;
            const text = selection.toString().trim();
            const toolbar = document.getElementById('selection-toolbar');
            const readerViewport = document.getElementById('reader-viewport');

            if (text && readerViewport && readerViewport.contains(selection.anchorNode)) {
                selectedText = text;
                selectedRange = selection.getRangeAt(0).cloneRange();

                if (toolbar) {
                    const rect = selectedRange.getBoundingClientRect();
                    const viewportRect = readerViewport.getBoundingClientRect();
                    toolbar.style.top = `${rect.top - viewportRect.top + readerViewport.scrollTop - 50}px`;
                    toolbar.style.left = `${rect.left - viewportRect.left + (rect.width / 2)}px`;
                    toolbar.classList.remove('hidden');
                }
            }
        });

        document.addEventListener('pointerdown', (e) => {
            const toolbar = document.getElementById('selection-toolbar');
            const noteModal = document.getElementById('reader-note-modal');
            const kindleMenu = document.getElementById('kindle-settings-menu');
            const readerViewport = document.getElementById('reader-viewport');

            if (kindleMenu && !kindleMenu.contains(e.target) && !e.target.closest('[onclick="toggleKindleSettings(event)"]')) {
                kindleMenu.classList.add('hidden');
            }

            if (toolbar && !toolbar.contains(e.target) && !e.target.classList.contains('dashed-underline') && !e.target.classList.contains('medical-glossary-term')) {
                const isInsideViewport = readerViewport && readerViewport.contains(e.target);
                const isInsideNoteModal = noteModal && noteModal.contains(e.target);

                // Rule: Do NOT dismiss or clear selection if clicking inside reader viewport or inside note modal
                if (isInsideViewport || isInsideNoteModal) {
                    return;
                }

                toolbar.classList.add('hidden');

                if (window.getSelection() && !e.target.closest('#selection-toolbar')) {
                    window.getSelection().removeAllRanges();
                    selectedText = "";
                    selectedRange = null;
                }
            }
        });
    }

    function openEreaderScreen() {
        if (window.GEMS && window.GEMS.Audio && window.GEMS.Audio.state.isPlaying) {
            window.GEMS.Audio.toggleAudioPlayback();
        }

        // Map bookId to its default chapter (first chapter of each book)
        const bookToDefaultChapter = {
            'chandoanykhoa': 'ecg',
            'lamsangnoikhoa': 'hetuanhoan',
            'thaoduoc': 'tamthat',
            'nhansam': 'nhansam',
            'trietly_yhss': 'trietly_mo_dau',
            'nuoc_va_su_song': 'nuoc_va_su_song',
            'tam_hoc_chua_lanh': 'tam_hoc_chua_lanh'
        };

        if (window.appState) {
            const bookId = window.appState.currentBookId;
            const currentChapter = window.appState.currentChapter;

            // Check if currentChapter belongs to this book (i.e., chapters.json has this chapter AND it's for this book)
            const chaptersData = window.bookChapters || {};
            const singleChapterBooks = ['nuoc_va_su_song', 'tam_hoc_chua_lanh', 'lamsangnoikhoa', 'nhansam'];
            const chapterBelongsToBook = chaptersData[currentChapter] && (
                // For single chapter books where chapterId === bookId
                (singleChapterBooks.includes(bookId) && currentChapter === bookId) ||
                // For chandoanykhoa chapters
                (bookId === 'chandoanykhoa' && ['tongquan', 'hetuanhoan', 'ecg'].includes(currentChapter)) ||
                // For thaoduoc / nhansam chapters
                (bookId === 'thaoduoc' && ['tamthat', 'nhansam'].includes(currentChapter)) ||
                // For trietly_yhss chapters
                (bookId === 'trietly_yhss' && ['trietly_mo_dau', 'trietly_5nen', 'trietly_3tru', 'trietly_ket_luan'].includes(currentChapter))
            );

            if (chapterBelongsToBook) {
                if (typeof loadChapter === 'function') loadChapter(currentChapter);
            } else {
                // Fall back to default chapter for this book
                const defaultChapter = bookToDefaultChapter[bookId] || currentChapter;
                if (typeof loadChapter === 'function') loadChapter(defaultChapter);
            }
        }

        const readerView = document.getElementById('view-reader');
        if (readerView) readerView.classList.remove('hidden');

        // Rule: Bottom nav MUST be hidden in E-Reader
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeEreaderScreen() {
        const readerView = document.getElementById('view-reader');
        if (readerView) readerView.classList.add('hidden');

        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function openReaderNoteModal() {
        const previewEl = document.getElementById('note-selected-text');
        if (previewEl) {
            previewEl.innerText = selectedText || "Bôi đen đoạn văn bản trong sách để tạo trích dẫn...";
        }
        const textarea = document.getElementById('note-textarea');
        if (textarea) textarea.value = "";

        editingNoteId = null;

        const titleEl = document.querySelector('#reader-note-modal h3');
        if (titleEl) titleEl.innerText = "Ghi chú";

        const subtitleEl = document.getElementById('note-modal-subtitle');
        if (subtitleEl && window.appState && window.bookChapters) {
            const chapter = window.bookChapters[window.appState.currentChapter];
            subtitleEl.innerText = chapter ? chapter.title : "ĐỌC & GHÉP NỐI";
        }

        selectNoteColor('yellow');
        if (typeof renderPrevNotes === 'function') renderPrevNotes();

        const noteModal = document.getElementById('reader-note-modal');
        if (noteModal) noteModal.classList.remove('hidden');
    }

    function closeReaderNoteModal() {
        const noteModal = document.getElementById('reader-note-modal');
        if (noteModal) noteModal.classList.add('hidden');
        editingNoteId = null;
    }

    function selectNoteColor(color) {
        activeNoteColor = color;
        ['yellow', 'green', 'pink'].forEach(c => {
            const btn = document.getElementById(`btn-color-${c}`);
            if (btn) {
                btn.style.boxShadow = c === color ? '0 0 0 2px #fff, 0 0 0 4px #005a9c' : 'none';
            }
        });

        const previewEl = document.getElementById('note-selected-text');
        if (previewEl) {
            previewEl.classList.remove('bg-highlight-yellow', 'bg-highlight-green', 'bg-highlight-pink', 'p-1.5', 'rounded');
            let bgClass = 'bg-highlight-yellow';
            if (color === 'green') bgClass = 'bg-highlight-green';
            if (color === 'pink') bgClass = 'bg-highlight-pink';
            previewEl.classList.add(bgClass, 'p-1.5', 'rounded');
        }
    }

    function saveReaderNote() {
        const textarea = document.getElementById('note-textarea');
        const noteText = textarea ? textarea.value.trim() : "";

        if (!selectedText && !editingNoteId) {
            if (typeof showToast === 'function') showToast("Vui lòng bôi đen vùng chọn văn bản trước", "error");
            return;
        }

        if (window.appState) {
            window.appState.notes = window.appState.notes || [];
            if (editingNoteId) {
                const note = window.appState.notes.find(n => n.id === editingNoteId);
                if (note) {
                    note.noteText = noteText;
                    note.color = activeNoteColor;
                    note.time = 'Vừa xong';
                }
            } else {
                window.appState.notes.push({
                    id: Date.now().toString(),
                    text: selectedText,
                    noteText: noteText,
                    color: activeNoteColor,
                    chapterId: window.appState.currentChapter,
                    chapterTitle: window.bookChapters && window.bookChapters[window.appState.currentChapter] ? window.bookChapters[window.appState.currentChapter].title : 'Chương sách',
                    time: 'Vừa xong'
                });
            }
        }

        if (typeof showToast === 'function') showToast("Đã lưu ghi chú thành công", "success");
        closeReaderNoteModal();
    }

    function updateReadingProgress() {
        const viewport = document.getElementById('reader-viewport');
        if (!viewport) return;

        const scrollTop = viewport.scrollTop;
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const percentage = maxScroll > 0 ? Math.round((scrollTop / maxScroll) * 100) : 0;

        const progressEl = document.getElementById('reader-progress-bar');
        const textEl = document.getElementById('reader-progress-text');
        if (progressEl) progressEl.style.width = `${percentage}%`;
        if (textEl) textEl.textContent = `${percentage}%`;

        if (window.appState) {
            window.appState.lastReadingPosition = {
                bookId: window.appState.currentBookId || 'cothe',
                chapter: window.appState.currentChapter || 'tongquan',
                percentage: percentage,
                scrollTop: scrollTop
            };
            if (typeof window.saveState === 'function') {
                window.saveState();
            }
        }
    }

    // Auto initialize selection listeners & reading progress scroll
    function initAll() {
        initSelectionListeners();
        const viewport = document.getElementById('reader-viewport');
        if (viewport) {
            viewport.addEventListener('scroll', updateReadingProgress, { passive: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    return {
        openEreaderScreen,
        closeEreaderScreen,
        openReaderNoteModal,
        closeReaderNoteModal,
        selectNoteColor,
        saveReaderNote,
        updateReadingProgress,
        get selectedText() { return selectedText; },
        set selectedText(val) { selectedText = val; },
        get selectedRange() { return selectedRange; },
        set selectedRange(val) { selectedRange = val; }
    };
})();

// Global compatibility bindings for inline HTML handlers (onclick="...")
window.openEreaderScreen = window.GEMS.Reader.openEreaderScreen;
window.closeEreaderScreen = window.GEMS.Reader.closeEreaderScreen;
window.openReaderNoteModal = window.GEMS.Reader.openReaderNoteModal;
window.closeReaderNoteModal = window.GEMS.Reader.closeReaderNoteModal;
window.selectNoteColor = window.GEMS.Reader.selectNoteColor;
window.saveReaderNote = window.GEMS.Reader.saveReaderNote;
window.updateReadingProgress = window.GEMS.Reader.updateReadingProgress;
