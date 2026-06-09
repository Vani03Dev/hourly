import os, re

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            def repl(m):
                tag = m.group(0)
                if not tag.startswith('<Grid'): return tag
                
                sizes = []
                # Match xs={12} or xs={6}
                for size in ['xs', 'sm', 'md', 'lg', 'xl']:
                    match = re.search(fr'\b{size}={{([^}}]+)}}', tag)
                    if match:
                        sizes.append(f"{size}: {match.group(1)}")
                        tag = re.sub(fr'\s*\b{size}={{[^}}]+}}', '', tag)
                    else:
                        match2 = re.search(fr'\b{size}=([0-9]+)\b', tag)
                        if match2:
                            sizes.append(f"{size}: {match2.group(1)}")
                            tag = re.sub(fr'\s*\b{size}=[0-9]+\b', '', tag)
                
                if sizes:
                    tag = tag.replace('<Grid', f'<Grid size={{{{ {", ".join(sizes)} }}}}')
                return tag
            
            new_content = re.sub(r'<Grid[^>]*>', repl, content)
            
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
