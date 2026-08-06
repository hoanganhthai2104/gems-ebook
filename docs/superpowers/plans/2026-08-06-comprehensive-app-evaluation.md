# GEMS Medical E-Reader - Application Modularization & UI/UX Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modularize the monolithic ~29.6k line `index.html` by extracting ~17,000 lines of inline JavaScript into clean ES/global modules (`state.js`, `data.js`, `quiz.js`, `ui-utils.js`, `theme.js`), then enforce UI/UX z-index and mobile layout rules without breaking existing functionality.

**Architecture:** 
- Extract inline scripts into `js/modules/` with single-responsibility modules.
- Refactor `index.html` to reference external script modules in strict dependency order.
- Verify and enforce `AGENTS.md` rules (E-reader hides bottom nav; non-reader nav uses `z-[200]`; reader note modal uses `z-[300]`).

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS (CDN), Material Symbols, Node.js (`server.js`).

## Global Constraints

- **Git Push Policy**: Do NOT stage, commit, or push unless explicitly requested by user in spoken words.
- **Strict Scope of Work**: Edit only target files; keep unrelated features untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.
- **JS Backslash Safety**: Never escape `$` as `\${...}` in JS dynamic strings.

---

### Task 1: Extract State Management into `js/modules/state.js`

**Files:**
- Create: `js/modules/state.js`
- Modify: `index.html:12450-12550`

**Interfaces:**
- Consumes: `localStorage`
- Produces: `window.appState`, `window.saveState()`, `window.loadState()`

- [ ] **Step 1: Create `js/modules/state.js`**

```javascript
/* js/modules/state.js - Global App State & Storage Management */
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
    localStorage.setItem('gems_logged_in', window.appState.isLoggedIn);
    localStorage.setItem('gems_streak', window.appState.streakDays);
    localStorage.setItem('gems_coins', window.appState.userCoins);
    localStorage.setItem('gems_bookmarks', JSON.stringify(window.appState.bookmarks));
    localStorage.setItem('gems_highlights', JSON.stringify(window.appState.highlights));
    localStorage.setItem('gems_notes', JSON.stringify(window.appState.notes));
};
```

- [ ] **Step 2: Verify `js/modules/state.js` syntax using node CLI**

Run: `node -c js/modules/state.js`
Expected: Success with exit code 0.

---

### Task 2: Extract Data Catalogs into `js/modules/data.js`

**Files:**
- Create: `js/modules/data.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: Static arrays/objects
- Produces: `window.BOOK_DATA`, `window.DICTIONARY_DATA`, `window.QUIZ_DATA`

- [ ] **Step 1: Create `js/modules/data.js` for Books, Dictionary, and Quiz catalog data**

```javascript
/* js/modules/data.js - Static Data Catalogs */
window.BOOK_DATA = window.BOOK_DATA || [
    {
        id: "cothe",
        title: "Giải Phẫu Người & Cơ Thể Học",
        author: "PGS.TS Nguyễn Văn A",
        cover: "covers/cothe.png",
        category: "Giải Phẫu",
        description: "Tài liệu tra cứu chuyên sâu về cấu trúc cơ thể người..."
    }
];

window.DICTIONARY_DATA = window.DICTIONARY_DATA || [
    {
        id: "term-01",
        term: "Kháng Thể Monoclonal",
        category: "Dược Lý",
        definition: "Loại kháng thể được sản xuất từ một dòng tế bào duy nhất..."
    }
];

window.QUIZ_DATA = window.QUIZ_DATA || {};
```

- [ ] **Step 2: Verify `js/modules/data.js` syntax**

Run: `node -c js/modules/data.js`
Expected: Success with exit code 0.

---

### Task 3: Extract Quiz Engine into `js/modules/quiz.js`

**Files:**
- Create: `js/modules/quiz.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `window.QUIZ_DATA`, `canvas-confetti`
- Produces: `window.startQuiz(bookId, chapterId)`, `window.submitAnswer(optionIndex)`, `window.finishQuiz()`

- [ ] **Step 1: Create `js/modules/quiz.js`**

```javascript
/* js/modules/quiz.js - Interactive Quiz Engine */
window.currentQuizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    userAnswers: []
};

window.startQuiz = function(bookId, chapterId) {
    const questions = (window.QUIZ_DATA && window.QUIZ_DATA[chapterId]) || [];
    window.currentQuizState.questions = questions;
    window.currentQuizState.currentIndex = 0;
    window.currentQuizState.score = 0;
    window.renderQuizQuestion();
};

window.renderQuizQuestion = function() {
    // Render current question in DOM
};
```

