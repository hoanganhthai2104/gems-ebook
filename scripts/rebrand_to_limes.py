import os
import glob
import re
import sys

def rebrand_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Direct and compound replacements
    replacements = [
        ('GEMS Group', 'LIMES'),
        ('GEMS GROUP', 'LIMES'),
        ('GEMS group', 'LIMES'),
        ('Gems Group', 'LIMES'),
        ('GEMS Ebook', 'LIMES Ebook'),
        ('GEMS Medical', 'LIMES Medical'),
        ('GEMS Academic', 'LIMES Academic'),
        ('GEMS AI', 'LIMES AI'),
        ('GEMS Xu', 'LIMES Xu'),
        ('GEMS Shop', 'LIMES Shop'),
        ('GEMS Mall', 'LIMES Mall'),
        ('GEMS Pharma', 'LIMES Pharma'),
        ('GEMS Health', 'LIMES Health'),
        ('GEMS Tech', 'LIMES Tech'),
        ('GEMS Fashion', 'LIMES Fashion'),
        ('GEMS Home', 'LIMES Home'),
        ('GEMS Accessories', 'LIMES Accessories'),
        ('GEMS Dermatology', 'LIMES Dermatology'),
        ('GEMS Derma', 'LIMES Derma'),
        ('GEMS Fit', 'LIMES Fit'),
        ('GEMS Baby', 'LIMES Baby'),
        ('GEMS Classic', 'LIMES Classic'),
        ('GEMS Premium', 'LIMES Premium'),
        ('GEMS Watch', 'LIMES Watch'),
        ('GEMS Doctor', 'LIMES Doctor'),
        ('GEMS Runner', 'LIMES Runner'),
        ('GEMS LED', 'LIMES LED'),
        ('GEMS Tactile', 'LIMES Tactile'),
        ('GEMS Essential', 'LIMES Essential'),
        ('GEMS Rubber', 'LIMES Rubber'),
        ('GEMS Books', 'LIMES Books'),
        ('GEMS AirPods', 'LIMES AirPods'),
        ('GEMS Streetwear', 'LIMES Streetwear'),
        ('GEMS-', 'LIMES-'),
        ('GEMS_COUPONS', 'LIMES_COUPONS'),
        ('GEMS100K', 'LIMES100K'),
        ('GEMS100', 'LIMES100'),
        ('accountName=GEMS%20GROUP', 'accountName=LIMES'),
        ('accountName=GEMS', 'accountName=LIMES'),
        ('bacsi.gems@gmail.com', 'bacsi.limes@gmail.com'),
        ('thainhansam.gems@gmail.com', 'thainhansam.limes@gmail.com'),
        ('alt="GEMS Logo"', 'alt="LIMES Logo"'),
        ('alt="GEMS"', 'alt="LIMES"'),
        ('title="GEMS"', 'title="LIMES"'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    # 2. Contextual and regex replacements
    content = re.sub(r'hệ thống GEMS\b', 'hệ thống LIMES', content)
    content = re.sub(r'khách hàng GEMS\b', 'khách hàng LIMES', content, flags=re.IGNORECASE)
    content = re.sub(r'thành viên GEMS\b', 'thành viên LIMES', content, flags=re.IGNORECASE)
    content = re.sub(r'thương hiệu GEMS\b', 'thương hiệu LIMES', content, flags=re.IGNORECASE)
    content = re.sub(r'ứng dụng GEMS\b', 'ứng dụng LIMES', content, flags=re.IGNORECASE)
    content = re.sub(r'nền tảng GEMS\b', 'nền tảng LIMES', content, flags=re.IGNORECASE)
    content = re.sub(r'Nền tảng Y khoa GEMS', 'Nền tảng Y khoa LIMES', content)
    content = re.sub(r'Thương hiệu": "GEMS"', 'Thương hiệu": "LIMES"', content)
    content = re.sub(r'<title>GEMS -', '<title>LIMES -', content)
    content = re.sub(r'<title>GEMS \|', '<title>LIMES |', content)
    content = re.sub(r'content="GEMS"', 'content="LIMES"', content)
    content = re.sub(r'"name": "GEMS Ebook Ecosystem"', '"name": "LIMES Ebook Ecosystem"', content)
    content = re.sub(r'"short_name": "GEMS"', '"short_name": "LIMES"', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully updated: {filepath}")
    else:
        print(f"No changes needed in: {filepath}")

def main():
    target_files = glob.glob('js/**/*.js', recursive=True) + [
        'index.html', 'manifest.json', 'package.json', 'server.js', 'README.md', 'data/books.json', 'scripts/seed_firebase.js'
    ]

    for tf in target_files:
        rebrand_file(tf)

if __name__ == '__main__':
    main()
