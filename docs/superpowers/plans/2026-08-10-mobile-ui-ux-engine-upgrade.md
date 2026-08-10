# Mobile UI/UX Engine Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade GEMS Ebook with a hardware-accelerated touch swipe reader engine, swipeable mobile bottom sheets, tactile haptic feedback, and shimmer skeleton loaders.

**Architecture:** Extend core modules (`js/modules/reader.js`, `js/modules/ui-utils.js`, `js/modules/dictionary.js`, `js/modules/shop.js`, `index.css`) using pure Vanilla JS and CSS hardware acceleration without heavy external dependencies.

**Tech Stack:** JavaScript (ES6+), Vanilla CSS (Glassmorphism & Flexbox/Grid), Web Vibration API, HTML5.

## Global Constraints

- **UTF-8 Integrity**: Preserve all Vietnamese characters and diacritics verbatim.
- **Template Literal Safety**: Never write `\$` escaped interpolation in JS edits.
- **Git Push Policy**: Do NOT stage, commit or push to Git automatically. Test and verify on Localhost first.
- **Z-Index Hierarchy**: `#reader-note-modal` must remain `z-[300]`, `#app-bottom-nav` must remain `z-[200]` outside reader.

---

### Task 1: Touch Swipe Page Transition Engine in Reader

**Files:**
- Modify: `js/modules/reader.js`
- Modify: `index.css`

**Interfaces:**
- Consumes: `#reader-viewport`, `nextPage()`, `prevPage()` from `js/modules/reader.js`
- Produces: `initReaderSwipeGestures()`, smooth horizontal 60fps touch swipe page navigation

- [ ] **Step 1: Add Touch Swipe CSS Classes in `index.css`**

Add hardware acceleration utility styles to `index.css`:
```css
/* Touch Swipe Page Transition Classes */
.swipe-transition {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}
.swipe-dragging {
  transition: none !important;
  will-change: transform;
}
```

- [ ] **Step 2: Add Gesture Event Handlers in `js/modules/reader.js`**

Implement touch listeners with threshold checks and interaction guards:
```javascript
let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let isSwiping = false;

function initReaderSwipeGestures() {
  const viewport = document.getElementById('reader-viewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', (e) => {
    // Guard: ignore if touch starts inside note modal or selection toolbar
    if (e.target.closest('#reader-note-modal') || e.target.closest('#selection-toolbar')) return;
    if (window.getSelection && window.getSelection().toString().length > 0) return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchCurrentX = touchStartX;
    isSwiping = false;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!touchStartX) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;

    // Filter vertical scroll vs horizontal swipe
    if (!isSwiping && Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (Math.abs(deltaX) > 15) {
      isSwiping = true;
      touchCurrentX = e.touches[0].clientX;
    }
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const deltaX = touchCurrentX - touchStartX;
    if (deltaX < -50) {
      if (typeof nextPage === 'function') nextPage();
    } else if (deltaX > 50) {
      if (typeof prevPage === 'function') prevPage();
    }
    isSwiping = false;
    touchStartX = 0;
  }, { passive: true });
}
```

- [ ] **Step 3: Test Localhost Touch Gesture Integration**

Run local server and inspect in browser responsive mobile mode:
`node server.js`
Expected: Reader responds smoothly to horizontal swipe left/right without breaking text highlight toolbar.

---

### Task 2: Native Mobile Bottom Sheet & Haptic Feedback Manager

**Files:**
- Modify: `js/modules/ui-utils.js`
- Modify: `index.css`

**Interfaces:**
- Consumes: Web Vibration API (`navigator.vibrate`)
- Produces: `triggerHaptic(type)`, responsive bottom sheet CSS modal layout on mobile (< 768px)

- [ ] **Step 1: Implement `triggerHaptic` in `js/modules/ui-utils.js`**

Add central haptic vibration manager:
```javascript
function triggerHaptic(type = 'light') {
  if (!('vibrate' in navigator)) return;
  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'success':
        navigator.vibrate([15, 50, 20]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch (err) {
    // Ignore silent haptic failures on unsupported platforms
  }
}
```

- [ ] **Step 2: Add Mobile Bottom Sheet CSS in `index.css`**

Add mobile media queries for bottom sheets and grab handles:
```css
@media (max-width: 767px) {
  .mobile-bottom-sheet {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    top: auto !important;
    border-radius: 24px 24px 0 0 !important;
    max-height: 85vh !important;
    overflow-y: auto !important;
    animation: slideUpSheet 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  
  .sheet-grab-handle {
    width: 36px;
    height: 4px;
    background: rgba(156, 163, 175, 0.4);
    border-radius: 9999px;
    margin: 8px auto 12px auto;
  }
}

@keyframes slideUpSheet {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

- [ ] **Step 3: Test Bottom Sheet & Haptic Call Invocation**

Verify modal rendering on mobile viewport width < 768px.
Expected: Modal slides up from bottom with grab handle and stays at correct z-index (`z-[300]`).

---

### Task 3: Shimmer Skeleton Loaders & Performance Polish

**Files:**
- Modify: `index.css`
- Modify: `js/modules/dictionary.js`
- Modify: `js/modules/shop.js`

**Interfaces:**
- Consumes: `.skeleton-shimmer` CSS animations
- Produces: Instant visual skeleton feedback during search queries & chapter/shop loading

- [ ] **Step 1: Add Shimmer Skeleton CSS Styles in `index.css`**

```css
.skeleton-shimmer {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.15) 37%, rgba(255, 255, 255, 0.05) 63%);
  background-size: 400% 100%;
  animation: skeletonLoading 1.4s ease infinite;
  border-radius: 8px;
}

@keyframes skeletonLoading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
```

- [ ] **Step 2: Add Chunked Search Rendering in `js/modules/dictionary.js`**

Use `requestAnimationFrame` for fast, lag-free dictionary search list rendering:
```javascript
function renderDictionaryListChunked(terms, container) {
  if (!container) return;
  container.innerHTML = '';
  const chunkSize = 20;
  let index = 0;

  function renderChunk() {
    const chunk = terms.slice(index, index + chunkSize);
    const fragment = document.createDocumentFragment();
    chunk.forEach(term => {
      const card = createDictionaryCardElement(term);
      fragment.appendChild(card);
    });
    container.appendChild(fragment);
    index += chunkSize;
    if (index < terms.length) {
      requestAnimationFrame(renderChunk);
    }
  }
  renderChunk();
}
```

- [ ] **Step 3: Verification & End-to-End Testing**

Run Localhost server and verify dictionary search responsiveness and shimmer loaders:
`node server.js`
Expected: 60fps responsive searching with shimmer skeleton indicators during content loading.