- [ ] **Step 2: Verify `js/modules/quiz.js` syntax**

Run: `node -c js/modules/quiz.js`
Expected: Success with exit code 0.

---

### Task 4: Extract UI Utilities into `js/modules/ui-utils.js`

**Files:**
- Create: `js/modules/ui-utils.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: DOM elements
- Produces: `window.showToast(message, type)`, `window.preventGhostClick()`, `window.initScrollHandlers()`

- [ ] **Step 1: Create `js/modules/ui-utils.js`**

```javascript
/* js/modules/ui-utils.js - Toast, Scroll & Modal Helpers */
window.showToast = function(msg, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type} px-4 py-2 rounded-lg shadow-lg text-white font-medium mb-2 transition-all duration-300`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

function createToastContainer() {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'fixed top-5 right-5 z-[9999] flex flex-col space-y-2 pointer-events-none';
    document.body.appendChild(el);
    return el;
}

window.preventGhostClick = function() {
    if (typeof isSwitchingTab !== 'undefined' && isSwitchingTab) return;
    const blocker = document.getElementById('ghost-click-blocker');
    if (blocker) {
        blocker.classList.remove('hidden');
        setTimeout(() => blocker.classList.add('hidden'), 350);
    }
};
```

- [ ] **Step 2: Verify `js/modules/ui-utils.js` syntax**

Run: `node -c js/modules/ui-utils.js`
Expected: Success with exit code 0.

---

### Task 5: Extract Theme Switcher into `js/modules/theme.js`

**Files:**
- Create: `js/modules/theme.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `localStorage`
- Produces: `window.setTheme(themeName)`, `window.initTheme()`

- [ ] **Step 1: Create `js/modules/theme.js`**

```javascript
/* js/modules/theme.js - E-reader & Application Theme Controller */
window.setTheme = function(themeName) {
    const readerEl = document.getElementById('view-reader');
    if (!readerEl) return;
    readerEl.classList.remove('theme-white', 'theme-sepia', 'theme-dark');
    readerEl.classList.add(`theme-${themeName}`);
    localStorage.setItem('gems_reader_theme', themeName);
};

window.initTheme = function() {
    const saved = localStorage.getItem('gems_reader_theme') || 'white';
    window.setTheme(saved);
};
```

- [ ] **Step 2: Verify `js/modules/theme.js` syntax**

Run: `node -c js/modules/theme.js`
Expected: Success with exit code 0.

---

### Task 6: Refactor `index.html` to Load Extracted Modules

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `<script src="js/modules/*.js">` tags in `<head>` and `<body>`
- Produces: Streamlined `index.html`

- [ ] **Step 1: Add extracted script tags to `index.html` head/body**

```html
<script src="js/modules/state.js"></script>
<script src="js/modules/data.js"></script>
<script src="js/modules/ui-utils.js"></script>
<script src="js/modules/theme.js"></script>
<script src="js/modules/quiz.js"></script>
<script src="js/modules/dictionary.js"></script>
<script src="js/modules/audio.js"></script>
<script src="js/modules/nav.js"></script>
<script src="js/modules/reader.js"></script>
<script src="js/modules/shop.js"></script>
<script src="js/app.js"></script>
```

- [ ] **Step 2: Test local node server starts without errors**

Run: `node server.js`
Expected: Server runs on port 8080.

---

### Task 7: UI/UX & Mobile Compliance Auditing

**Files:**
- Modify: `js/modules/nav.js`
- Modify: `js/modules/reader.js`
- Modify: `js/modules/dictionary.js`

**Interfaces:**
- Consumes: DOM Element IDs (`#app-bottom-nav`, `#view-reader`, `#reader-note-modal`, `#view-dict-term`, `#view-dictionary`)
- Produces: Correct Z-Index and visibility state

- [ ] **Step 1: Audit `#app-bottom-nav` visibility when opening/closing `#view-reader`**
  - Verify `#app-bottom-nav` is hidden in reader view.
  - Verify `#app-bottom-nav` uses `z-[200]` in non-reader views.

- [ ] **Step 2: Audit `#reader-note-modal` z-index**
  - Verify `#reader-note-modal` uses `z-[300]`.

- [ ] **Step 3: Audit `#view-dict-term` parent activation**
  - Verify `openDictionary()` is called before `openDictionaryTerm()`.

---

### Task 8: End-to-End Functional Verification

**Files:**
- All application files

- [ ] **Step 1: Start local development server**
Run: `node server.js`

- [ ] **Step 2: Verify page loads cleanly at `http://localhost:8080` without JS console errors**
