import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = r'<div class=\"card-lift flex-shrink-0 w-\[136px\] cursor-pointer p-0 transition-all duration-300\" onclick=\"openBookDetails\(\'([^\']+)\'\)\">\s*<div class=\"gems-book-cover w-full aspect-\[2/3\] rounded-xl shadow-\[0_8px_20px_rgba\(0,0,0,0\.08\)\] border border-slate-100/50 overflow-hidden\" data-book-id=\"[^\"]+\"></div>\s*<h4 class=\"text-\[12px\] font-bold text-slate-800 line-clamp-2 leading-snug px-0\.5 mt-2\.5\">(.*?)</h4>\s*</div>'

titles_with_br = {
    'thaoduoc': 'Cẩm nang<br>Thảo dược',
    'trathaomoc': 'Trà<br>Thảo Mộc',
    'thucduong': 'Thực dưỡng<br>hiện đại',
    'co-the-nguoi': 'Cơ thể<br>người',
    'thankinh': 'Thần kinh học<br>cơ bản',
    'ditruyen': 'Di truyền học<br>y khoa',
    'nhansam': 'Nhân Sâm<br>y học',
    'baoche': 'Kỹ Thuật<br>Bào Chế',
    'namduocthanhieu': 'Nam Dược<br>Thần Hiệu',
    'giaiphau': 'Giải phẫu<br>đại cương',
    'cohoc': 'Cơ học<br>vận động',
    'xuongkhop': 'Giải phẫu<br>xương khớp',
    'giaiphauthanhinh': 'GP Hệ<br>Thần Kinh',
    'atlasgiaiphau': 'Atlas<br>Giải phẫu',
    'tamly': 'Tâm lý học<br>lâm sàng',
    'sinhlythankinh': 'Sinh lý<br>thần kinh',
    'naobo': 'Não bộ<br>và Hành vi',
    'benhthanhinh': 'Bệnh học<br>Thần kinh',
    'taibienmachmau': 'Tai biến<br>mạch não',
    'genkhoa': 'Gen và<br>bệnh học',
    'ditruyenphantu': 'Di truyền<br>phân tử',
    'dotbiengene': 'Đột biến Gene<br>lâm sàng',
    'kythuatditruyen': 'Kỹ thuật<br>Di truyền'
}

def replace_book_large(match):
    book_id = match.group(1)
    title = titles_with_br.get(book_id, match.group(2))
    
    new_html = f"""<div class="card-lift flex-shrink-0 w-44 cursor-pointer p-0 transition-all duration-300" onclick="openBookDetails('{book_id}')">
                                        <div class="gems-book-cover w-full aspect-[2/3] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-slate-100/50 overflow-hidden" data-book-id="{book_id}"></div>
                                        <h4 class="text-[13px] font-bold text-slate-800 leading-snug px-0.5 mt-2.5">{title}</h4>
                                    </div>"""
    return new_html

modified_html = re.sub(pattern, replace_book_large, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(modified_html)
print('Done!')
