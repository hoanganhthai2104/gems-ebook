#!/usr/bin/env python3
"""
Insert new sections into GEMS index.html WITHOUT touching the existing encoding.
All new Vietnamese text uses HTML numeric entities (pure ASCII) to be encoding-safe.
"""

INPUT_FILE  = r'd:\Desktop\EBOOK GEMS\index.html'
OUTPUT_FILE = r'd:\Desktop\EBOOK GEMS\index.html'

# Read file as raw bytes, do NOT decode
with open(INPUT_FILE, 'rb') as f:
    raw = f.read()

content = raw.decode('latin-1')   # lossless byte->str (no conversion)

# ----------------------------------------------------------------
# Helper: convert a UTF-8 string to HTML numeric entities (ASCII-safe)
# ----------------------------------------------------------------
def to_entities(text):
    result = []
    for ch in text:
        cp = ord(ch)
        if cp > 127:
            result.append(f'&#{cp};')
        else:
            result.append(ch)
    return ''.join(result)

# ----------------------------------------------------------------
# SECTION 1: S&#225;ch N&#243;i  (Audio) — for Library view
# ----------------------------------------------------------------
AUDIO_SECTION = to_entities('''
                                <!-- Section: Sách Nói -->
                                <section class="px-4 pb-6">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-2">
                                            <span class="material-symbols-outlined text-teal-500 text-lg">headphones</span>
                                            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-widest">Sách Nói</h3>
                                        </div>
                                        <span class="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Mới</span>
                                    </div>
                                    <div class="space-y-3">
                                        <!-- Audiobook 1 -->
                                        <div class="flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all p-3 rounded-2xl border border-slate-100 cursor-pointer shadow-[0_2px_8px_rgb(0,0,0,0.02)]" onclick="openAudiobookPlayer()">
                                            <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                                                <div class="gems-book-cover w-full h-full" data-book-id="thaoduoc"></div>
                                            </div>
                                            <div class="flex-grow min-w-0">
                                                <h4 class="text-xs font-bold text-slate-800 truncate">Cẩm nang Thảo dược</h4>
                                                <p class="text-[9px] text-slate-400 mt-0.5">GS. TS. Nguyễn Văn Anh</p>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <span class="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Sách Nói</span>
                                                    <span class="text-[9px] font-medium text-slate-400">45:00</span>
                                                </div>
                                            </div>
                                            <button class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-md shrink-0 active:scale-90 transition-transform">
                                                <span class="material-symbols-outlined text-base filled-icon">play_arrow</span>
                                            </button>
                                        </div>
                                        <!-- Audiobook 2 -->
                                        <div class="flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all p-3 rounded-2xl border border-slate-100 cursor-pointer shadow-[0_2px_8px_rgb(0,0,0,0.02)]" onclick="openAudiobookPlayer()">
                                            <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                                                <div class="gems-book-cover w-full h-full" data-book-id="co-the-nguoi"></div>
                                            </div>
                                            <div class="flex-grow min-w-0">
                                                <h4 class="text-xs font-bold text-slate-800 truncate">Cơ thể người: Phân tích chi tiết</h4>
                                                <p class="text-[9px] text-slate-400 mt-0.5">PGS. TS. Lê Thu</p>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <span class="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Sách Nói</span>
                                                    <span class="text-[9px] font-medium text-slate-400">1:12:30</span>
                                                </div>
                                            </div>
                                            <button class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-md shrink-0 active:scale-90 transition-transform">
                                                <span class="material-symbols-outlined text-base filled-icon">play_arrow</span>
                                            </button>
                                        </div>
                                        <!-- Audiobook 3 -->
                                        <div class="flex items-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all p-3 rounded-2xl border border-slate-100 cursor-pointer shadow-[0_2px_8px_rgb(0,0,0,0.02)]" onclick="openAudiobookPlayer()">
                                            <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                                                <div class="gems-book-cover w-full h-full" data-book-id="thankinh"></div>
                                            </div>
                                            <div class="flex-grow min-w-0">
                                                <h4 class="text-xs font-bold text-slate-800 truncate">Thần kinh học cơ bản</h4>
                                                <p class="text-[9px] text-slate-400 mt-0.5">GEMS Academic</p>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <span class="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Sách Nói</span>
                                                    <span class="text-[9px] font-medium text-slate-400">58:15</span>
                                                </div>
                                            </div>
                                            <button class="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-md shrink-0 active:scale-90 transition-transform">
                                                <span class="material-symbols-outlined text-base filled-icon">play_arrow</span>
                                            </button>
                                        </div>
                                    </div>
                                </section>
''')

