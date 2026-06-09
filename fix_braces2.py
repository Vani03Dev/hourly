import os

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            content = content.replace("sx={{ fontWeight: 'bold' } ", "sx={{ fontWeight: 'bold' }} ")
            content = content.replace("sx={{ fontWeight: 'bold' }>", "sx={{ fontWeight: 'bold' }}>")
            content = content.replace("sx={{ fontWeight: 'medium' } ", "sx={{ fontWeight: 'medium' }} ")
            content = content.replace("sx={{ fontWeight: 'medium' }>", "sx={{ fontWeight: 'medium' }}>")
            
            with open(path, 'w') as f:
                f.write(content)
