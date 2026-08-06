# GEMS Medical E-Reader - UI/UX & Mobile Compliance Design Spec

- **Date**: 2026-08-06
- **Status**: Approved
- **Scope**: Liquid Glass Aesthetic Tokens, Micro-Interactions, Mobile Ergonomics & Viewport Optimizations

---

## 1. Objectives

Upgrade the visual presentation, component ergonomics, and mobile responsiveness of the **GEMS Medical E-Reader** app. This design establishes a unified CSS Design System, adds tactile micro-interactions, eliminates horizontal scroll glitches, and ensures pixel-perfect mobile compatibility across iOS Safari and Android Chrome.

---

## 2. CSS Design System Tokens (`css/components/theme.css`)

### 2.1 Glassmorphism Utility Classes
- **`.glass-card-premium`**:
  - `background: rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(20px)`
  - `border: 1px solid rgba(255, 255, 255, 0.45)`
  - Multi-layer elevation shadow: `0 10px 30px -5px rgba(0, 40, 80, 0.08)`
- **`.glass-modal-backdrop`**:
  - `background: rgba(15, 23, 42, 0.65)` with `backdrop-filter: blur(12px)`
  - `z-index: 250` for general modals, `z-index: 300` for `#reader-note-modal`

### 2.2 Mobile Ergonomics & Micro-Interactions
- **`.touch-active-scale`**:
  - Active button feedback: `transform: scale(0.97)` on `:active` with `transition: transform 0.15s ease`.
- **`.safe-bottom-pad`**:
  - `padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem)` to clear floating bottom navigation bar on modern iOS devices.
- **`.no-scrollbar`**:
  - Hide scrollbars across Chrome, Safari, Firefox for clean horizontal carousels.
- **`.overflow-touch`**:
  - `-webkit-overflow-scrolling: touch` for momentum scrolling on WebKit devices.

---

## 3. Viewport & Screen Optimizations

### 3.1 Mobile Container Bounds
- All root view containers (`.view-panel`) enforce `overflow-x: hidden` and `width: 100%`.
- Max-width desktop framing stays constrained within `sm:max-w-[430px]` centered wrapper.

### 3.2 View-Specific Refinements
1. **Home (`#view-home`)**:
   - Streak & GEMS Xu stats widgets enhanced with `.glass-card-premium`.
   - Horizontal book carousels use `.no-scrollbar` and momentum scrolling.
2. **Library (`#view-library`)**:
   - Specialty pill buttons display active state glow (`ring-2 ring-emerald-500`).
   - Instant search input with clear button.
3. **E-Reader (`#view-reader`)**:
   - Fullscreen immersive layout; `#app-bottom-nav` remains hidden inside reader.
   - `#reader-note-modal` stays fixed at `z-[300]` above all layers.
   - Selection toolbar (`#selection-toolbar`) accurately tracks active selection coordinates.
4. **Shop & Profile (`#view-shop`, `#view-profile`)**:
   - Quest completion cards with `.touch-active-scale` interactive claim feedback.