# ----------------------------------------------------------------
# SECTION 2: Tin tuc & Blog — for Home view (after Podcast)
# ----------------------------------------------------------------
NEWS_SECTION = to_entities('''
                            <!-- Section: Tin tức & Blog -->
                            <section class="pb-6">
                                <div class="flex items-center justify-between mb-3.5">
                                    <div class="flex items-center gap-2">
                                        <span class="material-symbols-outlined text-blue-600 text-lg">article</span>
                                        <h2 class="text-sm font-bold text-slate-800">Tin tức &amp; Blog</h2>
                                    </div>
                                    <button onclick="showToast('Xem tất cả bài viết.')" class="text-[10px] font-bold text-blue-500">Xem thêm</button>
                                </div>
                                <div class="space-y-3">
                                    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:shadow-md transition-all active:scale-[0.98]" onclick="showToast('Dang mo bai viet...')">
                                        <div class="h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 flex items-end p-3 relative overflow-hidden">
                                            <span class="absolute top-2 right-2 text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">Y học</span>
                                            <span class="material-symbols-outlined text-white/20 text-[80px] absolute -right-2 -bottom-2">vaccines</span>
                                            <div>
                                                <span class="text-[9px] font-bold text-white/70 uppercase tracking-wider">GEMS Blog</span>
                                                <h4 class="text-xs font-black text-white leading-tight line-clamp-2">WHO công bố khuyến nghị mới về phòng ngừa bệnh tim mạch 2025</h4>
                                            </div>
                                        </div>
                                        <div class="p-3 flex items-center justify-between">
                                            <span class="text-[9px] text-slate-400">3 giờ trước · 5 phút đọc</span>
                                            <span class="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 bg-white rounded-2xl border border-slate-100 p-3 cursor-pointer shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:shadow-md transition-all active:scale-[0.98]" onclick="showToast('Dang mo bai viet...')">
                                        <div class="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shrink-0 flex items-center justify-center">
                                            <span class="material-symbols-outlined text-white text-3xl">biotech</span>
                                        </div>
                                        <div class="flex-grow min-w-0">
                                            <span class="text-[9px] font-bold text-teal-600 uppercase">Nghiên cứu mới</span>
                                            <h4 class="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">Liệu pháp gen CRISPR đột phá trong điều trị ung thư máu</h4>
                                            <span class="text-[9px] text-slate-400 mt-1 block">1 ngày trước · 8 phút đọc</span>
                                        </div>
                                    </div>
                                    <div class="flex gap-3 bg-white rounded-2xl border border-slate-100 p-3 cursor-pointer shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:shadow-md transition-all active:scale-[0.98]" onclick="showToast('Dang mo bai viet...')">
                                        <div class="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 shrink-0 flex items-center justify-center">
                                            <span class="material-symbols-outlined text-white text-3xl">neurology</span>
                                        </div>
                                        <div class="flex-grow min-w-0">
                                            <span class="text-[9px] font-bold text-violet-600 uppercase">Thần kinh học</span>
                                            <h4 class="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">AI phát hiện Alzheimer sớm hơn 6 năm qua phân tích giọng nói</h4>
                                            <span class="text-[9px] text-slate-400 mt-1 block">2 ngày trước · 6 phút đọc</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
''')

# ----------------------------------------------------------------
# INSERT Audio section into Library
# Find the last </section> before view-library ends (before view-profile starts)
# ----------------------------------------------------------------
VIEW_PROFILE_MARKER = b'<!-- VIEW 3:'
# Find view-profile comment in raw bytes
vp_pos = raw.find(b'<!-- VIEW 3:')
if vp_pos == -1:
    vp_pos = raw.find(b'id="view-profile"')

# Convert byte position to latin-1 string position
vp_pos_str = len(raw[:vp_pos].decode('latin-1'))

# Find the last </section> before view-profile in the library section
lib_end_search = content[:vp_pos_str]
last_section_end = lib_end_search.rfind('</section>')
insert_after = last_section_end + len('</section>')

# Insert audio section
content = content[:insert_after] + '\n' + AUDIO_SECTION + content[insert_after:]
print(f"Audio section inserted at position {insert_after}")

# ----------------------------------------------------------------
# INSERT Tin tuc & Blog into Home (after Podcast section, before Library)
# ----------------------------------------------------------------
VIEW_LIBRARY_MARKER = 'id="view-library"'
lib_pos = content.find(VIEW_LIBRARY_MARKER)

# Find last </section> before library view
home_area = content[:lib_pos]
last_section_in_home = home_area.rfind('</section>')
insert_home_after = last_section_in_home + len('</section>')

content = content[:insert_home_after] + '\n' + NEWS_SECTION + content[insert_home_after:]
print(f"Tin tuc & Blog section inserted at position {insert_home_after}")

# ----------------------------------------------------------------
# Write back as latin-1 bytes (preserves original encoding exactly)
# ----------------------------------------------------------------
with open(OUTPUT_FILE, 'wb') as f:
    f.write(content.encode('latin-1', errors='replace'))

print(f"Done! Output: {len(content.encode('latin-1', errors='replace'))} bytes")

# Verify markers still present
verify = open(OUTPUT_FILE, 'rb').read().decode('latin-1')
lib_marker = 'id="view-library"'
prof_marker = 'id="view-profile"'
print(f"Audio section present: {'headphones' in verify}")
print(f"Blog section present: {'vaccines' in verify}")
print(f"view-library present: {lib_marker in verify}")
print(f"view-profile present: {prof_marker in verify}")

