# GEMS Shop - UI/UX Aesthetics & Feature Upgrade Architecture Design

- **Date**: 2026-08-07
- **Status**: Approved
- **Scope**: GEMS Xu Animated Balance, Flash Sale Real-time Countdown, Instant Voucher Wallet, Order Tracking Timeline

---

## 1. Overview & Objectives

The **GEMS Shop** section is being upgraded with interactive gamification visual elements, real-time Flash Sale deal timers, an instant Voucher Wallet system (`appState.userVouchers`), and an Order Status Tracking Timeline.

---

## 2. Component Design & Technical Specifications

### 2.1 Animated GEMS Xu Header & Balance Badge (`js/modules/shop.js`, `index.html`)
1. **Visual Elements**:
   - Header badge displaying user's current GEMS Xu balance with glowing gold border and coin icon.
2. **Animation**:
   - `window.animateCoins(targetAmount)` function in `js/modules/shop.js` smoothly increments/decrements number display with CSS pulse effect.

### 2.2 Flash Sale Real-Time Countdown & Progress Bar (`js/modules/shop.js`, `index.html`)
1. **Timer Engine**:
   - `startFlashSaleTimer()` updates `#flash-sale-timer-hours`, `#flash-sale-timer-minutes`, `#flash-sale-timer-seconds` every 1000ms.
2. **Deal Stock Progress**:
   - Dynamic progress bar showing percentage of flash sale items claimed (e.g., 85% claimed).

### 2.3 Instant Voucher Wallet & Auto-Apply (`js/modules/shop.js`, `js/modules/state.js`)
1. **Wallet Storage**:
   - `appState.userVouchers` array stored in `localStorage` (`gems_user_vouchers`).
2. **Claim Action**:
   - `claimVoucher(voucherId)` saves voucher, changes button to "Đã lưu", and triggers toast notification.
3. **Checkout Auto-Apply**:
   - In Checkout view, automatically select the highest value discount voucher available in `appState.userVouchers`.

### 2.4 Order Tracking Timeline Modal (`index.html`, `js/modules/shop.js`)
1. **Visual Timeline**:
   - Order history cards display step progress: *Xác nhận ➔ Đóng gói ➔ Đang giao ➔ Complete*.
2. **Firestore Sync**:
   - Save order details to Firestore collection `orders`.

---

## 3. Verification Criteria

- **Xu Animation**: Smooth number transition when coins change.
- **Timer Accuracy**: Real-time 1s interval countdown without drift.
- **Voucher Persistence**: Claimed vouchers remain saved across page refreshes.
- **UTF-8 & Vietnamese Text**: Maintain exact diacritics and formatting across all shop views.
