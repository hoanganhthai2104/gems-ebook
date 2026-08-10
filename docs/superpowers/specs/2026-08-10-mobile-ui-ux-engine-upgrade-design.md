# GEMS Ebook - Mobile UI/UX Engine Upgrade Design

- **Date**: 2026-08-10
- **Status**: Approved
- **Scope**: Touch Swipe Gesture Engine, Mobile Bottom Sheets, Haptic Feedback Manager, Shimmer Skeleton Loaders & Performance Polish

---

## 1. Overview & Objectives

The **Mobile UI/UX Engine Upgrade** enhances the GEMS Medical E-Reader application with a native mobile app experience on smartphone and tablet devices. 

By integrating hardware-accelerated touch gestures, swipeable bottom sheets, tactile haptic feedback, and shimmer skeleton loaders without external heavy library dependencies, the application delivers a fluid 60fps native feel while preserving existing reader notes, dictionary lookup, and gamification functionality.

---

## 2. Component Architecture & Detailed Design

### 2.1 Touch Swipe Page Transition Engine (`js/modules/reader.js`, `index.css`)
- **Native Gesture Listeners**: Register `touchstart`, `touchmove`, and `touchend` events on `#reader-viewport`.
- **Gesture Filtering**:
  - Vertical movement threshold ($\Delta Y > 30\text{px}$) preserves normal vertical document scrolling.
  - Horizontal swipe threshold ($\Delta X > 50\text{px}$) triggers 60fps page turn animation (`transform: translateX(...)` with `will-change: transform`).
- **Interaction Guards**: Gesture initiation is guarded when touch originates inside `#reader-note-modal`, `#selection-toolbar`, or during text selection handle dragging.

### 2.2 Native Mobile Bottom Sheets (`js/modules/ui-utils.js`, `index.css`)
- **Responsive Layout Adaptation** (`@media (max-width: 767px)`):
  - Modals (`#reader-note-modal`, `#view-dict-term`, quest claim popups) adapt into bottom sheets anchored at screen bottom (`border-radius: 24px 24px 0 0`).
  - Render a top grab handle (`width: 36px`, `height: 4px`).
  - Support swipe-down-to-dismiss gesture ($\Delta Y_{\text{down}} > 80\text{px}$).
- **Z-Index Hierarchy Preservation**: Maintain `#reader-note-modal` at `z-[300]` (strictly above `#app-bottom-nav` at `z-[200]` outside reader view).

### 2.3 Tactile Haptic Feedback Manager (`js/modules/ui-utils.js`)
- **Centralized Helper**: `triggerHaptic(type)`
  - `light`: `navigator.vibrate(10)` (Button clicks, font size adjustments).
  - `medium`: `navigator.vibrate(25)` (Bookmark toggle, saving note/dictionary term).
  - `success`: `navigator.vibrate([15, 50, 20])` (Daily quest claim, GEMS Xu shop item purchase, quiz completion).
- **Graceful Fallback**: Safely check `if ('vibrate' in navigator)` so desktop browsers operate silently.

### 2.4 Shimmer Skeleton Loaders & Performance Optimization (`js/modules/dictionary.js`, `js/modules/shop.js`, `index.css`)
- **Shimmer Glass Placeholders**: `.skeleton-shimmer` CSS animation for seamless data loading states during chapter transitions, dictionary search rendering, and shop catalog loading.
- **Render Polish**: Chunked rendering using `requestAnimationFrame` for 1,000+ term dictionary queries; passive scroll listeners (`{ passive: true }`) for smooth scrolling.
- **Dynamic Status Bar Tinting**: Sync `<meta name="theme-color">` with active reader theme (Light, Dark, Sepia).

---

## 3. Risk Mitigation & Quality Assurance

1. **UTF-8 & Vietnamese Text Integrity**: All diacritics and text strings remain intact.
2. **Template Literal Safety**: No escaped `\$` characters in dynamic JavaScript modifications.
3. **No Breaking Changes**: Existing reader text selection, note taking modal, and bottom navigation bar behavior remain 100% compliant with project rules in `AGENTS.md`.
