import os
import re

src_dir = '/Users/yaronfeldboy/Documents/לימודים/שנה ג/סמסטר א /נושאים פיתוח אפלקצייות/Reading Club App Yaron_And_Alon/frontend/src'

def get_rel_path(file_path):
    parts = file_path.split(os.sep)
    src_idx = parts.index('src')
    depth = len(parts) - src_idx - 2
    if depth == 0:
        return './utils/imageUtils'
    else:
        return '../' * depth + 'utils/imageUtils'

for root, _, files in os.walk(src_dir):
    for f in files:
        if not f.endswith('.tsx'):
            continue
        filepath = os.path.join(root, f)
        with open(filepath, 'r') as fp:
            content = fp.read()
            
        if '/uploads/profiles/default-avatar.png' in content:
            print(f"Fixing {filepath}")
            
            # replace default string
            content = content.replace("'/uploads/profiles/default-avatar.png'", "DEFAULT_AVATAR")
            content = content.replace('"/uploads/profiles/default-avatar.png"', "DEFAULT_AVATAR")
            
            # replace onError
            # e.g. onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
            content = re.sub(r'onError=\{\(e\)\s*=>\s*\{\s*\(e\.target\s*as\s*HTMLImageElement\)\.src\s*=\s*DEFAULT_AVATAR;?\s*\}\}', 'onError={handleImageError}', content)
            
            # Add imports if needed
            rel_import = f"import {{ DEFAULT_AVATAR, handleImageError }} from '{get_rel_path(filepath)}';"
            if 'DEFAULT_AVATAR' in content and rel_import not in content:
                # insert after last import
                lines = content.split('\n')
                last_import_idx = -1
                for i, line in enumerate(lines):
                    if line.startswith('import '):
                        last_import_idx = i
                
                if last_import_idx != -1:
                    lines.insert(last_import_idx + 1, rel_import)
                    content = '\n'.join(lines)
            
            with open(filepath, 'w') as fp:
                fp.write(content)

