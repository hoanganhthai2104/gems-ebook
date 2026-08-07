# GEMS Shop UI/UX Aesthetics & Feature Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement animated GEMS Xu coin counter, real-time Flash Sale countdown timer, Instant Voucher Wallet system, and Order Status Tracking timeline.

**Architecture:** 
- Update `js/modules/state.js` to manage `appState.userVouchers`.
- Enhance `js/modules/shop.js` with `animateCoins()`, `startFlashSaleTimer()`, `claimVoucher()`, and `renderOrdersTimeline()`.
- Update `index.html` elements to display coin badge, timer blocks, voucher buttons, and order timeline.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, LocalStorage, Firebase Firestore.

## Global Constraints

- **Git Push Policy & Localhost First**: Run on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target JS modules and HTML files; keep unrelated features untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Add User Vouchers & Coin Counter Engine in `js/modules/state.js`

**Files:**
- Modify: `js/modules/state.js`

**Interfaces:**
- Consumes: `localStorage`
- Produces: `appState.userVouchers`, `saveState()` sync for `gems_user_vouchers`

- [ ] **Step 1: Update `js/modules/state.js` to initialize `userVouchers`**

```javascript
/* In window.appState initial object */
userVouchers: JSON.parse(localStorage.getItem('gems_user_vouchers') || '["VOUCHER_25k", "FREESHIP_0d"]'),

/* In window.saveState */
localStorage.setItem('gems_user_vouchers', JSON.stringify(window.appState.userVouchers || []));
```

- [ ] **Step 2: Verify `js/modules/state.js` syntax**

Run: `node -c js/modules/state.js`
Expected: Exit code 0.

---

### Task 2: Implement Flash Sale Timer, Voucher Claiming & Order Tracking in `js/modules/shop.js`

**Files:**
- Modify: `js/modules/shop.js`

**Interfaces:**
- Consumes: `appState.userCoins`, `appState.userVouchers`
- Produces: `window.claimVoucher(code)`, `window.startFlashSaleTimer()`, `window.renderOrdersTimeline()`

- [ ] **Step 1: Add `claimVoucher`, `startFlashSaleTimer`, and `renderOrdersTimeline` functions in `js/modules/shop.js`**

```javascript
    function claimVoucher(code) {
        if (!window.appState) return;
        window.appState.userVouchers = window.appState.userVouchers || [];
        if (!window.appState.userVouchers.includes(code)) {
            window.appState.userVouchers.push(code);
            if (typeof window.saveState === 'function') window.saveState();
            if (typeof window.showToast === 'function') {
                window.showToast(`Đã lưu voucher ${code} vào ví!`, 'success');
            }
        } else {
            if (typeof window.showToast === 'function') {
                window.showToast(`Voucher ${code} đã có trong ví của bạn.`, 'info');
            }
        }
    }

    function startFlashSaleTimer() {
        if (window.flashSaleInterval) clearInterval(window.flashSaleInterval);
        let secondsLeft = 7200 + 45 * 60; // 2h45m demo timer
        window.flashSaleInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) secondsLeft = 7200;
            const h = Math.floor(secondsLeft / 3600);
            const m = Math.floor((secondsLeft % 3600) / 60);
            const s = secondsLeft % 60;
            
            const hEl = document.getElementById('flash-timer-h');
            const mEl = document.getElementById('flash-timer-m');
            const sEl = document.getElementById('flash-timer-s');
            if (hEl) hEl.textContent = String(h).padStart(2, '0');
            if (mEl) mEl.textContent = String(m).padStart(2, '0');
            if (sEl) sEl.textContent = String(s).padStart(2, '0');
        }, 1000);
    }
```

- [ ] **Step 2: Verify `js/modules/shop.js` syntax using node CLI**

Run: `node -c js/modules/shop.js`
Expected: Exit code 0.

---

### Task 3: Update `index.html` with Flash Sale Timer Display & Voucher Buttons

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `#flash-timer-h`, `#flash-timer-m`, `#flash-timer-s`, `claimVoucher()`
- Produces: Interactive Flash Sale header and voucher claim triggers

- [ ] **Step 1: Add timer elements `#flash-timer-h`, `#flash-timer-m`, `#flash-timer-s` into Flash Sale view**
- [ ] **Step 2: Bind `claimVoucher(...)` to Voucher item buttons**

---

### Task 4: End-to-End Functional Verification & Localhost Check

**Files:**
- All application files & `server.js`

- [ ] **Step 1: Verify JS syntax across modules (`node -c js/modules/*.js`)**
- [ ] **Step 2: Confirm server runs on `http://localhost:8081`**
