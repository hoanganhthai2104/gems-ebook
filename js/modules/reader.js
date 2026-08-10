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
            'chandoanykhoa': 'tongquan',
            'lamsangnoikhoa': 'hetuanhoan',
            'capnhatyvan': 'ecg',
            'thaoduoc': 'tamthat',
            'nhansam': 'nhansam',
            'trietly_yhss': 'trietly_mo_dau',
            'nuoc_va_su_song': 'nuoc_va_su_song',
            'tam_hoc_chua_lanh': 'tam_hoc_chua_lanh',
            'trathaomoc': 'nuoc_va_su_song',
            'thucduong': 'trietly_5nen',
            'co-the-nguoi': 'tongquan',
            'thankinh': 'hetuanhoan',
            'thankinhhoc': 'hetuanhoan',
            'ditruyen': 'tongquan'
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
            if (typeof window.saveStateCloud === 'function') {
                window.saveStateCloud();
            }
        }
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let isSwiping = false;

    function initReaderSwipeGestures() {
        const viewport = document.getElementById('reader-viewport');
        if (!viewport) return;

        viewport.addEventListener('touchstart', (e) => {
            if (e.target.closest('#reader-note-modal') || e.target.closest('#selection-toolbar')) return;
            if (window.getSelection && window.getSelection().toString().trim().length > 0) return;

            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchCurrentX = touchStartX;
            isSwiping = false;
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;

            if (!isSwiping && Math.abs(deltaY) > Math.abs(deltaX)) return;

            if (Math.abs(deltaX) > 15) {
                isSwiping = true;
                touchCurrentX = e.touches[0].clientX;
            }
        }, { passive: true });

        viewport.addEventListener('touchend', () => {
            if (!isSwiping) return;
            const deltaX = touchCurrentX - touchStartX;
            if (deltaX < -50) {
                if (typeof window.nextPage === 'function') window.nextPage();
            } else if (deltaX > 50) {
                if (typeof window.prevPage === 'function') window.prevPage();
            }
            isSwiping = false;
            touchStartX = 0;
        }, { passive: true });
    }

    // Auto initialize selection listeners & reading progress scroll
    function initAll() {
        initSelectionListeners();
        initReaderSwipeGestures();
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

    // GEMS AI Copilot Functions
    function toggleGemsAIDrawer() {
        const drawer = document.getElementById('gems-ai-drawer');
        if (drawer) {
            drawer.classList.toggle('translate-x-full');
        }
    }

    function askGemsAI(promptType) {
        const container = document.getElementById('gems-ai-messages');
        if (!container) return;

        let userMsg = '';
        let aiMsg = '';

        if (promptType === 'summary') {
            userMsg = '💡 Tóm tắt chương sách này';
            aiMsg = '<strong>[GEMS AI Medical Summary]</strong><br/>• <strong>Nội dung chính:</strong> Chương sách trình bày tác dụng của Tam Thất (<em>Panax pseudoginseng</em>) trong y học cổ truyền và lâm sàng hiện đại.<br/>• <strong>Hoạt chất sinh học:</strong> Chứa hàm lượng Saponin triterpenoid dồi dào giúp tiêu thũng, chỉ huyết (cầm máu), giảm đau và tăng sức bền thành mạch.<br/>• <strong>Lưu ý lâm sàng:</strong> Cần thận trọng khi dùng cho phụ nữ có thai và bệnh nhân đang dùng thuốc chống đông máu.';
        } else if (promptType === 'dict') {
            userMsg = '📖 Giải thích thuật ngữ Y khoa';
            aiMsg = '<strong>[GEMS AI Dictionary Analysis]</strong><br/>1. <strong>Panax pseudoginseng:</strong> Tên khoa học của Tam Thất họ Nhân Sâm.<br/>2. <strong>Chỉ huyết (止血):</strong> Thuật ngữ đông y chỉ tác dụng cầm máu.<br/>3. <strong>Saponin:</strong> Phức hợp Glycoside sinh học giúp hạ mỡ máu và kháng viêm.';
        } else if (promptType === 'quiz') {
            userMsg = '❓ Tạo 5 câu trắc nghiệm';
            aiMsg = '<strong>[GEMS AI Quiz Generator - 5 Câu Trắc Nghiệm]</strong><br/><strong>Câu 1:</strong> Tam Thất thuộc họ thực vật nào?<br/>A. Họ Gừng &nbsp;&nbsp;<b>B. Họ Nhân Sâm (Araliaceae)</b><br/><br/><strong>Câu 2:</strong> Tác dụng chủ yếu của Tam Thất trong y học cổ truyền?<br/><b>A. Tán ứ, chỉ huyết, định thống</b> &nbsp;&nbsp;B. Thanh nhiệt, giải độc<br/><br/><i>✓ Đã lưu 5 câu trắc nghiệm vào bộ Flashcard kiến thức!</i>';
        } else {
            userMsg = 'Phân tích ca lâm sàng';
            aiMsg = 'GEMS AI đang phân tích dữ liệu lâm sàng y khoa...';
        }

        // Render user message
        const userDiv = document.createElement('div');
        userDiv.className = 'p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-semibold text-[11px] self-end ml-auto max-w-[85%]';
        userDiv.innerHTML = userMsg;
        container.appendChild(userDiv);

        // Render AI response container with typing effect
        const aiDiv = document.createElement('div');
        aiDiv.className = 'p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900 text-sky-950 dark:text-sky-200 text-[11px] shadow-sm leading-relaxed';
        aiDiv.innerHTML = '<span class="animate-pulse">GEMS AI đang suy nghĩ...</span>';
        container.appendChild(aiDiv);
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            aiDiv.innerHTML = aiMsg;
            container.scrollTop = container.scrollHeight;
        }, 600);
    }

    // Audio Book Player & Ambient Soundscapes Functions
    let isSpeaking = false;
    let currentSpeechRate = 1.0;
    let activeAmbientType = null;
    let ambientAudioContext = null;

    function toggleSpeechSynthesis() {
        const btn = document.getElementById('btn-audio-play');
        const label = document.getElementById('audio-status-label');

        if (!('speechSynthesis' in window)) {
            if (typeof showToast === 'function') showToast('Trình duyệt không hỗ trợ đọc sách nói AI!', 'error');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-base">play_arrow</span>';
            if (label) label.textContent = 'Đọc Sách Nói AI';
            if (typeof showToast === 'function') showToast('Đã dừng đọc sách nói', 'info');
        } else {
            const pageText = document.querySelector('.flipbook-page[style*="translateX(0%)"]') || document.querySelector('.flipbook-page');
            const textToRead = pageText ? pageText.innerText.substring(0, 500) : "Tam Thất là vị thuốc quý tán ứ chỉ huyết.";
            
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'vi-VN';
            utterance.rate = currentSpeechRate;

            utterance.onend = () => {
                isSpeaking = false;
                if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-base">play_arrow</span>';
                if (label) label.textContent = 'Đọc Sách Nói AI';
            };

            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-base">pause</span>';
            if (label) label.textContent = 'Đang Đọc Giọng AI...';
            if (typeof showToast === 'function') showToast('Đang phát đọc sách nói AI giọng Tiếng Việt', 'success');
        }
    }

    function changeSpeechRate(rate) {
        currentSpeechRate = parseFloat(rate) || 1.0;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            toggleSpeechSynthesis();
        }
    }

    function toggleAmbientSound(type) {
        ['btn-ambient-rain', 'btn-ambient-lab', 'btn-ambient-waves'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.remove('bg-sky-600', 'text-white');
        });

        if (activeAmbientType === type) {
            activeAmbientType = null;
            if (typeof showToast === 'function') showToast('Đã tắt âm thanh nền tập trung', 'info');
        } else {
            activeAmbientType = type;
            const targetBtn = document.getElementById(`btn-ambient-${type}`);
            if (targetBtn) targetBtn.classList.add('bg-sky-600', 'text-white');

            const names = { rain: 'Tiếng mưa phòng đọc', lab: 'Không gian phòng Lab', waves: 'Sóng não Alpha 432Hz' };
            if (typeof showToast === 'function') showToast(`Đã bật âm thanh nền: ${names[type] || type}`, 'success');
        }
    }

    return {
        openEreaderScreen,
        closeEreaderScreen,
        openReaderNoteModal,
        closeReaderNoteModal,
        selectNoteColor,
        saveReaderNote,
        updateReadingProgress,
        toggleGemsAIDrawer,
        askGemsAI,
        toggleSpeechSynthesis,
        changeSpeechRate,
        toggleAmbientSound,
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
window.toggleGemsAIDrawer = window.GEMS.Reader.toggleGemsAIDrawer;
window.askGemsAI = window.GEMS.Reader.askGemsAI;
window.toggleSpeechSynthesis = window.GEMS.Reader.toggleSpeechSynthesis;
window.changeSpeechRate = window.GEMS.Reader.changeSpeechRate;
window.toggleAmbientSound = window.GEMS.Reader.toggleAmbientSound;


