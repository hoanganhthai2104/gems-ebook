# Design Specification: Luxury Medical E-Reader Typography & Page Layout Redesign

**Date**: 2026-08-10  
**Status**: Approved by User  
**Target File**: `index.html` (CSS & HTML Page Layout Generator), `js/modules/reader.js` (Theme & Typography Controls)

---

## 1. Overview & Goal

Transform the GEMS E-Reader reading experience from a plain text viewport into an **Ultra-Premium Published Medical Book Aesthetic (Royal Serif / Luxury Sepia)**.

The redesign focuses on:
1. **Typography Excellence**: Google Font `Lora` for body text & `Playfair Display` for chapter headings, with high-legibility line-height (1.85) and optical kerning.
2. **Editorial Polish (Drop Caps & Callout Glassmorphism Cards)**:
   - First letter of introductory chapters styled with 3-line tall Drop Cap (`text-5xl font-serif text-brand-blue float-left mr-3 mt-1 leading-none font-bold`).
   - Core medical tenets, pharmacology highlights, and clinical warnings styled as Glassmorphism Callout Cards with left accent borders.
3. **Running Editorial Headers & Page Numbering**:
   - Header: `CHƯƠNG • [TÊN CHƯƠNG Y HỌC]` in subtle muted uppercase.
   - Footer: `— Trang X / Y —` with smooth reading progress bar.
4. **Luxury Reading Themes Palette**:
   - **Sepia Royal (Cổ điển)**: Background `#FDFBF7`, Text `#2C2A29`, Accent `#854D0E`.
   - **Classic Book (Giấy Trắng)**: Background `#FAFAFA`, Text `#1E293B`, Accent `#004275`.
   - **Night Reader (Đêm Y Khoa)**: Background `#0F172A`, Text `#CBD5E1`, Accent `#38BDF8`.

---

## 2. Component Specifications

### 2.1 Google Fonts Import
Inject Google Fonts `Lora:ital,wght@0,400..700;1,400..700` and `Playfair Display:wght@600;700;800` into `index.html` head section.

### 2.2 Reader CSS Stylesheet Additions
Define utility CSS classes in `index.html` `<style>`:
- `.font-book-body`: `font-family: 'Lora', Georgia, serif; line-height: 1.85; text-align: justify;`
- `.font-book-heading`: `font-family: 'Playfair Display', Georgia, serif; letter-spacing: -0.01em;`
- `.drop-cap::first-letter`: `font-family: 'Playfair Display', Georgia, serif; float: left; font-size: 3.2rem; line-height: 0.8; padding-top: 4px; padding-right: 10px; color: #004275; font-weight: 800;`
- `.medical-callout-card`: `background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(8px); border-left: 4px solid #004275; padding: 1.25rem; border-radius: 0.85rem; box-shadow: 0 4px 15px -3px rgba(0,0,0,0.04);`

### 2.3 Book Chapter Layout Generator Updates
Update `bookChapters` definitions in `index.html` to format paragraph content with:
- `drop-cap` wrapper for Chapter 1 / Section 1 intro paragraph.
- Medical callout cards for key medical takeaways.
- Sub-headings (`h2`, `h3`) with `font-book-heading text-lg font-bold text-slate-900 border-b border-slate-200/60 pb-2 mt-6 mb-3`.

---

## 3. Verification Plan

1. **Localhost Testing**: Run on `http://localhost:8081`.
2. **Visual Inspection**: Verify page layout across all 5 books (*Triết Lý Y HỌC SỰ SỐNG*, *Cẩm Nang Thảo Dược*, *Chẩn Đoán Y Khoa*, etc.).
3. **Theme Switching**: Confirm seamless theme toggling between Sepia, Classic Book, and Night Mode.
