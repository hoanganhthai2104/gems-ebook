# GEMS Ebook - Flagship Ecosystem Upgrade Spec

- **Date**: 2026-08-10
- **Status**: Approved
- **Scope**: GEMS AI Medical Copilot, Immersive Audio Book Player & Ambient Soundscapes, Enterprise 1-Click Excel Export, and Live Notification Center

---

## 1. Overview & Objectives

The **Flagship Ecosystem Upgrade** delivers 4 world-class features to the GEMS Ebook & Admin platform:
1. **GEMS AI Medical Copilot**: An interactive AI reading assistant panel providing chapter summaries, medical jargon explanations, automatic 5-question flashcard quiz generation, and clinical analysis.
2. **Immersive Audio Book Player & Ambient Soundscapes**: A Web Speech API voice reader engine for Vietnamese textbooks paired with 3 ambient focus audio tracks (Lab White Noise, Soft Rain, Alpha 432Hz Waves).
3. **Enterprise 1-Click Excel/CSV Export Engine**: UTF-8 BOM (`\uFEFF`) encoded CSV spreadsheet export for Products (135+ items), Orders (25 items), and Books (30 titles).
4. **Live Notification & Alert Center**: Header notification bell with live red ping badge and slide-out alert drawer.

---

## 2. Component Architecture & Detailed Specifications

### 2.1 GEMS AI Medical Copilot (`index_v3.html`, `js/modules/reader.js`)
- **Floating Action Button `#gems-ai-fab`**: Positioned at bottom-right of `#view-reader` with Glassmorphism gradient styling.
- **Drawer Panel `#gems-ai-drawer`**: Width 380px, z-index 250.
- **Prompt Action Chips**:
  - 💡 *Tóm tắt chương này*
  - 📖 *Giải thích thuật ngữ y khoa*
  - ❓ *Tạo 5 câu trắc nghiệm*
  - 🩺 *Phân tích ca lâm sàng*
- **Streaming Response Simulation**: Typewriter effect rendering AI answers with clinical disclaimer and interactive quiz flashcard generation.

### 2.2 Immersive Audio Book Player & Ambient Soundscapes (`index_v3.html`, `js/modules/reader.js`)
- **Audio Control Bar `#reader-audio-bar`**: Fixed header bar inside `#view-reader`.
- **Speech Synthesizer**: Uses `window.speechSynthesis` configured for Vietnamese (`vi-VN`) text-to-speech with speed selection (0.75x, 1.0x, 1.25x, 1.5x, 2.0x).
- **Ambient Soundscapes Engine**: Web Audio API / HTML5 Audio synthesizer toggling 3 focus tracks: Lab Noise, Rain Sound, Alpha 432Hz Waves.

### 2.3 Enterprise 1-Click Excel/CSV Export Engine (`admin.html`)
- **Export Buttons**: `[📥 Xuất Báo Cáo Excel]` buttons above Products, Orders, and Books tables.
- **BOM Encoding**: Prepends `\uFEFF` byte order mark to UTF-8 CSV strings so Microsoft Excel opens Vietnamese text cleanly without character corruption.

### 2.4 Live Notification Center (`admin.html`)
- **Notification Bell Icon `#admin-notif-bell`**: Located in admin header with red pulse badge `badge-ping`.
- **Alert Drawer `#admin-notif-drawer`**: Slide-out panel listing new order alerts, VIP subscriber events, and system broadcasts.

---

## 3. Implementation Plan Requirements

All code changes will strictly preserve UTF-8 Vietnamese encoding and follow Localhost verification protocols.
