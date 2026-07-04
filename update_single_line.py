import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def convert_to_single_line(match):
    # match.group(1) is the title with <br>
    title = match.group(1).replace('<br>', ' ')
    
    return f'<h4 class="text-xs font-bold text-slate-800 truncate px-0.5 mt-2.5">{title}</h4>'

pattern = r'<h4 class=\"text-\[13px\] font-bold text-slate-800 leading-snug px-0\.5 mt-2\.5\">(.*?)</h4>'

modified_html = re.sub(pattern, convert_to_single_line, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(modified_html)
print('Done!')
