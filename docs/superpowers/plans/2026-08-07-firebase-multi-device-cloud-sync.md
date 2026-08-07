# GEMS Firebase Multi-device Cloud Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time multi-device cloud synchronization via Firebase Firestore for reading position, bookmarks, notes, highlights, GEMS Xu coins, streaks, and vouchers.

**Architecture:** 
- Enhance `js/modules/state.js` with `window.saveStateCloud()` (debounced) and `window.initCloudSyncListener()` using Firestore `onSnapshot`.
- Update `js/modules/reader.js` to trigger debounced cloud position updates when reading.

**Tech Stack:** Vanilla JavaScript (ES6+), Firebase Firestore Compat SDK, LocalStorage.

## Global Constraints

- **Git Push Policy & Localhost First**: Run on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target JS module files; keep existing UI/UX rules untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Add Cloud Save & Firestore Listener in `js/modules/state.js`

**Files:**
- Modify: `js/modules/state.js`

**Interfaces:**
- Consumes: `window.db` (Firestore)
- Produces: `window.saveStateCloud()`, `window.initCloudSyncListener()`

- [ ] **Step 1: Update `js/modules/state.js` to add Firestore real-time sync and debounced save**

```javascript
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
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
```

- [ ] **Step 2: Verify `js/modules/state.js` syntax**

Run: `node -c js/modules/state.js`
Expected: Exit code 0.

---

### Task 2: Trigger Cloud Sync in `js/modules/reader.js` & App Load

**Files:**
- Modify: `js/modules/reader.js`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `window.saveStateCloud()`, `window.initCloudSyncListener()`
- Produces: Auto-triggered cloud saves on scroll & bookmark/note changes

- [ ] **Step 1: Add `saveStateCloud()` call in `updateReadingProgress` in `js/modules/reader.js`**
- [ ] **Step 2: Add `initCloudSyncListener()` call in `js/app.js` on `DOMContentLoaded`**

---

### Task 3: End-to-End Verification & Localhost Check

**Files:**
- All application files & `server.js`

- [ ] **Step 1: Check syntax across JS modules (`node -c js/modules/*.js`)**
- [ ] **Step 2: Verify server runs on `http://localhost:8081`**
