import os
import re

base_dirs = [
    r'c:\\Users\\Administrator\\Desktop\\my-online-shop\\admin-dashboard',
    r'c:\\Users\\Administrator\\Desktop\\my-online-shop\\store-front'
]

import_pattern = re.compile(r"import\s+.*?\{([^}]+)\}.*?from\s+['\"]lucide-react['\"]")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = import_pattern.search(content)
    if not match:
        return

    icons_imported = [icon.strip() for icon in match.group(1).split(',')]
    if not icons_imported:
        return

    modified = False
    
    for icon in icons_imported:
        if not icon or icon == 'default' or ' as ' in icon:
            continue
            
        icon_regex = re.compile(r'<\s*' + re.escape(icon) + r'(?:\s+([^>]*))?>')
        
        def replace_icon(m):
            attrs = m.group(1) or ''
            if 'strokeWidth=' in attrs:
                return m.group(0)
                
            new_attrs = attrs + ' strokeWidth={1.5}'
            
            # Make sure it closes properly with /> or >
            return f'<{icon} {new_attrs.strip()}>'
            
        new_content, count = icon_regex.subn(replace_icon, content)
        if count > 0:
            content = new_content
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

for base_dir in base_dirs:
    for root, dirs, files in os.walk(base_dir):
        if 'node_modules' in root or '.next' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

print('Done applying strokeWidth={1.5} to lucide-react icons!')
