#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Split trietly_yhss (153 pages) into 4 logical chapters.
Also removes [BẢN LÀM VIỆC] from titles.
"""
import json, re, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAPTERS_PATH = os.path.join(BASE, 'data', 'chapters.json')

with open(CHAPTERS_PATH, 'r', encoding='utf-8') as f:
    chapters = json.load(f)

src = chapters['trietly_yhss']
pages = src['pages']
total = len(pages)
print(f"Total pages in trietly_yhss: {total}")

def clean_title(t):
    return re.sub(r'\[BẢN LÀM VIỆC\]\s*', '', t, flags=re.IGNORECASE).strip()

# Define page ranges (0-indexed, inclusive)
SPLITS = [
    {
        'id': 'trietly_mo_dau',
        'start': 0, 'end': 25,
        'title': 'Triết Lý YHSS – Phần Mở Đầu: Hành Trình Tìm Lại Chân Lý Y Học',
        'meta': 'Nền Y Học Sự Sống • Hoàng Anh',
    },
    {
        'id': 'trietly_5nen',
        'start': 26, 'end': 88,
        'title': 'Triết Lý YHSS – Phần I: 5 Nền Y Học Hợp Nhất',
        'meta': 'Nền Y Học Sự Sống • Hoàng Anh',
    },
    {
        'id': 'trietly_3tru',
        'start': 89, 'end': 126,
        'title': 'Triết Lý YHSS – Phần II: 3 Trụ Cột Y Đức',
        'meta': 'Nền Y Học Sự Sống • Hoàng Anh',
    },
    {
        'id': 'trietly_ket_luan',
        'start': 127, 'end': 152,
        'title': 'Triết Lý YHSS – Phần Kết Luận: Nền Y Học Mới Cho Nhân Loại Mới',
        'meta': 'Nền Y Học Sự Sống • Hoàng Anh',
    },
]

# Remove old single chapter entry
del chapters['trietly_yhss']

# Create 4 new chapter entries
for sp in SPLITS:
    chapter_pages = pages[sp['start']:sp['end']+1]
    # Fix [BẢN LÀM VIỆC] in each page's HTML content
    fixed_pages = []
    for page_html in chapter_pages:
        fixed = re.sub(r'\[BẢN LÀM VIỆC\]\s*', '', page_html)
        fixed_pages.append(fixed)
    
    chapters[sp['id']] = {
        'title': sp['title'],
        'meta': sp['meta'],
        'pages': fixed_pages
    }
    print(f"Created {sp['id']}: {len(fixed_pages)} pages ({sp['start']}-{sp['end']})")

# Save
with open(CHAPTERS_PATH, 'w', encoding='utf-8') as f:
    json.dump(chapters, f, ensure_ascii=False, indent=2)

print(f"\nDone! chapters.json updated with 4 new trietly chapters.")
print("New chapter IDs:", [sp['id'] for sp in SPLITS])
