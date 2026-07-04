import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

titles = {
    'thaoduoc': 'Cẩm nang Thảo dược',
    'trathaomoc': 'Trà Thảo Mộc',
    'thucduong': 'Thực dưỡng hiện đại',
    'co-the-nguoi': 'Cơ thể người',
    'thankinh': 'Thần kinh học cơ bản',
    'ditruyen': 'Di truyền học y khoa',
    'nhansam': 'Nhân Sâm y học',
    'baoche': 'Kỹ Thuật Bào Chế',
    'namduocthanhieu': 'Nam Dược Thần Hiệu',
    'giaiphau': 'Giải phẫu đại cương',
    'cohoc': 'Cơ học vận động',
    'xuongkhop': 'Giải phẫu xương khớp',
    'giaiphauthanhinh': 'GP Hệ Thần Kinh',
    'atlasgiaiphau': 'Atlas Giải phẫu',
    'tamly': 'Tâm lý học lâm sàng',
    'sinhlythankinh': 'Sinh lý thần kinh',
    'naobo': 'Não bộ và Hành vi',
    'benhthanhinh': 'Bệnh học Thần kinh',
    'taibienmachmau': 'Tai biến mạch não',
    'genkhoa': 'Gen và bệnh học',
    'ditruyenphantu': 'Di truyền phân tử',
    'dotbiengene': 'Đột biến Gene lâm sàng',
    'kythuatditruyen': 'Kỹ thuật Di truyền'
}

def replace_book(match):
    book_id = match.group(1)
    full_match = match.group(0)
    title = titles.get(book_id, 'Unknown Title')
    if '<h4' in full_match:
        return full_match # Already has title
    
    # insert h4 right after the gems-book-cover div closing tag
    h4_tag = f'\n                                            <h4 class=\"text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mt-1.5 px-0.5 text-center\">{title}</h4>'
    
    # regex to find the end of gems-book-cover div
    modified = re.sub(r'(<div class=\"gems-book-cover[^>]+data-book-id=\"'+book_id+r'\"[^>]*></div>)', r'\1' + h4_tag, full_match)
    return modified

pattern = r'<div class=\"card-lift flex-shrink-0 w-40 cursor-pointer p-0 transition-all duration-300\" onclick=\"openBookDetails\(\'([^\']+)\'\)\">.*?</div>\s*</div>'

html = re.sub(pattern, replace_book, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done!')
