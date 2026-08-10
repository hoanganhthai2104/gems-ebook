# GEMS Ebook - Admin Dashboard UI/UX Redesign & Enterprise Re-Architecture Spec

- **Date**: 2026-08-10
- **Status**: Approved
- **Scope**: Sidebar 5-Module Navigation Restructuring, Table Live Search & Filtering, 10-Item Pagination Engine, and Interactive Action Modals (CRUD)

---

## 1. Overview & Objectives

The **Admin Dashboard UI/UX Redesign** transforms `admin.html` into a logical, high-performance enterprise management dashboard modeled after Shopee Seller Center and Shopify Enterprise.

By restructuring the sidebar into 5 distinct modules, adding table live search and category/status filtering, implementing client-side 10-item pagination for 135+ products, and introducing interactive CRUD modals for products, books, orders, and user permissions, the admin panel becomes completely intuitive and effortless to use.

---

## 2. Component Architecture & Detailed Design

### 2.1 5-Module Sidebar & Navigation Hierarchy (`admin.html`)
- **Module 1: Dashboard Overview (`#tab-overview`)**:
  - Top 4 stat summary cards (Total Users, Total Orders, Total Books, Seller Store Profile).
  - Revenue analytics line chart powered by Chart.js.
- **Module 2: E-Commerce Store Management (`#tab-commerce`)**:
  - Subtab 1: Orders Management (`#subpanel-commerce-orders`).
  - Subtab 2: Products Catalog (`#subpanel-commerce-products`) displaying 135+ products.
  - Subtab 3: Marketing Vouchers (`#subpanel-commerce-promotions`).
- **Module 3: Knowledge & Books Catalog (`#tab-knowledge`)**:
  - Subtab 1: Medical Books (`#subpanel-knowledge-books`) displaying all 30 books.
  - Subtab 2: Medical Dictionary (`#subpanel-knowledge-dict`) displaying all 30 terms.
- **Module 4: User & Role Management (`#tab-users`)**:
  - User accounts table, membership tiers (VIP, Pro, Free), and role assignment (Admin, Author, Partner, User).
- **Module 5: Seller Profile & Financials (`#tab-seller`)**:
  - THÁI NHÂN SÂM seller profile info, store logo uploader, payout wallet, and Excel/CSV report export button.

### 2.2 Live Search, Category/Status Filtering & 10-Item Pagination Engine
- **Table Control Header**:
  - Instant text filter input on every table (`oninput="filterTable(tableName, this.value)"`).
  - Category / Status select filter dropdowns (`onchange="filterCategory(tableName, this.value)"`).
  - Quick action buttons (`+ Thêm Sản Phẩm Mới`, `+ Thêm Sách Mới`).
- **10-Item Pagination Engine**:
  - Paginate long dataset tables (135+ products, 30 books, 30 dict terms, 25 orders) into 10 rows per page.
  - Render pagination controls: `[‹ Trang trước]  Trang P / N  [Trang sau ›]`.

### 2.3 Interactive Action Modals & CRUD Logic
- **`#modal-add-edit-product`**: Form to create or edit shop products (Title, Category, Price, Original Price, Image URL, Stock, Status).
- **`#modal-add-edit-book`**: Form to create or edit medical books (Book ID, Title, Category, Author, Cover URL).
- **`#modal-order-detail`**: Inspection popup showing order items, customer info, payment method, and one-click status update (`Đang xử lý` $\rightarrow$ `Đang giao` $\rightarrow$ `Hoàn thành`).
- **`#modal-user-perm`**: User role & tier assignment modal.

---

## 3. Quality Assurance & Integration Rules

1. **UTF-8 & Vietnamese Text Integrity**: Preserve all Vietnamese characters, store names, and diacritics verbatim.
2. **Firestore Cloud Sync Integration**: All CRUD operations update `adminCache` and persist directly to Firebase Firestore collections (`shop_products`, `books`, `orders`, `users`, `dictionary`).
3. **Responsive UI Compliance**: Smooth layout on mobile, tablet, and desktop viewports.
