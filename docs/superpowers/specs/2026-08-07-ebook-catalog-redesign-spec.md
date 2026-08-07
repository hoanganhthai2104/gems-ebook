# GEMS Ebook - Full Catalog & All Books View Redesign Architecture Design

- **Date**: 2026-08-07
- **Status**: Approved
- **Scope**: Ebook Full Catalog Panel (`#view-all-books-modal`), Category Filtering, View Mode Switching (Grid / List), Instant Book Quick-Actions

---

## 1. Overview & Objectives

The **GEMS Ebook Catalog** screen (`#view-all-books-modal`) replaces simple toast alerts with a dedicated, full-featured E-book Catalog & Library Explorer interface.

Users can browse all 30 medical books, filter by specialization category, toggle between 2-column 3D cover grid and detailed list view, sort by ratings/popularity, and launch reading/audiobook sessions instantly.

---

## 2. Component Design & Technical Specifications

### 2.1 Full Catalog Modal (`#view-all-books-modal` in `index.html`)
1. **Header Navigation**:
   - Title *"Kho Sách Y Khoa GEMS"*, back button, instant search bar (`#catalog-search-input`), and View Mode toggle buttons (Grid icon vs List icon).
2. **Category Pill Selector Bar (`#catalog-category-pills`)**:
   - Floating horizontal filter pills: *Tất cả (30), Nền Y Học Sự Sống, Dược Liệu & Thảo Dược, Giải Phẫu Học, Thần Kinh & Di Truyền, Nội Khoa Lâm Sàng*.
3. **Sort Controls Bar**:
   - Sort dropdown: *Nổi bật nhất*, *Đánh giá cao nhất (4.9⭐)*, *Đọc nhiều nhất*.

### 2.2 Book Card Rendering Engine (`js/modules/data.js` / `js/modules/ui-utils.js`)
1. **Grid Mode (2-Column)**:
   - Displays 3D AI cover thumbnail, rating badge (`4.9★`), book title, author, category badge, and quick bookmark heart button.
2. **List Mode (Detailed Row)**:
   - Horizontal card row with cover thumbnail, full description snippet, chapter count, rating, and direct *"Đọc ngay"* & *"Nghe Audio"* buttons.

### 2.3 Performance & Animations (`css/components/theme.css`)
- Apply `.shop-scroll-container` (`content-visibility: auto`) and `.gpu-layer` for 60fps smooth scrolling across all 30 book cards.

---

## 3. Verification & Compliance Criteria

- **Category Filtering**: Selecting a category pill instantly filters visible book cards without full page reload.
- **View Mode Switcher**: Toggling Grid/List view smoothly transitions layout without broken images or text truncation.
- **UTF-8 & Vietnamese Text**: Preserve exact diacritical marks across all 30 book titles and author descriptions.
