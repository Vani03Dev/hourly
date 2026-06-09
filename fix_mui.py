import os
import re

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
                if 'fontWeight="bold"' not in tag and 'fontWeight="medium"' not in tag:
                    return tag
                
                is_medium = 'fontWeight="medium"' in tag
                tag = tag.replace(' fontWeight="bold"', '').replace(' fontWeight="medium"', '')
                
                weight_val = "'medium'" if is_medium else "'bold'"
                
                if 'sx={{ ' in tag:
                    tag = tag.replace('sx={{ ', f"sx={{ fontWeight: {weight_val}, ")
                elif 'sx={{' in tag:
                    tag = tag.replace('sx={{', f"sx={{ fontWeight: {weight_val}, ")
                else:
                    tag = tag.replace('<Typography', f"<Typography sx={{ fontWeight: {weight_val} }}")
                return tag
            
            new_content = re.sub(r'<Typography[^>]*>', repl, content)
            
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
