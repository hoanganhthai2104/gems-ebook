import json
import re
import os

def build_js_chapter_entry(book_id, chapter_data):
    """Build a JavaScript object entry for bookChapters"""
    title = chapter_data['title'].replace('`', '\\`').replace('${', '\\${')
    meta = chapter_data['meta'].replace('`', '\\`').replace('${', '\\${')
    
    pages_js = []
    for page in chapter_data['pages']:
        # Escape backticks and template literal syntax in HTML content
        escaped = page.replace('\\', '\\\\').replace('`', '\\`')
        # Do NOT escape ${} as these are CSS var() references used as literal strings in the HTML
        pages_js.append('`' + escaped + '`')
    
    pages_str = ',\n                    '.join(pages_js)
    
    return f"""            {book_id}: {{
                title: `{title}`,
                meta: `{meta}`,
                pages: [
                    {pages_str}
                ]
            }}"""

def inject_chapters_into_html():
    chapters_path = 'd:\\Desktop\\EBOOK GEMS\\data\\chapters.json'
    html_path = 'd:\\Desktop\\EBOOK GEMS\\index_v3.html'
    
    with open(chapters_path, 'r', encoding='utf-8') as f:
        chapters_data = json.load(f)
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Build JS for new book chapters
    new_book_ids = ['trietly_yhss', 'nuoc_va_su_song', 'tam_hoc_chua_lanh']
    
    new_chapters_js = ''
    for book_id in new_book_ids:
        if book_id not in chapters_data:
            print(f'WARNING: {book_id} not found in chapters.json!')
            continue
        entry = build_js_chapter_entry(book_id, chapters_data[book_id])
        new_chapters_js += ',\n' + entry
        print(f'Built JS entry for {book_id} ({len(chapters_data[book_id]["pages"])} pages)')
    
    # Find the closing of bookChapters object and insert before it
    # The closing pattern is:    }\n        };
    # We look for the last nhansam entry closing
    
    # Pattern: find "        };" which closes the bookChapters const
    # More specifically find the line that is just whitespace + }; after line 5149
    
    # Strategy: find the exact string that ends the nhansam chapter
    target = '''                ]\n            }\n        };'''
    replacement = '''                ]\n            }''' + new_chapters_js + '''\n        };'''
    
    if target in html_content:
        new_html = html_content.replace(target, replacement, 1)
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        
        print(f'Successfully injected {len(new_book_ids)} book chapters into index_v3.html!')
        print(f'File size: {os.path.getsize(html_path):,} bytes')
    else:
        print('ERROR: Could not find target pattern to inject chapters!')
        print('Looking for alternative pattern...')
        
        # Try alternative pattern
        alt_target = '                ]\r\n            }\r\n        };'
        alt_replacement = '                ]\r\n            }' + new_chapters_js + '\r\n        };'
        
        if alt_target in html_content:
            new_html = html_content.replace(alt_target, alt_replacement, 1)
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print('Successfully injected using CRLF pattern!')
        else:
            # Try more flexible approach - find line numbers
            lines = html_content.split('\n')
            for i, line in enumerate(lines):
                if '        };' in line and i > 5100 and i < 5200:
                    line_repr = repr(line)
                    print(f'Found closing }}; at line {i+1}: {line_repr}')
                    break

if __name__ == '__main__':
    inject_chapters_into_html()
