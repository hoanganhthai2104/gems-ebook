# Admin Dashboard UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-architect `admin.html` with a 5-module navigation hierarchy, live search and filtering, 10-item pagination engine, and interactive CRUD action modals.

**Architecture:** Pure ES6+ JavaScript & Tailwind CSS implementation in `admin.html` with real-time Firebase Firestore cloud persistence for products, books, orders, users, and dictionary terms.

**Tech Stack:** HTML5, Tailwind CSS, JavaScript (ES6+), Firebase Firestore SDK (compat mode), Chart.js.

## Global Constraints

- **UTF-8 Integrity**: Preserve all Vietnamese strings and store branding verbatim.
- **Template Literal Safety**: Never write `\$` escaped interpolation in JS edits.
- **Git Push Policy**: Do NOT stage, commit or push to Git automatically. Test and verify on Localhost first.

---

### Task 1: Re-architect Sidebar 5-Module Navigation & Page Layout

**Files:**
- Modify: `admin.html:200-500`

**Interfaces:**
- Consumes: `switchTab(tabName)`, `switchSubTab(parentTab, subTab)`
- Produces: 5 distinct primary sidebar modules (Tổng quan, Bán hàng, Tri thức, Người dùng, Hồ sơ người bán)

- [ ] **Step 1: Update Sidebar Navigation Markup in `admin.html`**

Update `#admin-sidebar` navigation items to match 5 clean enterprise modules:
```html
<nav class="flex-grow py-3">
    <div class="nav-item active" id="nav-overview" onclick="switchTab('overview')">
        <span class="material-symbols-outlined">analytics</span>
        <span>1. Bảng Tổng Quan</span>
    </div>
    <div class="nav-item" id="nav-commerce" onclick="switchTab('commerce')">
        <span class="material-symbols-outlined">storefront</span>
        <span>2. Quản Lý Bán Hàng</span>
    </div>
    <div class="nav-item" id="nav-knowledge" onclick="switchTab('knowledge')">
        <span class="material-symbols-outlined">menu_book</span>
        <span>3. Tủ Sách &amp; Tri Thức</span>
    </div>
    <div class="nav-item" id="nav-users" onclick="switchTab('users')">
        <span class="material-symbols-outlined">group</span>
        <span>4. Người Dùng &amp; Quyền</span>
    </div>
    <div class="nav-item" id="nav-seller" onclick="switchTab('seller')">
        <span class="material-symbols-outlined">verified_user</span>
        <span>5. Hồ Sơ Người Bán</span>
    </div>
</nav>
```

- [ ] **Step 2: Update Main Tab Containers in `admin.html`**

Ensure 5 main tab section containers exist: `#tab-overview`, `#tab-commerce`, `#tab-knowledge`, `#tab-users`, `#tab-seller`.

- [ ] **Step 3: Test Navigation Switching on Localhost**

Test clicking sidebar items and subtabs on `http://localhost:8081/admin.html`.
Expected: Smooth 60fps tab switching between all 5 enterprise modules.

---

### Task 2: Live Search, Multi-Filter & 10-Item Pagination Engine

**Files:**
- Modify: `admin.html:510-690`

**Interfaces:**
- Consumes: `adminCache` (products, books, orders, dict, users)
- Produces: `renderPaginatedTable(tableName, items, page, pageSize = 10)`, live search and filter controls

- [ ] **Step 1: Add Table Header Search & Filter Bar Elements**

Place search inputs, category dropdowns, and quick action buttons above `#products-tbody`, `#gems-orders-tbody`, `#books-tbody`, `#dict-tbody`, `#users-tbody`.

- [ ] **Step 2: Implement Pagination & Filter Logic in JS**

Add generic search and pagination helper functions:
```javascript
let tableState = {
    products: { page: 1, query: '', category: 'all' },
    orders: { page: 1, query: '', status: 'all' },
    books: { page: 1, query: '', category: 'all' },
    dict: { page: 1, query: '' },
    users: { page: 1, query: '' }
};

function renderPaginatedTable(type, items, stateKey) {
    const state = tableState[stateKey];
    let filtered = items;

    if (state.query) {
        const q = state.query.toLowerCase();
        filtered = filtered.filter(item => JSON.stringify(item).toLowerCase().includes(q));
    }

    if (state.category && state.category !== 'all') {
        filtered = filtered.filter(item => item.category === state.category);
    }

    const pageSize = 10;
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    state.page = Math.max(1, Math.min(state.page, totalPages));

    const startIndex = (state.page - 1) * pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + pageSize);

    // Update Pagination Bar UI
    const pagEl = document.getElementById(`${stateKey}-pagination`);
    if (pagEl) {
        pagEl.innerHTML = `
            <div class="flex items-center justify-between text-xs text-slate-500 py-3 px-4 border-t border-slate-100">
                <span>Hiển thị ${pageItems.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} trên tổng số ${filtered.length} mục</span>
                <div class="flex items-center gap-1">
                    <button onclick="changePage('${stateKey}', -1)" ${state.page === 1 ? 'disabled class="opacity-40 cursor-not-allowed px-2 py-1"' : 'class="btn-sm btn-edit px-2 py-1"'}>‹ Trang trước</button>
                    <span class="font-extrabold text-slate-700 px-2">Trang ${state.page} / ${totalPages}</span>
                    <button onclick="changePage('${stateKey}', 1)" ${state.page === totalPages ? 'disabled class="opacity-40 cursor-not-allowed px-2 py-1"' : 'class="btn-sm btn-edit px-2 py-1"'}>Trang sau ›</button>
                </div>
            </div>
        `;
    }
    return pageItems;
}
```

- [ ] **Step 3: Verify Pagination & Filter Responsiveness**

Test searching "Littmann" or filtering by category on products table on `http://localhost:8081/admin.html`.
Expected: 10 items per page with instant responsive search and pagination buttons.

---

### Task 3: Interactive Action Modals & Full CRUD Cloud Integration

**Files:**
- Modify: `admin.html`

**Interfaces:**
- Consumes: Firebase Firestore `window.db` collections (`shop_products`, `books`, `orders`, `users`)
- Produces: `openAddProductModal()`, `saveProduct()`, `openOrderDetailModal(orderId)`, `updateOrderStatus(orderId, newStatus)`

- [ ] **Step 1: Add Modals Markup in `admin.html`**

Add `#modal-add-edit-product` and `#modal-order-detail` popups in `admin.html`.

- [ ] **Step 2: Implement Modal Event Handlers & Cloud Persistence**

```javascript
function openAddProductModal(prodId = null) {
    // Fill modal fields for new or existing product
    openModal('modal-add-edit-product');
}

async function saveProduct(e) {
    e.preventDefault();
    const title = document.getElementById('prod-input-title').value;
    const category = document.getElementById('prod-input-category').value;
    const price = Number(document.getElementById('prod-input-price').value);
    const originalPrice = Number(document.getElementById('prod-input-orig-price').value);

    const newProd = { title, category, price, originalPrice, status: "Đang bán" };
    const docId = `prod_gems_${Date.now()}`;
    
    if (window.db) {
        await window.db.collection('shop_products').doc(docId).set(newProd);
    }
    adminCache.products.unshift({ id: docId, ...newProd });
    renderProductsTable();
    closeModal('modal-add-edit-product');
    showToast(`Đã thêm sản phẩm: "${title}" thành công!`, 'success');
}
```

- [ ] **Step 3: End-to-End Verification on Localhost**

Test adding a new product and changing order status on `http://localhost:8081/admin.html`.
Expected: Real-time UI refresh and notification toast on Localhost.
