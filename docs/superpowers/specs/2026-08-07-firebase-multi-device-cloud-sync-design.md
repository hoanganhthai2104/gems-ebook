# GEMS Ebook - Firebase Real-time Multi-device Cloud Sync Architecture Design

- **Date**: 2026-08-07
- **Status**: Approved
- **Scope**: Firebase Firestore Cloud Sync, Real-time Snapshot Listener, Auto-Resume Reading Position, Cross-Device Bookmarks & Notes Sync

---

## 1. Overview & Objectives

The **GEMS Medical E-Reader** application enables multi-device real-time sync via Firebase Firestore (`gems-ebook`).

Reading positions, bookmarks, text highlights, notes, user GEMS Xu coins, daily streaks, and claimed vouchers sync seamlessly between mobile phones, tablets, and desktop browsers without manual refresh.

---

## 2. Technical Architecture & Interfaces

### 2.1 User Identity & Storage Management (`js/modules/state.js`)
1. **User Identity Assignment**:
   - `window.appState.userId` initialized from `localStorage.getItem('gems_user_id')`.
   - If unassigned, generate a stable unique ID (`gems_user_default_01`).
2. **Debounced Cloud Save (`window.saveStateCloud()`)**:
   - Debounce delay: 1500ms.
   - Saves payload `{ streakDays, userCoins, bookmarks, highlights, notes, userVouchers, lastReadingPosition, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }` to `db.collection('user_sessions').doc(userId)`.

### 2.2 Real-time Snapshot Listener (`js/modules/state.js`)
1. **Firestore `onSnapshot` Binding**:
   - `window.initCloudSyncListener()` binds `db.collection('user_sessions').doc(userId).onSnapshot(doc => ...)` on app launch.
2. **Remote Delta Application**:
   - When remote changes occur from another device, update local `appState` and `localStorage`.
   - If `lastReadingPosition` changes while reader view is open, prompt toast: *"☁️ Đã tự động đồng bộ vị trí đọc từ thiết bị khác"*.

---

## 3. Verification Criteria

- **Real-time Synchronization**: State changes on Device A propagate to Device B within 2 seconds.
- **Offline Resilience**: Offline changes fall back to `localStorage` and auto-sync when network reconnects.
- **UTF-8 Integrity**: Zero Vietnamese text diacritic corruption in synced bookmarks or notes.
