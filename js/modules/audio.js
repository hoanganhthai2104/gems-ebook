/**
 * GEMS Ebook App - Audiobook Player Module
 * Encapsulated audio player & library filtering module.
 */

window.GEMS = window.GEMS || {};

window.GEMS.Audio = (function () {
    let audioInterval = null;
    let sleepTimerId = null;
    let sleepTimerSecs = 0;

    const audiobookState = {
        isPlaying: false,
        currentTime: 872, // 14:32 demo default
        duration: 2700,   // 45:00
        speed: 1.25,
        currentChapterIdx: 0,
        chapters: [
            { title: "Chương 1: Nguồn gốc và lịch sử thảo dược", durationSecs: 900 },
            { title: "Chương 2: Các nhóm hợp chất Saponin", durationSecs: 900 },
            { title: "Chương 3: Nghiên cứu thực nghiệm lâm sàng", durationSecs: 900 },
            { title: "Chương 4: Quy trình bào chế dược liệu", durationSecs: 1000 },
        ]
    };

    function formatAudioTime(secs) {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function openAudiobookPlayer(bookId) {
        const readerView = document.getElementById('view-reader');
        if (readerView && !readerView.classList.contains('hidden')) {
            if (typeof closeEreaderScreen === 'function') closeEreaderScreen();
        }

        const miniPlayer = document.getElementById('global-mini-player');
        if (miniPlayer) {
            miniPlayer.classList.add('hidden', 'translate-y-4', 'opacity-0', 'scale-95');
        }

        if (bookId && window.appState) {
            window.appState.currentBookId = bookId;
        }

        const activeBookId = (window.appState && window.appState.currentBookId) || 'thaoduoc';
        let book = (window.appState && window.appState.bookData) ? window.appState.bookData[activeBookId] : null;

        if (!book) {
            if (typeof loadBooksData === 'function' && window.appState && Object.keys(window.appState.bookData || {}).length === 0) {
                loadBooksData();
            }
            const fallbackTitles = {
                'capnhatyvan': 'Cập nhật Lâm sàng: Quý 3',
                'ditruyen': 'Y học Di truyền & Cá thể hóa',
                'thankinhhoc': 'Thần kinh học & Chức năng Nhận thức Nâng cao',
                'thaoduoc': 'Cẩm nang Thảo dược Quý Phương Đông',
                'lamsangnoikhoa': 'Sinh lý bệnh Tim mạch',
                'thankinh': 'Miễn dịch học Nâng cao',
                'baoche': 'Cẩm nang Bào chế Dược phẩm',
                'nhansam': 'Nghiên cứu Sâm & Dược liệu Quý'
            };
            const fallbackAuthors = {
                'capnhatyvan': 'Tạp chí Y học Nâng cao',
                'ditruyen': 'Viện Nghiên cứu Alan Turing',
                'thankinhhoc': 'Dr. Sarah Jenkins',
                'thaoduoc': 'GS. TS. Nguyễn Văn Anh',
                'lamsangnoikhoa': 'Dr. Elena Rostova',
                'thankinh': 'Dr. Michael Chen',
                'baoche': 'GEMS Academic',
                'nhansam': 'Viện Dược liệu GEMS'
            };
            book = {
                title: fallbackTitles[activeBookId] || 'Sách nói Y khoa GEMS',
                author: fallbackAuthors[activeBookId] || 'Ban Biên Tập GEMS',
                cover: `covers/${activeBookId}.png`
            };
        }

        const audioCover = document.getElementById('audio-cover');
        const audioTitle = document.getElementById('audio-title');
        const audioAuthor = document.getElementById('audio-author');

        if (audioCover) audioCover.src = book.cover || 'assets/logo.png';
        if (audioTitle) audioTitle.innerText = book.title || 'Sách nói Y khoa GEMS';
        if (audioAuthor) audioAuthor.innerText = book.author || 'Ban Biên Tập GEMS';

        audiobookState.duration = audiobookState.chapters.reduce((sum, ch) => sum + ch.durationSecs, 0);
        audiobookState.currentChapterIdx = 0;

        if (!audiobookState.isPlaying) {
            audiobookState.isPlaying = true;
            startAudioTicker();
        }

        updateAudioPlayerUI();

        const viewAudio = document.getElementById('view-audiobook');
        if (viewAudio) viewAudio.classList.remove('hidden');

        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeAudiobookPlayer() {
        const viewAudio = document.getElementById('view-audiobook');
        if (viewAudio) viewAudio.classList.add('hidden');

        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }

        const chaptersSheet = document.getElementById('audio-chapters-sheet');
        if (chaptersSheet) {
            chaptersSheet.classList.add('translate-y-full', 'hidden');
        }

        if (audiobookState.duration > 0 || audiobookState.isPlaying) {
            const miniPlayer = document.getElementById('global-mini-player');
            if (miniPlayer) {
                miniPlayer.classList.remove('hidden');
                setTimeout(() => {
                    miniPlayer.classList.remove('translate-y-4', 'opacity-0', 'scale-95');
                }, 10);
            }
            updateAudioPlayerUI();
        }
    }

    function toggleAudioPlayback() {
        audiobookState.isPlaying = !audiobookState.isPlaying;
        if (audiobookState.isPlaying) {
            startAudioTicker();
        } else {
            stopAudioTicker();
        }
        updateAudioPlayerUI();
    }

    function toggleMiniPlayerPlayback() {
        toggleAudioPlayback();
    }

    function closeMiniPlayer() {
        if (audiobookState.isPlaying) {
            stopAudioTicker();
            audiobookState.isPlaying = false;
        }
        audiobookState.currentTime = 0;
        audiobookState.duration = 0;
        const miniPlayer = document.getElementById('global-mini-player');
        if (miniPlayer) {
            miniPlayer.classList.add('translate-y-4', 'opacity-0', 'scale-95');
            setTimeout(() => {
                miniPlayer.classList.add('hidden');
            }, 300);
        }
        updateAudioPlayerUI();
    }

    function startAudioTicker() {
        stopAudioTicker();
        audioInterval = setInterval(() => {
            if (audiobookState.isPlaying) {
                audiobookState.currentTime += audiobookState.speed;
                if (audiobookState.currentTime >= audiobookState.duration) {
                    audiobookState.currentTime = audiobookState.duration;
                    audiobookState.isPlaying = false;
                    stopAudioTicker();
                }
                updateAudioPlayerUI();
            }
        }, 1000);
    }

    function stopAudioTicker() {
        if (audioInterval) {
            clearInterval(audioInterval);
            audioInterval = null;
        }
    }

    function skipAudioTime(secs) {
        audiobookState.currentTime += secs;
        if (audiobookState.currentTime < 0) audiobookState.currentTime = 0;
        if (audiobookState.currentTime > audiobookState.duration) audiobookState.currentTime = audiobookState.duration;
        updateAudioPlayerUI();
    }

    function seekAudioToPercent(percent) {
        audiobookState.currentTime = percent * audiobookState.duration;
        updateAudioPlayerUI();
    }

    function changeAudioChapter(dir) {
        let nextIdx = audiobookState.currentChapterIdx + dir;
        if (nextIdx >= 0 && nextIdx < audiobookState.chapters.length) {
            playAudioChapterByIdx(nextIdx);
        }
    }

    function playAudioChapterByIdx(idx) {
        audiobookState.currentChapterIdx = idx;
        let startSec = 0;
        for (let i = 0; i < idx; i++) {
            startSec += audiobookState.chapters[i].durationSecs;
        }
        audiobookState.currentTime = startSec;
        if (audiobookState.currentTime > audiobookState.duration) {
            audiobookState.currentTime = audiobookState.duration;
        }
        if (!audiobookState.isPlaying) {
            audiobookState.isPlaying = true;
            startAudioTicker();
        }
        updateAudioPlayerUI();
    }

    function cycleAudioSpeed() {
        const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
        let currentIdx = speeds.indexOf(audiobookState.speed);
        let nextIdx = (currentIdx + 1) % speeds.length;
        audiobookState.speed = speeds[nextIdx];
        updateAudioPlayerUI();
    }

    function updateAudioPlayerUI() {
        const currentFormatted = formatAudioTime(audiobookState.currentTime);
        const durationFormatted = formatAudioTime(audiobookState.duration);

        const curEl = document.getElementById('audio-time-current');
        if (curEl) curEl.innerText = currentFormatted;

        const durEl = document.getElementById('audio-time-duration');
        if (durEl) durEl.innerText = durationFormatted;

        const percent = audiobookState.duration > 0 ? (audiobookState.currentTime / audiobookState.duration) * 100 : 0;
        const fillEl = document.getElementById('audio-progress-fill');
        if (fillEl) fillEl.style.width = `${percent}%`;

        const thumbEl = document.getElementById('audio-progress-thumb');
        if (thumbEl) thumbEl.style.left = `${percent}%`;

        const playIcon = document.getElementById('icon-audio-play');
        if (playIcon) {
            playIcon.innerText = audiobookState.isPlaying ? 'pause' : 'play_arrow';
        }

        const btnSpeed = document.getElementById('btn-audio-speed');
        if (btnSpeed) {
            btnSpeed.innerText = `${audiobookState.speed.toFixed(2).replace('.00', '')}x`;
        }

        const currentChapter = audiobookState.chapters[audiobookState.currentChapterIdx];
        if (currentChapter) {
            const titleEl = document.getElementById('audio-current-chapter-title');
            if (titleEl) titleEl.innerText = currentChapter.title;
        }

        renderAudioChapters();

        // Mini player updates
        const miniPlayer = document.getElementById('global-mini-player');
        if (miniPlayer && !miniPlayer.classList.contains('hidden')) {
            const activeBookId = (window.appState && window.appState.currentBookId) || 'thaoduoc';
            const book = (window.appState && window.appState.bookData && window.appState.bookData[activeBookId]) || { title: 'Sách nói Y khoa GEMS', author: 'Ban Biên Tập GEMS' };
            const miniTitle = document.getElementById('mini-player-title');
            const miniAuthor = document.getElementById('mini-player-author');
            const miniPlayIcon = document.getElementById('mini-player-play-icon');
            if (miniTitle) miniTitle.innerText = book.title || 'Sách nói Y khoa GEMS';
            if (miniAuthor) miniAuthor.innerText = book.author || 'Ban Biên Tập GEMS';
            if (miniPlayIcon) miniPlayIcon.innerText = audiobookState.isPlaying ? 'pause' : 'play_arrow';
        }
    }

    function renderAudioChapters() {
        const listContainer = document.getElementById('audio-chapters-list');
        if (!listContainer) return;
        let accumulated = 0;
        let activeIdx = 0;
        for (let i = 0; i < audiobookState.chapters.length; i++) {
            const chDur = audiobookState.chapters[i].durationSecs;
            if (audiobookState.currentTime >= accumulated && audiobookState.currentTime < accumulated + chDur) {
                activeIdx = i;
            }
            accumulated += chDur;
        }
        audiobookState.currentChapterIdx = activeIdx;

        listContainer.innerHTML = audiobookState.chapters.map((ch, idx) => {
            const isActive = idx === activeIdx;
            return `
                <div onclick="GEMS.Audio.playAudioChapterByIdx(${idx})" class="p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${isActive ? 'bg-blue-50 border border-blue-200/80 shadow-sm' : 'hover:bg-slate-50'}">
                    <div class="flex items-center gap-3">
                        <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}">${idx + 1}</span>
                        <div>
                            <p class="text-xs font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}">${ch.title}</p>
                            <p class="text-[10px] text-slate-400 font-medium">${formatAudioTime(ch.durationSecs)}</p>
                        </div>
                    </div>
                    ${isActive && audiobookState.isPlaying ? '<span class="material-symbols-outlined text-blue-600 text-sm animate-pulse">equalizer</span>' : ''}
                </div>
            `;
        }).join('');
    }

    function filterAudiobookLibraryCategory(category, buttonEl) {
        document.querySelectorAll('.audio-filter-pill').forEach(btn => {
            btn.className = 'audio-filter-pill px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-slate-100 text-slate-600 hover:bg-slate-200';
        });
        if (buttonEl) {
            buttonEl.className = 'audio-filter-pill px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-[#005a9c] text-white';
        }
        document.querySelectorAll('.audio-card-item').forEach(card => {
            const itemCat = card.getAttribute('data-category');
            if (category === 'all' || itemCat === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    return {
        formatAudioTime,
        openAudiobookPlayer,
        closeAudiobookPlayer,
        toggleAudioPlayback,
        toggleMiniPlayerPlayback,
        closeMiniPlayer,
        skipAudioTime,
        seekAudioToPercent,
        changeAudioChapter,
        playAudioChapterByIdx,
        cycleAudioSpeed,
        updateAudioPlayerUI,
        renderAudioChapters,
        filterAudiobookLibraryCategory,
        get state() { return audiobookState; }
    };
})();

// Global compatibility bindings for inline HTML handlers (onclick="...")
window.openAudiobookPlayer = window.GEMS.Audio.openAudiobookPlayer;
window.closeAudiobookPlayer = window.GEMS.Audio.closeAudiobookPlayer;
window.toggleAudioPlayback = window.GEMS.Audio.toggleAudioPlayback;
window.toggleMiniPlayerPlayback = window.GEMS.Audio.toggleMiniPlayerPlayback;
window.closeMiniPlayer = window.GEMS.Audio.closeMiniPlayer;
window.skipAudioTime = window.GEMS.Audio.skipAudioTime;
window.seekAudioToPercent = window.GEMS.Audio.seekAudioToPercent;
window.changeAudioChapter = window.GEMS.Audio.changeAudioChapter;
window.playAudioChapterByIdx = window.GEMS.Audio.playAudioChapterByIdx;
window.cycleAudioSpeed = window.GEMS.Audio.cycleAudioSpeed;
window.updateAudioPlayerUI = window.GEMS.Audio.updateAudioPlayerUI;
window.filterAudiobookLibraryCategory = window.GEMS.Audio.filterAudiobookLibraryCategory;
