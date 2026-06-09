import os
import re

def fix_file(filepath, replacements):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements:
            content = content.replace(old, new)
            
        with open(filepath, 'w') as f:
            f.write(content)
    except Exception as e:
        pass

# Fix expert dashboard
fix_file("app/expert/dashboard/page.tsx", [
    ("user?.name", "user?.user_metadata?.first_name || user?.email"),
    ("user?.avatar", "user?.user_metadata?.avatar_url")
])

# Fix expert settings
fix_file("app/expert/settings/page.tsx", [
    ("user?.name", "user?.user_metadata?.first_name || user?.email"),
    ("user?.avatar", "user?.user_metadata?.avatar_url")
])

# Fix expert login
with open("app/expert/login/page.tsx", 'r') as f:
    content = f.read()

content = content.replace("const { login } = useAuth();", "const router = useRouter();")
content = content.replace("login(e.currentTarget.email.value, \"expert\");", "import('@/app/actions/auth').then(({ login }) => login(new FormData(e.currentTarget)));")

with open("app/expert/login/page.tsx", 'w') as f:
    f.write(content)
