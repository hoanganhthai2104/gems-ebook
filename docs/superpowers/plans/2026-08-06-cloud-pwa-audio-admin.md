# GEMS Medical E-Reader - Firebase Cloud Sync, Admin Dashboard, Audio & PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 4 features including Firebase Firestore cloud data sync across E-Reader (`index.html`) and Admin Dashboard (`admin.html`), speed control & sleep timer for Audio Player (`audio.js`), PWA offline caching (`sw.js`), and GEMS Xu voucher redemption (`shop.js`).

**Architecture:** 
- Enhance `js/modules/data.js` and `admin.html` to sync books, dictionary terms, chapters, and orders with Firebase Firestore (`gems-ebook`).
- Enhance `js/modules/audio.js` with `playbackRate` controls, sleep timer, and transcript syncing.
- Update `sw.js` with module asset caching for offline reading.

**Tech Stack:** Firebase Web SDK (Compat mode), Vanilla JavaScript (ES6+), HTML5, Service Worker API.

## Global Constraints

- **Git Push Policy & Localhost First**: Run on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target module files and `admin.html`; keep existing UI/UX rules untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Integrate Firebase Firestore Sync & Admin Dashboard Sync

**Files:**
- Modify: `js/modules/data.js`
- Modify: `admin.html`

**Interfaces:**
- Consumes: `window.db` (Firebase Firestore instance)
- Produces: `window.syncCloudData()`, real-time admin updates

- [ ] **Step 1: Upgrade `js/modules/data.js` to fetch live collections from Firebase Firestore**

```javascript
window.syncCloudData = async function() {
    if (!window.db) return;
    try {
        const booksSnap = await window.db.collection('books').get();
        if (!booksSnap.empty) {
            const list = [];
            booksSnap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            window.BOOK_DATA = list;
        }

        const dictSnap = await window.db.collection('dictionary').get();
        if (!dictSnap.empty) {
            const list = [];
            dictSnap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            window.DICTIONARY_DATA = list;
        }
        console.log("🔥 Cloud data synced with Firebase Firestore!");
    } catch (err) {
        console.warn("Using offline fallback data:", err);
    }
};
```

- [ ] **Step 2: Ensure `admin.html` connects to `gems-ebook` Firestore collections**

---

### Task 2: Upgrade Audio Player Speed, Sleep Timer & Transcript Sync

**Files:**
- Modify: `js/modules/audio.js`

**Interfaces:**
- Consumes: `<audio>` element
- Produces: `window.setAudioSpeed(speed)`, `window.setAudioSleepTimer(minutes)`

- [ ] **Step 1: Add speed and timer controls in `js/modules/audio.js`**

```javascript
window.setAudioSpeed = function(speed) {
    const audio = document.getElementById('main-audio-player');
    if (audio) {
        audio.playbackRate = speed;
        if (typeof window.showToast === 'function') {
            window.showToast(`Tốc độ phát: ${speed}x`, 'info');
        }
    }
};

window.setAudioSleepTimer = function(minutes) {
    if (window.audioSleepTimeout) clearTimeout(window.audioSleepTimeout);
    window.audioSleepTimeout = setTimeout(() => {
        const audio = document.getElementById('main-audio-player');
        if (audio) audio.pause();
        if (typeof window.showToast === 'function') {
            window.showToast("Đã dừng phát audio theo hẹn giờ", "info");
        }
    }, minutes * 60 * 1000);
    if (typeof window.showToast === 'function') {
        window.showToast(`Đã hẹn giờ tắt audio sau ${minutes} phút`, 'info');
    }
};
```

---

### Task 3: Update PWA Offline Caching & Shop Voucher System

**Files:**
- Modify: `sw.js`
- Modify: `js/modules/shop.js`

**Interfaces:**
- Consumes: Service Worker Cache API
- Produces: `gems-pwa-cache-v82` with all JS module scripts

- [ ] **Step 1: Update `sw.js` cache array with `js/modules/*.js`**

```javascript
const CACHE_NAME = 'gems-pwa-cache-v82';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/components/theme.css',
  '/js/modules/state.js',
  '/js/modules/data.js',
  '/js/modules/ui-utils.js',
  '/js/modules/theme.js',
  '/js/modules/quiz.js',
  '/js/modules/dictionary.js',
  '/js/modules/audio.js',
  '/js/modules/nav.js',
  '/js/modules/reader.js',
  '/js/modules/shop.js',
  '/js/app.js'
];
```

---

### Task 4: End-to-End Verification & Localhost Check

**Files:**
- All application files

- [ ] **Step 1: Run JS syntax check across all 12 modules**
- [ ] **Step 2: Confirm server runs on http://localhost:8081**
