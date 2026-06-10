import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # If the file contains the dynamic import
    if "await import('@/utils/supabase/client')" in content:
        # 1. Add static import at the top (after other imports)
        # Find the last import line
        lines = content.split('\n')
        last_import_idx = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import_idx = i
        
        # Insert the static import after the last import
        lines.insert(last_import_idx + 1, "import { createClient } from '@/utils/supabase/client';")
        content = '\n'.join(lines)
        
        # 2. Replace the dynamic import
        content = content.replace("const { createClient } = await import('@/utils/supabase/client');", "")
        
        # Write back
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

for root, _, files in os.walk('contexts'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

for root, _, files in os.walk('components'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))
