### Task 1: Extract State Management into `js/modules/state.js`

**Files:**
- Create: `js/modules/state.js`
- Target: `d:\Desktop\EBOOK GEMS\js\modules\state.js`

**Interfaces:**
- Consumes: `localStorage`
- Produces: `window.appState`, `window.saveState()`, `window.loadState()`

**Requirements:**
1. Create `js/modules/state.js` to manage `window.appState` globally.
2. Initialize `window.appState` with:
   - `shopPopupShown: false`
   - `isLoggedIn: localStorage.getItem('gems_logged_in') === 'true'`
   - `streakDays: parseInt(localStorage.getItem('gems_streak') || '15', 10)`
   - `userCoins: parseInt(localStorage.getItem('gems_coins') || '250', 10)`
   - `currentBook: null`
   - `currentChapterIndex: 0`
   - `bookmarks: JSON.parse(localStorage.getItem('gems_bookmarks') || '[]')`
   - `highlights: JSON.parse(localStorage.getItem('gems_highlights') || '[]')`
   - `notes: JSON.parse(localStorage.getItem('gems_notes') || '[]')`
3. Provide `window.saveState()` function to sync state changes to `localStorage`.
4. Provide `window.loadState()` to reload state from `localStorage`.
5. Verify syntax with `node -c js/modules/state.js`.
