# Kindle E-Ink Luxury Medical Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate GEMS E-Reader reading experience to mimic high-end Kindle E-Ink paper devices (Kindle Warm Paper `#F5F2EB`, Royal Serif `Lora` & `Playfair Display`, Drop Caps, and Glassmorphism Callout Cards).

**Architecture:** Update `index.html` head imports and CSS styles for Kindle E-Ink themes, drop caps, and editorial typography, then format `bookChapters` content with drop caps, medical callout cards, and running headers.

**Tech Stack:** HTML5, CSS3 (Vanilla CSS + Tailwind utilities), JavaScript (ES6), Google Fonts (`Lora`, `Playfair Display`).

## Global Constraints

- Preserve all Vietnamese diacritics verbatim.
- Strictly adhere to `AGENTS.md`: `#app-bottom-nav` must remain hidden inside `#view-reader` and restored upon close.
- Localhost verification on `http://localhost:8081`.

---

### Task 1: Inject Google Fonts & Kindle E-Ink CSS Stylesheet

**Files:**
- Modify: `index.html:1-80`

**Interfaces:**
- Consumes: Google Fonts API (`Lora` & `Playfair Display`)
- Produces: `.kindle-paper-theme`, `.font-book-body`, `.font-book-heading`, `.drop-cap::first-letter`, `.medical-callout-card`

- [ ] **Step 1: Inject Google Fonts Lora and Playfair Display into `<head>`**

Add Google Fonts link tags to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,600..900;1,600..900&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Define Kindle E-Ink CSS Classes in `<style>`**

Add the following CSS rules to `<style>` in `index.html`:
```css
/* Kindle E-Ink Paper Aesthetic */
.kindle-paper-theme {
    background-color: #F5F2EB !important;
    color: #1A1918 !important;
}
.font-book-body {
    font-family: 'Lora', Georgia, serif;
    line-height: 1.85;
    text-align: justify;
    font-size: 0.938rem; /* 15px */
    letter-spacing: -0.003em;
}
.font-book-heading {
    font-family: 'Playfair Display', Georgia, serif;
    letter-spacing: -0.015em;
}
.drop-cap::first-letter {
    font-family: 'Playfair Display', Georgia, serif;
    float: left;
    font-size: 3.4rem;
    line-height: 0.8;
    padding-top: 4px;
    padding-right: 12px;
    color: #004275;
    font-weight: 800;
}
.medical-callout-card {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(8px);
    border-left: 4px solid #004275;
    padding: 1.1rem;
    border-radius: 0.85rem;
    box-shadow: 0 4px 15px -3px rgba(0,0,0,0.04);
    margin: 1.25rem 0;
}
```

- [ ] **Step 3: Test Localhost syntax**

Verify page loads cleanly at `http://localhost:8081`.

---

### Task 2: Polish Chapter Page Formatting with Drop Caps & Medical Callout Cards

**Files:**
- Modify: `index.html:12900-13100` (`bookChapters` object)

**Interfaces:**
- Consumes: `bookChapters` definitions
- Produces: HTML formatted pages with `.drop-cap`, `.medical-callout-card`, `.font-book-body`, and `.font-book-heading`

- [ ] **Step 1: Update `bookChapters` content strings in `index.html`**

Ensure `trietly_mo_dau`, `trietly_5nen`, `trietly_3tru`, `tamthat`, `nhansam`, `tongquan` use the new Kindle editorial CSS classes (`drop-cap`, `medical-callout-card`, `font-book-body`, `font-book-heading`).

- [ ] **Step 2: Add Running Header to `loadChapter`**

Update `#reader-header` to display: `CHƯƠNG • [TÊN CHƯƠNG Y HỌC]` in Kindle E-Ink font.

---

### Task 3: Localhost Verification & User Walkthrough

**Files:**
- Verify: `http://localhost:8081`

- [ ] **Step 1: Test Kindle Warm Paper theme across reading sections**
- [ ] **Step 2: Confirm smooth line height, drop caps, and callout cards**
- [ ] **Step 3: Create Walkthrough summary**
