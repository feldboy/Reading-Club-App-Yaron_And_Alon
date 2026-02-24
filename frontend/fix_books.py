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
            
        if "DEFAULT_BOOK_COVER" not in content and 'default-book.png' in content:
            print(f"Fixing {filepath}")
            
            # replace default string
            content = content.replace("'/uploads/books/default-book.png'", "DEFAULT_BOOK_COVER")
            content = content.replace('"/uploads/books/default-book.png"', "DEFAULT_BOOK_COVER")
            
            # replace onError
            # e.g. onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_BOOK_COVER; }}
            content = re.sub(r'onError=\{\(e\)\s*=>\s*\{\s*\(e\.target\s*as\s*HTMLImageElement\)\.src\s*=\s*DEFAULT_BOOK_COVER;?\s*\}\}', 'onError={handleBookImageError}', content)
            
            # Add imports if needed
            rel_import = f"import {{ DEFAULT_BOOK_COVER, handleBookImageError }} from '{get_rel_path(filepath)}';"
            # Let's check if there is an existing import from imageUtils and merge it.
            existing_import_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"].*?utils/imageUtils['\"];?", content)
            if existing_import_match:
                imports = existing_import_match.group(1).split(',')
                imports = [i.strip() for i in imports]
                if 'DEFAULT_BOOK_COVER' not in imports:
                    imports.append('DEFAULT_BOOK_COVER')
                if 'handleBookImageError' not in imports:
                    imports.append('handleBookImageError')
                
                new_import = f"import {{ {', '.join(imports)} }} from '{get_rel_path(filepath)}';"
                content = content.replace(existing_import_match.group(0), new_import)
            else:
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

