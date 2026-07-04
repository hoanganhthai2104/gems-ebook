import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace card-lift from the w-44 books we just modified
pattern = r'class=\"card-lift flex-shrink-0 w-44 cursor-pointer'
replacement = r'class="group flex-shrink-0 w-44 cursor-pointer hover:-translate-y-1 hover:scale-[1.015] active:scale-95'

modified_html = re.sub(pattern, replacement, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(modified_html)
print('Done!')
