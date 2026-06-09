import os

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = content.replace("sx={ fontWeight", "sx={{ fontWeight")
            
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
