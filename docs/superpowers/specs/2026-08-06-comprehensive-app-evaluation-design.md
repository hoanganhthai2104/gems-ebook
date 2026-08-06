# GEMS Medical E-Reader - Comprehensive Application Evaluation & Architecture Design

- **Date**: 2026-08-06
- **Status**: Approved
- **Scope**: Codebase Modularization, UI/UX & Mobile Compliance, Reader & Gamification Enhancement

---

## 1. Overview & Objectives

The **GEMS Medical E-Reader** application is a single-page web application providing an online medical e-reading experience, interactive medical terms dictionary, chapter quizzes, daily quests, and GEMS Xu gamification.

Currently, `index.html` has grown monolithic (~29,600 lines), containing inline CSS and ~17,000 lines of inline JavaScript logic. To ensure stability, maintainability, and scalability for upcoming UI/UX and feature enhancements, this project will follow a strict 3-phase modularization and upgrade path.

---

## 2. Phase 1: Codebase Modularization & Refactoring

### 2.1 Monolith Extraction Plan
1. **`index.html` Clean-up**:
   - Extract inline JavaScript into standalone modular files inside `js/modules/`.
   - Reduce `index.html` size down to clean semantic HTML (< 2,000 lines).
   - Ensure script loading tags maintain strict dependency order.

2. **Module Breakdown**:
   - **`js/modules/state.js`**: Global `appState`, user session, streak counter, coin balances, event listeners.
   - **`js/modules/data.js`**: Static book catalog, chapter contents, dictionary items, quiz questions, audio lessons.
   - **`js/modules/quiz.js`**: Quiz engine, answer validation, medical explanations, score calculation, confetti trigger.
   - **`js/modules/ui-utils.js`**: Reusable toast notifications, modal helpers, back-to-top scroll handlers, `preventGhostClick`.
   - **`js/modules/theme.js`**: E-reader and app theme management (Light, Sepia, Dark).
   - **Existing Module Enhancements**:
     - `js/modules/nav.js`: Contextual navigation bar visibility & z-index management.
     - `js/modules/reader.js`: Full-screen immersive reader, page turning, text selection/highlighting, note modals.
     - `js/modules/dictionary.js`: Dictionary search, specialized categories, term detail popup.
     - `js/modules/audio.js`: Medical podcast/audio player.
     - `js/modules/shop.js`: Daily quests, reward redemption, GEMS Xu system.

---

## 3. Phase 2: UI/UX & Mobile Compliance Standards

### 3.1 Z-Index & Navigation Bar Rules (`AGENTS.md` Alignment)
- **E-Reader Fullscreen Mode (`#view-reader`)**:
  - The bottom navigation bar (`#app-bottom-nav`) MUST be hidden when reader view is active.
  - Upon closing the reader view, `#app-bottom-nav` MUST be restored and set to `z-[200]` so it sits above sub-panels (`z-[60]` to `z-[95]`).
- **Reader Note & Highlight Modal (`#reader-note-modal`)**:
  - MUST use `z-[300]` (or minimum `z-[250]`) so it renders strictly above `#app-bottom-nav` (`z-[200]`).
- **Selection Toolbar & Highlight Guard**:
  - Floating toolbar (`#selection-toolbar`) dismissed only when clicking outside reader viewport.
  - Clicking inside `#reader-note-modal` must NOT clear `selectedText` or `selectedRange`.
- **Medical Dictionary Term Detail (`#view-dict-term`)**:
  - `#view-dictionary` MUST be made visible before `#view-dict-term` is opened when called from external views.

### 3.2 Liquid Glass Aesthetics & Responsive Layouts
- Maintain modern glassmorphism (backdrop-blur, border glow, soft gradients).
- Ensure mobile touch targets, scrollable containers, and safe-area paddings operate smoothly across iOS Safari and Android Chrome.

---

## 4. Phase 3: Reader, Dictionary & Gamification Refinement

1. **E-Reader Performance**:
   - Smooth page transitions and font size / line height controls.
   - Persistent read positions saved in `localStorage` & synced with Firebase Firestore.
2. **Medical Dictionary**:
   - Instant search filtering with debounce.
   - Specialized category tags (Internal Medicine, Surgery, Pharmacology, Genetics, Anatomy).
3. **Gamification & Quizzes**:
   - Chapter completion rewards + Daily Streak counter.
   - GEMS Xu shop item unlocking and reward tracking.

---

## 5. Risk Mitigation & Integrity Rules

- **Zero-Downtime Refactoring**: All existing functional features must remain 100% operational throughout the extraction.
- **UTF-8 & Vietnamese Text Integrity**: Preserve all Vietnamese characters, diacritical marks, and translations without corruption.
- **JavaScript Template Literal Backslash Safety**: Strictly avoid escaping `$` as `\${...}` when generating or replacing code inside JavaScript files.
