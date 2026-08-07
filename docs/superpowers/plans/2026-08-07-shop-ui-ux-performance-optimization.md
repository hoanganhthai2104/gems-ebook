# GEMS Shop UI/UX Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate scrolling stutter and modal opening latency in the Shop section by introducing CSS hardware-accelerated layer containment (`content-visibility: auto`, `.gpu-layer`), instant touch scaling, and asynchronous image decoding.

**Architecture:** 
- Add GPU layer isolation & containment utility classes to `css/components/theme.css`.
- Update `js/modules/shop.js` to schedule modal visibility toggles using `requestAnimationFrame`.
- Add `loading="lazy"` and `decoding="async"` attributes to images in `index.html`.

**Tech Stack:** Vanilla CSS3, Vanilla JavaScript (ES6+), HTML5, Node.js (`server.js`).

## Global Constraints

- **Git Push Policy & Localhost First**: Run on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target CSS, JS module, and HTML files; keep core reader & app state untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Add GPU Layer Containment & Scroll Optimization Tokens in `css/components/theme.css`

**Files:**
- Modify: `css/components/theme.css`

**Interfaces:**
- Consumes: CSS3 `content-visibility`, `contain`, `will-change`
- Produces: Utility classes `.shop-scroll-container`, `.gpu-layer`, `.shop-card-light`

- [ ] **Step 1: Append GPU performance utility tokens to `css/components/theme.css`**

```css
/* GEMS Shop GPU Performance & Layer Containment */
.shop-scroll-container {
    content-visibility: auto !important;
    contain-intrinsic-size: 1px 500px !important;
    contain: layout style paint !important;
    -webkit-overflow-scrolling: touch !important;
}

.gpu-layer {
    transform: translate3d(0, 0, 0) !important;
    will-change: transform, opacity !important;
}

.shop-card-light {
    background: rgba(255, 255, 255, 0.92) !important;
    border: 1px solid rgba(229, 231, 235, 0.8) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04) !important;
}

body.dark .shop-card-light {
    background: rgba(15, 23, 42, 0.92) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3) !important;
}
```

- [ ] **Step 2: Verify `css/components/theme.css` syntax**

Ensure no syntax errors in CSS.

---

### Task 2: Refine Shop Modal Animations with `requestAnimationFrame` in `js/modules/shop.js`

**Files:**
- Modify: `js/modules/shop.js`

**Interfaces:**
- Consumes: DOM visibility toggles
- Produces: Smooth 60fps RAF scheduled `openShopProductDetail`, `openShopCart`, `closeShopProductDetail`, `closeShopCart`

- [ ] **Step 1: Wrap modal toggle logic in `requestAnimationFrame` inside `js/modules/shop.js`**

```javascript
    function openShopProductDetail(productId) {
        if (window.appState) {
            window.appState.activeShopProduct = productId;
        }
        const view = document.getElementById('view-shop-product-detail');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeShopProductDetail() {
        const view = document.getElementById('view-shop-product-detail');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.add('hidden');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function openShopCart() {
        const view = document.getElementById('view-shop-cart');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }

    function closeShopCart() {
        const view = document.getElementById('view-shop-cart');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.add('hidden');
            });
        }
        if (typeof updateBottomNavVisibility === 'function') {
            updateBottomNavVisibility();
        }
    }
```

- [ ] **Step 2: Verify `js/modules/shop.js` syntax using node CLI**

Run: `node -c js/modules/shop.js`
Expected: Exit code 0.

---

### Task 3: Attach Performance Classes & Async Image Attributes in `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `.shop-scroll-container`, `.gpu-layer`, `loading="lazy"`, `decoding="async"`
- Produces: Optimized Shop scroll containers and image elements

- [ ] **Step 1: Add `.shop-scroll-container` class to Shop scrollable containers**
- [ ] **Step 2: Add `loading="lazy" decoding="async"` to Shop image tags**

---

### Task 4: End-to-End Functional Verification & Localhost Check

**Files:**
- All application files & `server.js`

- [ ] **Step 1: Run syntax check across JS modules (`node -c js/modules/*.js`)**
- [ ] **Step 2: Verify application loads and runs on `http://localhost:8081`**
