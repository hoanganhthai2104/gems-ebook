import json
import re
import os
import subprocess

def parse_book_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    pages = []
    current_page_paras = []
    char_count = 0

    # First page header
    first_page_html = """
<header class="mb-4">
    <span class="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Nền Y Học Sự Sống • Hoàng Anh</span>
    <h2 class="text-3xl serif-title mt-2 leading-tight text-[#1a2e35]">[BẢN LÀM VIỆC] TRIẾT LÝ Y HỌC SỰ SỐNG</h2>
    <h3 class="text-lg font-semibold text-blue-900 mt-1">5 Nền Y Học & 3 Trụ Y Đức</h3>
    <div class="w-full h-px bg-gray-300 mt-4 opacity-50"></div>
</header>
"""
    
    for line in lines:
        if line.startswith('PHẦN') or line.startswith('Chương') or line.startswith('MỤC LỤC'):
            if current_page_paras:
                content_html = "".join([f"<p class='mb-3'>{p}</p>" for p in current_page_paras])
                pages.append(f"<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>{content_html}</div>")
                current_page_paras = []
                char_count = 0
            current_page_paras.append(f"<h3 class='text-xl font-bold text-blue-900 serif-title mt-4 mb-2'>{line}</h3>")
        else:
            current_page_paras.append(line)
            char_count += len(line)
            if char_count > 1200:
                content_html = "".join([f"<p class='mb-3'>{p}</p>" if not p.startswith('<h3') else p for p in current_page_paras])
                pages.append(f"<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>{content_html}</div>")
                current_page_paras = []
                char_count = 0

    if current_page_paras:
        content_html = "".join([f"<p class='mb-3'>{p}</p>" if not p.startswith('<h3') else p for p in current_page_paras])
        pages.append(f"<div class='text-lg leading-relaxed text-gray-800 space-y-4 font-reading' style='font-size: var(--reader-font-size, 18px); line-height: 1.65;'>{content_html}</div>")

    # Add header to the very first page
    if pages:
        pages[0] = first_page_html + pages[0]

    # Add Quiz container to final page
    pages.append('<div class="h-full overflow-y-auto bg-white px-5 py-6" id="quiz-container"><!-- Chapter Completed --></div>')

    return pages

def update_chapters_json():
    txt_path = os.path.join('d:\\Desktop\\EBOOK GEMS\\data', 'trietly_yhss_full.txt')
    chapters_path = os.path.join('d:\\Desktop\\EBOOK GEMS\\data', 'chapters.json')

    pages = parse_book_text(txt_path)
    print(f"Parsed {len(pages)} full text pages for trietly_yhss!")

    with open(chapters_path, 'r', encoding='utf-8') as f:
        chapters_data = json.load(f)

    chapters_data['trietly_yhss'] = {
        "title": "[BẢN LÀM VIỆC] TRIẾT LÝ Y HỌC SỰ SỐNG – 5 Nền Y Học & 3 Trụ Y Đức",
        "meta": "Nền Y Học Sự Sống • Tác giả Hoàng Anh",
        "pages": pages
    }

    with open(chapters_path, 'w', encoding='utf-8') as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=2)

    print("Successfully updated data/chapters.json with EXACT full text!")

if __name__ == '__main__':
    update_chapters_json()
