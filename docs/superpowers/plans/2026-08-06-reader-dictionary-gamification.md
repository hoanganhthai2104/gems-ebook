# GEMS Medical E-Reader - Reader, Dictionary & Gamification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 3 features including instant in-reader medical glossary popups, real-time reading progress bar with auto-resume state persistence, and interactive quiz explanations with GEMS Xu rewards.

**Architecture:** 
- Enhance `js/modules/dictionary.js` & `js/modules/reader.js` to handle instant term popup lookups.
- Enhance `js/modules/reader.js` & `js/modules/state.js` for scroll progress calculation and state auto-persistence.
- Enhance `js/modules/quiz.js` & `js/modules/shop.js` for quiz answer feedback, medical rationale, and GEMS Xu reward triggers.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3, LocalStorage, Canvas-Confetti.

## Global Constraints

- **Git Push Policy & Localhost First**: Run on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target module files; keep existing features untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Implement In-Reader Instant Glossary Popup

**Files:**
- Modify: `js/modules/dictionary.js`
- Modify: `js/modules/reader.js`

**Interfaces:**
- Consumes: `medical-glossary-term` click events, `window.DICTIONARY_DATA`
- Produces: `window.showGlossaryPopup(term, event)`

- [ ] **Step 1: Add `window.showGlossaryPopup` in `js/modules/dictionary.js`**

```javascript
window.showGlossaryPopup = function(termTitle, event) {
    let popup = document.getElementById('reader-glossary-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'reader-glossary-popup';
        popup.className = 'fixed z-[350] glass-card-premium p-4 rounded-2xl max-w-xs shadow-2xl transition-all duration-300 text-slate-800 dark:text-white select-none hidden';
        document.body.appendChild(popup);
    }

    const dictItem = (window.DICTIONARY_DATA || []).find(d => d.term.toLowerCase().includes(termTitle.toLowerCase())) || {
        term: termTitle,
        category: "Thuật ngữ Y khoa",
        definition: "Thuật ngữ chuyên ngành y khoa dùng trong chẩn đoán và điều trị lâm sàng."
    };

    popup.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">${dictItem.category}</span>
            <button onclick="document.getElementById('reader-glossary-popup').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 text-sm font-bold">&times;</button>
        </div>
        <h4 class="font-bold text-sm mb-1">${dictItem.term}</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${dictItem.definition}</p>
    `;

    if (event) {
        const rect = event.target.getBoundingClientRect();
        popup.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - 150)}px`;
        popup.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - 300))}px`;
    }

    popup.classList.remove('hidden');
};
```

- [ ] **Step 2: Attach click listeners in `js/modules/reader.js` for `.medical-glossary-term`**

---

### Task 2: Implement Reading Progress Bar & Auto-Resume Persistence

**Files:**
- Modify: `js/modules/reader.js`
- Modify: `js/modules/state.js`

**Interfaces:**
- Consumes: `reader-viewport` scroll events
- Produces: `window.updateReadingProgress()`, auto-saved `appState.lastReadingPosition`

- [ ] **Step 1: Add scroll progress calculation and auto-persistence in `js/modules/reader.js`**

```javascript
window.updateReadingProgress = function() {
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
            bookId: window.appState.currentBookId,
            chapter: window.appState.currentChapter,
            percentage: percentage,
            scrollTop: scrollTop
        };
        if (typeof window.saveState === 'function') {
            window.saveState();
        }
    }
};
```

---

### Task 3: Implement Quiz Answer Explanations & GEMS Xu Gamification

**Files:**
- Modify: `js/modules/quiz.js`
- Modify: `js/modules/shop.js`

**Interfaces:**
- Consumes: `QUIZ_DATA`, `appState.userCoins`
- Produces: Enhanced `submitAnswer()` with medical explanation card

- [ ] **Step 1: Upgrade `submitAnswer()` in `js/modules/quiz.js` to render medical explanation**

---

### Task 4: End-to-End Functional Verification & Localhost Check

**Files:**
- All JS modules & `server.js`

- [ ] **Step 1: Run JS syntax check across all modules**
- [ ] **Step 2: Confirm server runs on http://localhost:8081**
