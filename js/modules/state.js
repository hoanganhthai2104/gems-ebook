/* js/modules/state.js - Global App State & Storage Management */
(function() {
    window.appState = window.appState || {
        shopPopupShown: false,
        isLoggedIn: localStorage.getItem('gems_logged_in') === 'true',
        streakDays: parseInt(localStorage.getItem('gems_streak') || '15', 10),
        userCoins: parseInt(localStorage.getItem('gems_coins') || '250', 10),
        currentBook: null,
        currentChapterIndex: 0,
        bookmarks: JSON.parse(localStorage.getItem('gems_bookmarks') || '[]'),
        highlights: JSON.parse(localStorage.getItem('gems_highlights') || '[]'),
        notes: JSON.parse(localStorage.getItem('gems_notes') || '[]')
    };

    window.saveState = function() {
        if (!window.appState) return;
        localStorage.setItem('gems_logged_in', window.appState.isLoggedIn);
        localStorage.setItem('gems_streak', window.appState.streakDays);
        localStorage.setItem('gems_coins', window.appState.userCoins);
        localStorage.setItem('gems_bookmarks', JSON.stringify(window.appState.bookmarks || []));
        localStorage.setItem('gems_highlights', JSON.stringify(window.appState.highlights || []));
        localStorage.setItem('gems_notes', JSON.stringify(window.appState.notes || []));
    };

    window.loadState = function() {
        if (!window.appState) return;
        window.appState.isLoggedIn = localStorage.getItem('gems_logged_in') === 'true';
        window.appState.streakDays = parseInt(localStorage.getItem('gems_streak') || '15', 10);
        window.appState.userCoins = parseInt(localStorage.getItem('gems_coins') || '250', 10);
        try {
            window.appState.bookmarks = JSON.parse(localStorage.getItem('gems_bookmarks') || '[]');
            window.appState.highlights = JSON.parse(localStorage.getItem('gems_highlights') || '[]');
            window.appState.notes = JSON.parse(localStorage.getItem('gems_notes') || '[]');
        } catch (e) {
            console.error("Lỗi nạp bộ nhớ ứng dụng:", e);
        }
    };
})();
