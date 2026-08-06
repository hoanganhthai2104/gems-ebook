# GEMS Medical E-Reader - Reader, Dictionary & Gamification Refinement Design Spec

- **Date**: 2026-08-06
- **Status**: Approved
- **Scope**: In-Reader Instant Glossary Lookup, Reading Progress & Persistence, Quiz Explanations & GEMS Xu Gamification

---

## 1. Objectives

Enhance the core reading and learning features of **GEMS Medical E-Reader**. This includes introducing instant in-reader glossary popups for medical terms, tracking real-time reading progress with auto-resume state persistence, providing medical explanations in end-of-chapter quizzes, and seamlessly rewarding users with GEMS Xu and streak badges.

---

## 2. In-Reader Instant Glossary Lookup (`js/modules/dictionary.js` & `js/modules/reader.js`)

1. **Medical Glossary Term Markups**:
   - Highlight medical terms in chapter content with CSS class `medical-glossary-term` (subtle dashed underline).
2. **Instant Popup Component**:
   - Clicking a term displays a compact `.glass-card-premium` popup directly above/below the clicked element.
   - Shows term title, category badge, and concise medical definition without switching views.

---

## 3. Reading Progress & Auto-Resume Persistence (`js/modules/reader.js` & `js/modules/state.js`)

1. **Reading Progress Indicator**:
   - Real-time scroll percentage calculated dynamically: `Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)`.
   - Displayed in reader header/footer as a progress bar and percentage pill.
2. **Auto-Resume Persistence**:
   - Saves `currentBookId`, `currentChapter`, and `scrollPercentage` to `window.appState` and `localStorage` on page scroll.
   - Restores exact book, chapter, and scroll position when launching or reopening the app.

---

## 4. Chapter Quiz Explanations & GEMS Xu Gamification (`js/modules/quiz.js` & `js/modules/shop.js`)

1. **Interactive Quiz Engine**:
   - Displays medical rationale/explanation (`explanation`) immediately after user selects an answer option.
   - Color codes option buttons (emerald for correct, rose for incorrect).
2. **GEMS Xu Rewards & Streak Counter**:
   - Successful quiz completions add +10 GEMS Xu to `window.appState.userCoins`.
   - Triggers celebratory `confetti` animation and toast notification.
   - Automatically increments daily streak counter when reading goals are met.
