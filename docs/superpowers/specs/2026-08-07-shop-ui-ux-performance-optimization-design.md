# GEMS Shop - UI/UX & Performance Optimization Architecture Design

- **Date**: 2026-08-07
- **Status**: Approved
- **Scope**: Shop Module Performance, GPU Compositor Isolation, Touch Latency & Glassmorphism Optimization

---

## 1. Overview & Problem Statement

The **GEMS Shop** (Cửa hàng / Đổi thưởng GEMS Xu) section provides digital vouchers, medical book physical editions, daily quests, and instant reward redemption.

Currently, the Shop section contains 16+ nested sub-panel views (`#view-shop-product-detail`, `#view-shop-cart`, `#view-shop-checkout`, `#view-shop-xtra`, `#view-shop-mall`, `#view-shop-flashsale`, etc.) rendered inside `index.html`. 

Heavy nested `backdrop-blur` filters, complex box shadows, and stacked absolute layers cause GPU render bottlenecks, leading to:
1. Frame drops (lag) during fast vertical scrolling.
2. Latency/perceived delay when tapping bottom navigation or opening product detail modals.
3. Unoptimized asset decoding during image grid rendering.

---

## 2. Technical Architecture & Performance Enhancements

### 2.1 CSS GPU Layer Containment & Paint Isolation (`css/components/theme.css`)
1. **Content Visibility & Containment**:
   - Apply `content-visibility: auto; contain-intrinsic-size: 1px 500px;` and `contain: layout style paint;` to all Shop scroll containers (`#shop-product-detail-content`, `#shop-cart-items-container`, `#shop-checkout-scroll-container`, `#view-shop-xtra-scroll`, `#view-shop-mall-scroll`).
   - Browser skips rendering off-screen DOM nodes, isolating repaints to visible viewport areas.

2. **GPU Compositing Layer (`.gpu-layer`)**:
   - Add `.gpu-layer { transform: translate3d(0,0,0); will-change: transform, opacity; }` to all Shop modal drawers (`#view-shop-product-detail`, `#view-shop-cart`, `#shop-variant-drawer`, `#view-checkout-voucher-selector`).
   - Ensures slide/fade animations execute directly on the GPU thread at 60fps.

3. **Glassmorphism Token Optimization**:
   - Replace repeating inline `backdrop-blur` on child product cards with hardware-light translucent background tokens (`background: rgba(255, 255, 255, 0.92)` in light mode, `rgba(15, 23, 42, 0.92)` in dark mode).
   - Retain full `backdrop-blur-md` for top-level floating modals only.

---

### 2.2 Instant Touch Feedback & RAF Modal Openers (`js/modules/shop.js`)
1. **0ms Touch Latency**:
   - Enforce active touch scaling (`.touch-active-scale` / `active:scale-95`) on all Shop buttons and card items.
2. **Animation Frame Scheduling (`requestAnimationFrame`)**:
   - Wrap modal visibility toggles (`openShopProductDetail`, `openShopCart`, `closeShopProductDetail`, `closeShopCart`) in `requestAnimationFrame` to ensure zero layout thrashing and smooth transition timing.

---

### 2.3 Async Image Loading & Performance Attributes (`index.html`)
1. **Lazy Image Loading**:
   - Add `loading="lazy"` and `decoding="async"` attributes to all product card images, campaign banners, and brand logos within Shop views.

---

## 3. Verification & Compliance Criteria

- **Scrolling Performance**: Target 60fps continuous scrolling across Shop tabs without frame stutter.
- **Touch Responsiveness**: Instant visual feedback (< 16ms) upon tapping any Shop button or product item.
- **UI/UX Integrity**: Maintain 100% of liquid glass aesthetics and responsive mobile container rules (`overflow-x-hidden`, `pb-safe`).
- **Vietnamese Text & UTF-8**: Zero diacritic corruption across all shop product titles and voucher descriptions.
