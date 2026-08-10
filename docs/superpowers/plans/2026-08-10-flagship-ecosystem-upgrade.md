# Flagship Ecosystem Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver 4 world-class flagship features: GEMS AI Medical Copilot, Immersive Audio Book Player & Ambient Soundscapes, Enterprise 1-Click Excel Export, and Live Notification Center.

**Architecture:** Pure Vanilla JS (ES6+), Web Speech API, HTML5 Audio, UTF-8 BOM CSV Exporter, and Tailwind CSS Glassmorphism components.

**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Web Speech API, Firebase Firestore.

## Global Constraints

- **UTF-8 Integrity**: Preserve all Vietnamese diacritics and text verbatim.
- **Template Literal Safety**: Never write `\$` escaped interpolation in JS edits.
- **Git Push Policy**: Do NOT stage, commit or push to Git automatically. Test and verify on Localhost first.

---

### Task 1: Implement GEMS AI Medical Copilot & Interactive Assistant Drawer

**Files:**
- Modify: `index_v3.html`
- Modify: `js/modules/reader.js`

**Interfaces:**
- Consumes: `#view-reader`, current reader chapter text
- Produces: `#gems-ai-fab`, `#gems-ai-drawer`, `askGemsAI(promptType)`

- [ ] **Step 1: Add AI Copilot FAB and Drawer Markup to `index_v3.html`**

Add Floating Action Button `#gems-ai-fab` and Slide-out Drawer `#gems-ai-drawer` inside `#view-reader`:
```html
<!-- GEMS AI COPILOT FAB -->
<button id="gems-ai-fab" onclick="toggleGemsAIDrawer()" class="fixed bottom-24 right-6 z-[250] w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(0,90,156,0.4)] hover:scale-105 active:scale-95 transition-all group">
    <span class="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">auto_awesome</span>
    <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500"></span></span>
</button>

<!-- GEMS AI COPILOT DRAWER -->
<div id="gems-ai-drawer" class="fixed top-0 right-0 bottom-0 w-[380px] max-w-[90vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 z-[300] shadow-2xl flex flex-col translate-x-full transition-transform duration-300">
    <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-500/10 to-indigo-500/10">
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sky-600">auto_awesome</span>
            <div><h3 class="font-black text-sm text-slate-900 dark:text-white">GEMS AI Copilot</h3><p class="text-[10px] text-sky-600 font-bold">Trợ Lý Y Khoa Thông Minh</p></div>
        </div>
        <button onclick="toggleGemsAIDrawer()" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="p-3 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5 bg-slate-50/50 dark:bg-slate-900/50">
        <button onclick="askGemsAI('summary')" class="btn-xs py-1.5 px-3 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-[11px]">💡 Tóm tắt chương</button>
        <button onclick="askGemsAI('dict')" class="btn-xs py-1.5 px-3 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">📖 Thuật ngữ Y khoa</button>
        <button onclick="askGemsAI('quiz')" class="btn-xs py-1.5 px-3 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[11px]">❓ Tạo 5 câu trắc nghiệm</button>
    </div>
    <div id="gems-ai-messages" class="flex-grow p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
        <div class="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900 text-sky-900 dark:text-sky-200">
            Xin chào! Tôi là Trợ Lý AI Y Khoa GEMS. Bạn có thể chọn các lệnh gợi ý phía trên để tóm tắt chương sách hoặc hỏi đáp chuyên môn lâm sàng.
        </div>
    </div>
</div>
```

- [ ] **Step 2: Add AI Copilot Logic in `js/modules/reader.js`**

Implement typewriter effect and flashcard generator in `reader.js`.

---

### Task 2: Implement Audio Book Player & Ambient Soundscapes

**Files:**
- Modify: `index_v3.html`
- Modify: `js/modules/reader.js`

**Interfaces:**
- Consumes: `window.speechSynthesis`, current reader chapter text
- Produces: `#reader-audio-bar`, `toggleSpeechSynthesis()`, `toggleAmbientSound(type)`

- [ ] **Step 1: Add Audio Player Bar Markup in `index_v3.html`**

Add `#reader-audio-bar` inside reader container:
```html
<div id="reader-audio-bar" class="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 flex items-center justify-between gap-3 text-xs">
    <div class="flex items-center gap-2">
        <button onclick="toggleSpeechSynthesis()" id="btn-audio-play" class="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white shadow"><span class="material-symbols-outlined text-sm">play_arrow</span></button>
        <span class="font-bold text-[11px] text-slate-200">Giọng Đọc AI Y Khoa</span>
    </div>
    <div class="flex items-center gap-2">
        <select id="audio-speed" onchange="changeSpeechRate(this.value)" class="bg-slate-800 text-white text-[11px] font-bold rounded-lg px-2 py-1 border border-slate-700">
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
        </select>
        <button onclick="toggleAmbientSound('rain')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Tiếng mưa phòng đọc">🌧️</button>
        <button onclick="toggleAmbientSound('lab')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Tiếng phòng Lab">🧪</button>
    </div>
</div>
```

- [ ] **Step 2: Implement Speech Synthesis & Audio Synthesizer in `reader.js`**

---

### Task 3: Enterprise 1-Click Excel/CSV Export Engine

**Files:**
- Modify: `admin.html`

**Interfaces:**
- Consumes: `adminCache.products`, `adminCache.orders`, `adminCache.books`
- Produces: `exportProductsCSV()`, `exportOrdersCSV()`, `exportBooksCSV()`

- [ ] **Step 1: Implement UTF-8 BOM CSV Exporters in `admin.html`**

```javascript
function downloadCSV(filename, csvData) {
    const blob = new Blob(["\uFEFF" + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportProductsCSV() {
    let csv = "Mã Sản Phẩm,Tên Sản Phẩm GEMS Mall,Danh Mục,Giá Bán (VNĐ),Giá Gốc (VNĐ),Trạng Thái,Đã Bán\n";
    adminCache.products.forEach(p => {
        csv += `"${p.id || ''}","${(p.title || '').replace(/"/g, '""')}","${p.category || ''}",${p.price || 0},${p.originalPrice || 0},"${p.status || 'Đang bán'}","${p.sold || '0+'}"\n`;
    });
    downloadCSV("GEMS_Mall_Products_135_Items.csv", csv);
    showToast("Đã xuất file Excel danh mục 135+ sản phẩm thành công!", "success");
}
```

- [ ] **Step 2: Add Export Buttons to Admin Header Bars**

Add `[📥 Xuất Báo Cáo Excel]` buttons above Products, Orders, and Books tables.

---

### Task 4: Live Notification Center & Real-Time Alert Drawer

**Files:**
- Modify: `admin.html`

**Interfaces:**
- Consumes: System events, order notifications
- Produces: `#admin-notif-bell`, `#admin-notif-drawer`, `toggleAdminNotifDrawer()`

- [ ] **Step 1: Add Notification Bell & Drawer Markup to `admin.html`**

- [ ] **Step 2: Add Notification Feed Logic in JS**

---

### Verification Plan

- Test GEMS AI Copilot drawer in reader: click prompt chips and observe typewriter responses and quiz flashcards.
- Test Audio Player: click play and verify SpeechSynthesis audio output.
- Test Excel Export in Admin: click export button and verify downloaded `.csv` opens with UTF-8 BOM diacritics.
- Test Notification Bell in Admin: click bell icon and inspect live alert drawer.
