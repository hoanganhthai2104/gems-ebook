import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = r'<div class=\"card-lift flex-shrink-0 w-40 cursor-pointer p-0 transition-all duration-300\" onclick=\"openBookDetails\(\'([^\']+)\'\)\">\s*<div class=\"gems-book-cover[^\>]+data-book-id=\"[^\"]+\">\s*</div>\s*<h4 class=\"[^\"]+\">(.*?)</h4>\s*</div>'

def replace_book_to_ios(match):
    book_id = match.group(1)
    title = match.group(2)
    
    new_html = f"""<div class="card-lift flex-shrink-0 w-[140px] cursor-pointer p-2 rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300" onclick="openBookDetails('{book_id}')">
                                        <div class="gems-book-cover w-full aspect-[2/3] rounded-xl shadow-sm overflow-hidden mb-2" data-book-id="{book_id}"></div>
                                        <h4 class="text-[12px] font-bold text-slate-800 line-clamp-2 leading-snug px-1 pb-1">{title}</h4>
                                    </div>"""
    return new_html

modified_html = re.sub(pattern, replace_book_to_ios, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(modified_html)
print('Done!')
