# GEMS Full Ebook Catalog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full-screen E-Book Catalog Modal (`#view-all-books-modal`) with category filtering pills, Grid/List view mode switcher, and instant read/audio action triggers for all 30 medical books.

**Architecture:** 
- Add `#view-all-books-modal` HTML structure to `index.html`.
- Enhance `js/modules/data.js` or `js/modules/ui-utils.js` with `window.openAllBooksCatalog(category)`, `window.renderCatalogBooks()`, and `window.toggleCatalogViewMode(mode)`.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, Vanilla CSS3.

## Global Constraints

- **Git Push Policy & Localhost First**: Run on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target JS modules and HTML files; keep reader & navigation bar rules intact.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Add `#view-all-books-modal` Structure & Grid/List Controls in `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `#view-all-books-modal`, `#catalog-books-grid`, category filter buttons
- Produces: Complete DOM modal markup for Full E-Book Catalog

- [ ] **Step 1: Append `#view-all-books-modal` panel to `index.html`**

```html
<div id="view-all-books-modal" class="absolute inset-0 z-[150] bg-surface text-on-surface flex flex-col overflow-hidden hidden select-none animate-fade-in">
    <header class="glass-header w-full top-0 sticky flex items-center justify-between px-3 py-3 z-50 shrink-0 border-b border-slate-100">
        <button onclick="closeAllBooksCatalog()" class="text-slate-700 hover:bg-slate-100 rounded-full p-2 flex items-center justify-center">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <h1 class="font-sans text-sm font-black tracking-tight text-slate-900 mx-auto text-center truncate">Kho Sách Y Khoa GEMS</h1>
        <div class="flex items-center gap-1">
            <button id="btn-view-grid" onclick="setCatalogViewMode('grid')" class="p-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold"><span class="material-symbols-outlined text-sm">grid_view</span></button>
            <button id="btn-view-list" onclick="setCatalogViewMode('list')" class="p-1.5 rounded-lg text-slate-400 font-bold"><span class="material-symbols-outlined text-sm">view_list</span></button>
        </div>
    </header>

    <div class="bg-surface px-3 py-2 flex gap-2 overflow-x-auto scrollbar-none border-b border-slate-100 shrink-0" id="catalog-category-pills">
        <button onclick="filterCatalogCategory('all')" class="cat-pill active px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shrink-0">Tất cả (30)</button>
        <button onclick="filterCatalogCategory('yhss')" class="cat-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0">Nền Y Học Sự Sống</button>
        <button onclick="filterCatalogCategory('thaoduoc')" class="cat-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0">Dược Liệu & Thảo Dược</button>
        <button onclick="filterCatalogCategory('giaiphau')" class="cat-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0">Giải Phẫu Học</button>
        <button onclick="filterCatalogCategory('thankinh')" class="cat-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0">Thần Kinh & Tâm Học</button>
    </div>

    <div class="flex-grow overflow-y-auto shop-scroll-container p-3 space-y-4" id="catalog-books-container">
        <!-- Rendered books -->
    </div>
</div>
```

---

### Task 2: Implement Catalog Rendering Engine in `js/modules/data.js` or `js/modules/ui-utils.js`

**Files:**
- Modify: `js/modules/data.js`

**Interfaces:**
- Consumes: `window.BOOK_DATA`
- Produces: `window.openAllBooksCatalog(cat)`, `window.closeAllBooksCatalog()`, `window.filterCatalogCategory(cat)`, `window.setCatalogViewMode(mode)`

- [ ] **Step 1: Add catalog state & functions to `js/modules/data.js`**

