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
        notes: JSON.parse(localStorage.getItem('gems_notes') || '[]'),
        userVouchers: JSON.parse(localStorage.getItem('gems_user_vouchers') || '["VOUCHER_25k", "FREESHIP_0d"]')
    };

    window.saveState = function() {
        if (!window.appState) return;
        localStorage.setItem('gems_logged_in', window.appState.isLoggedIn);
        localStorage.setItem('gems_streak', window.appState.streakDays);
        localStorage.setItem('gems_coins', window.appState.userCoins);
        localStorage.setItem('gems_bookmarks', JSON.stringify(window.appState.bookmarks || []));
        localStorage.setItem('gems_highlights', JSON.stringify(window.appState.highlights || []));
        localStorage.setItem('gems_notes', JSON.stringify(window.appState.notes || []));
        localStorage.setItem('gems_user_vouchers', JSON.stringify(window.appState.userVouchers || []));
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
            window.appState.userVouchers = JSON.parse(localStorage.getItem('gems_user_vouchers') || '["VOUCHER_25k", "FREESHIP_0d"]');
        } catch (e) {
            console.error("Lỗi nạp bộ nhớ ứng dụng:", e);
        }
    };

    window.appState.userId = localStorage.getItem('gems_user_id') || 'user_demo_01';

    let cloudSaveTimeout = null;
    window.saveStateCloud = function() {
        if (!window.db || !window.appState) return;
        if (cloudSaveTimeout) clearTimeout(cloudSaveTimeout);
        cloudSaveTimeout = setTimeout(async () => {
            try {
                const payload = {
                    userCoins: window.appState.userCoins,
                    streakDays: window.appState.streakDays,
                    bookmarks: window.appState.bookmarks || [],
                    highlights: window.appState.highlights || [],
                    notes: window.appState.notes || [],
                    userVouchers: window.appState.userVouchers || [],
                    lastReadingPosition: window.appState.lastReadingPosition || null,
                    updatedAt: (window.firebase && window.firebase.firestore) ? window.firebase.firestore.FieldValue.serverTimestamp() : new Date()
                };
                await window.db.collection('user_sessions').doc(window.appState.userId).set(payload, { merge: true });
                console.log("☁️ State synced to Firestore");
            } catch (err) {
                console.warn("Cloud save warning:", err);
            }
        }, 1500);
    };

    window.initCloudSyncListener = function() {
        if (!window.db || !window.appState) return;
        try {
            window.db.collection('user_sessions').doc(window.appState.userId).onSnapshot(doc => {
                if (!doc.exists) return;
                const data = doc.data();
                if (!data) return;

                if (data.userCoins !== undefined) window.appState.userCoins = data.userCoins;
                if (data.streakDays !== undefined) window.appState.streakDays = data.streakDays;
                if (data.bookmarks) window.appState.bookmarks = data.bookmarks;
                if (data.highlights) window.appState.highlights = data.highlights;
                if (data.notes) window.appState.notes = data.notes;
                if (data.userVouchers) window.appState.userVouchers = data.userVouchers;
                if (data.lastReadingPosition) window.appState.lastReadingPosition = data.lastReadingPosition;

                if (typeof window.saveState === 'function') window.saveState();
            });
            console.log("🔥 Real-time cloud sync listener active");
        } catch (err) {
            console.warn("Cloud sync listener error:", err);
        }
    };
})();
