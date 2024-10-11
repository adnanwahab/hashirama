import re
import glob

def add_tw_prefix(match):
    class_names = match.group(1).split()
    updated_class_names = []
    for name in class_names:
        if not name.startswith('tw-'):
            updated_class_names.append('tw-' + name)
        else:
            updated_class_names.append(name)
    return 'class="' + ' '.join(updated_class_names) + '"'

html_files = glob.glob('views/*/*.html')
for html_file in html_files:
    with open(html_file, 'r') as file:
        html_content = file.read()

    updated_html_content = re.sub(r'class="([^"]+)"', add_tw_prefix, html_content)

    with open(html_file, 'w') as file:
        file.write(updated_html_content)
# with open('your_file.html', 'r') as file:
#     html_content = file.read()

# Function to add 'tw-' prefix if not present

# Regex to find class attributes and update the class names
updated_html_content = re.sub(r'class="([^"]+)"', add_tw_prefix, html_content)

# Write the updated HTML to a new file or overwrite the original
with open('updated_file.html', 'w') as file:
    file.write(updated_html_content)

print("Class names updated successfully!")