```javascript
    window.catalogState = {
        category: 'all',
        viewMode: 'grid'
    };

    window.openAllBooksCatalog = function(category = 'all') {
        window.catalogState.category = category;
        const view = document.getElementById('view-all-books-modal');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }
        window.renderCatalogBooks();
    };

    window.closeAllBooksCatalog = function() {
        const view = document.getElementById('view-all-books-modal');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.add('hidden');
            });
        }
    };

    window.filterCatalogCategory = function(category) {
        window.catalogState.category = category;
        document.querySelectorAll('#catalog-category-pills .cat-pill').forEach(btn => {
            btn.className = 'cat-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0';
        });
        if (event && event.target) {
            event.target.className = 'cat-pill active px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shrink-0';
        }
        window.renderCatalogBooks();
    };

    window.setCatalogViewMode = function(mode) {
        window.catalogState.viewMode = mode;
        const btnGrid = document.getElementById('btn-view-grid');
        const btnList = document.getElementById('btn-view-list');
        if (btnGrid) btnGrid.className = mode === 'grid' ? 'p-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold' : 'p-1.5 rounded-lg text-slate-400 font-bold';
        if (btnList) btnList.className = mode === 'list' ? 'p-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold' : 'p-1.5 rounded-lg text-slate-400 font-bold';
        window.renderCatalogBooks();
    };

    window.renderCatalogBooks = function() {
        const container = document.getElementById('catalog-books-container');
        if (!container) return;
        const books = window.BOOK_DATA || [];
        const mode = window.catalogState.viewMode;

        if (mode === 'grid') {
            container.className = 'flex-grow overflow-y-auto shop-scroll-container p-3 grid grid-cols-2 gap-3';
            container.innerHTML = books.map(b => `
                <div onclick="openBookDetails('${b.id}')" class="card-lift bg-white rounded-2xl border border-slate-100 p-2.5 flex flex-col cursor-pointer shadow-sm">
                    <img src="${b.cover || 'covers/cothe.png'}" alt="${b.title}" class="w-full aspect-[2/3] object-cover rounded-xl mb-2 shadow-sm" loading="lazy" decoding="async" />
                    <span class="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-max mb-1">${b.category || 'Y Khoa'}</span>
                    <h4 class="font-bold text-xs text-slate-800 line-clamp-1 leading-snug">${b.title}</h4>
                    <p class="text-[10px] text-slate-400 truncate mt-0.5">${b.author || 'GEMS Academic'}</p>
                </div>
            `).join('');
        } else {
            container.className = 'flex-grow overflow-y-auto shop-scroll-container p-3 space-y-3';
            container.innerHTML = books.map(b => `
                <div onclick="openBookDetails('${b.id}')" class="card-lift bg-white rounded-2xl border border-slate-100 p-3 flex gap-3 cursor-pointer shadow-sm">
                    <img src="${b.cover || 'covers/cothe.png'}" alt="${b.title}" class="w-16 h-24 object-cover rounded-xl shrink-0 shadow-sm" loading="lazy" decoding="async" />
                    <div class="flex-grow flex flex-col justify-between min-w-0">
                        <div>
                            <span class="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">${b.category || 'Y Khoa'}</span>
                            <h4 class="font-bold text-sm text-slate-800 truncate mt-1">${b.title}</h4>
                            <p class="text-xs text-slate-500 truncate mt-0.5">${b.author || 'GEMS Academic'}</p>
                        </div>
                        <div class="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-blue-600">
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">menu_book</span> Đọc ngay</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    };
```

- [ ] **Step 2: Verify `js/modules/data.js` syntax using node CLI**

Run: `node -c js/modules/data.js`
Expected: Exit code 0.

---

### Task 3: Update `index.html` "Xem tất cả" Buttons to Trigger `openAllBooksCatalog()`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `openAllBooksCatalog(category)`
- Produces: Working "Xem tất cả" triggers across all library categories

- [ ] **Step 1: Replace `showToast('Xem tất cả...')` on catalog headers in `index.html` with `openAllBooksCatalog('category')`**

---

### Task 4: End-to-End Verification & Localhost Check

**Files:**
- All application files & `server.js`

- [ ] **Step 1: Run syntax check across JS modules (`node -c js/modules/*.js`)**
- [ ] **Step 2: Confirm server runs on `http://localhost:8081`**
