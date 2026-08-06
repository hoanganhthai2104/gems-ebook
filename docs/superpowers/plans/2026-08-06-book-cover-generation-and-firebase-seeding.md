# GEMS Medical E-Reader - Book Cover AI Generation & Firebase Seeding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 3D glassmorphic AI book covers using `generate_image`, update `data/books.json`, `data/chapters.json`, `data/dictionary.json`, and upload them directly to Firebase Firestore Cloud (`gems-ebook`) via `node scripts/seed_firebase.js` to render live on `http://localhost:8081`.

**Architecture:** 
- Generate high-res book covers into `covers/`.
- Update static catalogs in `data/`.
- Execute `node scripts/seed_firebase.js` to populate Firebase Firestore cloud database.

**Tech Stack:** `generate_image` AI tool, Node.js, Firebase Firestore REST API, Vanilla JavaScript.

## Global Constraints

- **Git Push Policy & Localhost First**: Serve live on Localhost (`http://localhost:8081`). Do NOT stage, commit, or push to Git/GitHub without explicit user spoken instruction.
- **Strict Scope of Work**: Edit only target asset and data files; keep existing UI/UX rules untouched.
- **Vietnamese Language Integrity**: Maintain UTF-8 encoding and diacritics.

---

### Task 1: Generate AI Book Covers in `covers/`

**Files:**
- Create: `covers/trietly_yhss.png`
- Create: `covers/nuoc_va_su_song.png`
- Create: `covers/than_hoc_yhss.png`
- Create: `covers/tam_hoc_chua_lanh.png`
- Create: `covers/y_hoc_dinh_duong.png`
- Create: `covers/y_hoc_du_phong.png`

- [ ] **Step 1: Generate `covers/trietly_yhss.png`**
- [ ] **Step 2: Generate `covers/nuoc_va_su_song.png`**
- [ ] **Step 3: Generate `covers/than_hoc_yhss.png`**
- [ ] **Step 4: Generate `covers/tam_hoc_chua_lanh.png`**
- [ ] **Step 5: Generate `covers/y_hoc_dinh_duong.png`**
- [ ] **Step 6: Generate `covers/y_hoc_du_phong.png`**

---

### Task 2: Structure Books, Chapters, and Dictionary Catalogs in `data/`

**Files:**
- Modify: `data/books.json`
- Modify: `data/chapters.json`
- Modify: `data/dictionary.json`

- [ ] **Step 1: Add new books to `data/books.json` with generated cover paths**
- [ ] **Step 2: Add chapter contents to `data/chapters.json`**
- [ ] **Step 3: Add medical terms to `data/dictionary.json`**

---

### Task 3: Seed Cloud Data to Firebase Firestore (`gems-ebook`)

**Files:**
- Execute: `scripts/seed_firebase.js`

- [ ] **Step 1: Run `node scripts/seed_firebase.js` to upload books, chapters, and terms to Firebase Firestore**

---

### Task 4: End-to-End Verification & Localhost Check

**Files:**
- All application files

- [ ] **Step 1: Run JS syntax checks**
- [ ] **Step 2: Confirm live books render on http://localhost:8081**
