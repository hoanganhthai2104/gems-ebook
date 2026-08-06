# GEMS Medical E-Reader - UI/UX & Mobile Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 2 UI/UX enhancements by defining Liquid Glass design system utility classes in `css/components/theme.css`, applying micro-interaction touch states, enforcing strict mobile container boundaries (`overflow-x-hidden`, `pb-safe`), and refining modal/toolbar ergonomics across all app views.

**Architecture:** 
- Extend `css/components/theme.css` with `.glass-card-premium`, `.glass-modal-backdrop`, `.touch-active-scale`, `.safe-bottom-pad`, `.no-scrollbar`, `.overflow-touch`.
- Update `index.html` elements with new CSS utility classes for premium visual feedback and responsive mobile layouts.

**Tech Stack:** Vanilla CSS3, Tailwind CSS (CDN), HTML5, Vanilla JavaScript.

## Global Constraints

- **Git Push Policy**: Do NOT stage, commit, or push unless explicitly requested by user in spoken words.
- **Strict Scope of Work**: Edit only target CSS/HTML files; keep core JS logic untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Add Glassmorphism & Mobile Utility Tokens to `css/components/theme.css`

**Files:**
- Modify: `css/components/theme.css`

**Interfaces:**
- Consumes: CSS3 backdrop filters & transforms
- Produces: Utility classes `.glass-card-premium`, `.glass-modal-backdrop`, `.touch-active-scale`, `.safe-bottom-pad`, `.no-scrollbar`, `.overflow-touch`

- [ ] **Step 1: Append new utility classes to `css/components/theme.css`**

```css
/* Glassmorphism & Mobile Touch Enhancements */
.glass-card-premium {
    background: rgba(255, 255, 255, 0.82) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.45) !important;
    box-shadow: 0 10px 30px -5px rgba(0, 40, 80, 0.08) !important;
}

body.dark .glass-card-premium {
    background: rgba(15, 23, 42, 0.82) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4) !important;
}

.glass-modal-backdrop {
    background: rgba(15, 23, 42, 0.65) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
}

.touch-active-scale {
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out !important;
}

.touch-active-scale:active {
    transform: scale(0.97) !important;
}

.safe-bottom-pad {
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem) !important;
}

.no-scrollbar::-webkit-scrollbar {
    display: none !important;
}

.no-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
}

.overflow-touch {
    -webkit-overflow-scrolling: touch !important;
}
```

- [ ] **Step 2: Verify `css/components/theme.css` syntax**

Check file contains no invalid CSS syntax.

---

### Task 2: Apply Glass Tokens & Touch States to `index.html` UI Panels

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `.glass-card-premium`, `.touch-active-scale`, `.safe-bottom-pad`
- Produces: Enhanced visual elements across Home, Library, Reader, Shop, Profile

- [ ] **Step 1: Apply `.glass-card-premium` and `.touch-active-scale` to Home & Library widgets**
- [ ] **Step 2: Apply `.safe-bottom-pad` to main scroll containers**

---

### Task 3: Enforce Mobile Container Bounds & Prevent Horizontal Overflow

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: View panel containers (`.view-panel`)
- Produces: Strictly bounded mobile layouts (`overflow-x-hidden`)

- [ ] **Step 1: Verify all `.view-panel` elements have `overflow-x-hidden` and `w-full`**

---

### Task 4: Audit & Verify Reader Modal & Toolbar Z-Index Ergonomics

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `#reader-note-modal`, `#selection-toolbar`
- Produces: Verified `z-[300]` modal priority and toolbar animation

- [ ] **Step 1: Ensure `#reader-note-modal` contains `z-[300]` and `.glass-modal-backdrop`**
- [ ] **Step 2: Ensure `#selection-toolbar` has smooth transition and high z-index (`z-[250]`)**

---

### Task 5: End-to-End Functional & Layout Verification

**Files:**
- All application files

- [ ] **Step 1: Start local node server (`node server.js`)**
- [ ] **Step 2: Run syntax checks across all modules**
