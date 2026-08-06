# GEMS Medical E-Reader - Firebase Cloud Sync, Audio, PWA & Admin Dashboard Spec

- **Date**: 2026-08-06
- **Status**: Approved
- **Scope**: Firebase Firestore Cloud Integration (`gems-ebook`), Admin Dashboard Sync (`admin.html`), Audio Player Upgrades (`audio.js`), PWA Service Worker Cache (`sw.js`), GEMS Xu Shop (`shop.js`).

---

## 1. Objectives

Establish complete real-time sync with **Firebase Firestore** (`gems-ebook`) across both the main E-Reader app (`index.html`) and the Admin Dashboard (`admin.html`). Upgrade the Audiobook & Podcast Player (`audio.js`), enable full PWA offline reading capabilities (`sw.js`), and polish the GEMS Xu shop & voucher system (`shop.js`).

---

## 2. Firebase Firestore Cloud & Admin Dashboard Integration

1. **Firestore Real-time Collections (`gems-ebook`)**:
   - `books`: Medical book catalog, covers, descriptions, categories.
   - `chapters`: Chapter titles, HTML content, reading times, quiz questions.
   - `dictionary`: Medical terms, categories, clinical definitions.
   - `users`: User profiles, streak days, GEMS Xu coin balances, bookmarks, notes.
   - `orders`: Shop orders and redeemed vouchers.

2. **Admin Dashboard Synchronization (`admin.html`)**:
   - `admin.html` queries and edits `books`, `chapters`, `dictionary`, `orders` directly via Firebase Firestore SDK.
   - Real-time updates push modified book details, new dictionary terms, and order statuses instantly to `index.html`.

3. **Offline Fallback & Cloud Queue**:
   - When online: Real-time sync with Firebase Firestore.
   - When offline: Reads from `localStorage` & PWA cache, queuing user changes (`notes`, `bookmarks`) to sync automatically upon reconnection.

---

## 3. Audio Player & Podcast Enhancements (`js/modules/audio.js`)

1. **Playback Speed Control**:
   - Toggles: `1.0x`, `1.25x`, `1.5x`, `2.0x` adjusting `audioEl.playbackRate`.
2. **Sleep Timer**:
   - Timers: 15 min, 30 min, 45 min, End of Chapter auto-pause.
3. **Synchronized Transcript**:
   - Highlights and auto-scrolls transcript paragraphs in sync with current audio playback time.

---

## 4. PWA Offline Caching & GEMS Xu Shop System (`sw.js` & `js/modules/shop.js`)

1. **Service Worker (`sw.js`)**:
   - Cache version `gems-pwa-cache-v82`.
   - Caches `js/modules/state.js`, `data.js`, `quiz.js`, `ui-utils.js`, `theme.js`, `dictionary.js`, `audio.js`, `nav.js`, `reader.js`, `shop.js`, `app.js`.
2. **Shop & Voucher System**:
   - Voucher code input modal, order detail modal, and coin balance updates.
