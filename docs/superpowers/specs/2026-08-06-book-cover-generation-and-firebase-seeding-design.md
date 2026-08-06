# GEMS Medical E-Reader - Book Cover AI Generation & Firebase Seeding Design Spec

- **Date**: 2026-08-06
- **Status**: Approved
- **Scope**: AI Book Cover Generation, Data Structuring (`data/`), Firebase Firestore Cloud Upload (`gems-ebook`), Localhost Integration (`http://localhost:8081`)

---

## 1. Objectives

Create high-resolution 3D glassmorphic book covers for the "Nền Y Học Sự Sống" book series using AI image generation (`generate_image`). Structure the book titles, chapters, and dictionary terms into `data/`, upload them to **Firebase Firestore Cloud** (`gems-ebook`), and render them live on `http://localhost:8081`.

---

## 2. Book Cover AI Generation (`covers/`)

Generated covers with 3D glassmorphism aesthetics, harmonious HSL medical color palettes, and elegant typography:
- `covers/trietly_yhss.png`: Deep navy & gold 3D glass emblem for *Triết Lý Y Học Sự Sống*.
- `covers/nuoc_va_su_song.png`: Ocean hydro-blue 3D water drop & cellular structure for *Nước và Sự Sống*.
- `covers/than_hoc_yhss.png`: Emerald green 3D human anatomy & physical healing for *Thân Học Y Học Sự Sống*.
- `covers/tam_hoc_chua_lanh.png`: Warm amber 3D heart & emotional balance for *Tâm Học và Chữa Lành Cảm Xúc*.
- `covers/y_hoc_dinh_duong.png`: Vibrant botanical green & bio-nutrition for *Y Học Dinh Dưỡng*.
- `covers/y_hoc_du_phong.png`: Cyan & tech-blue 3D shield for *Y Học Dự Phòng và Chăm Sóc Chủ Động*.

---

## 3. Data Structure (`data/`)

1. **`data/books.json`**:
   - Stores book catalog items with title, author, cover path, category, and description.
2. **`data/chapters.json`**:
   - Stores detailed chapter content, reading times, and quiz questions.
3. **`data/dictionary.json`**:
   - Stores medical terms, categories, and clinical definitions.

---

## 4. Firebase Cloud Seeding & Localhost Execution (`scripts/seed_firebase.js`)

- Run `node scripts/seed_firebase.js` to upload `books`, `chapters`, and `dictionary` collections directly to **Firebase Firestore** (`gems-ebook`).
- Call `window.syncCloudData()` in `js/modules/data.js` to serve live books on `http://localhost:8081`.
