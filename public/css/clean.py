import re

# with open('journey-4.css', 'r') as file:
#     content = file.read()

# modified_content = re.sub(r'\.eggnog\s+([a-z-]+:.*?;)', r'.eggnog { left: 15px; }', content)

# with open('output_file.css', 'w') as file:
#     file.write(modified_content)


import re

def process_css(input_file, output_file):
    with open(input_file, 'r') as file:
        content = file.read()

    # Replace .eggnog followed by a property
    #content = re.sub(r'\.eggnog\s+([a-z-]+:.*?;)', r'.eggnog { left: 15px; }', content)

    # Remove .eggnog if it directly precedes @
    # content = re.sub(r'\.eggnog\s+(@\S+)', r'\1', content)
    content = re.sub(r'(\S+:\s*[^;\s{]+)\s*(?=\}|\n|$)', r'\1;', content)

    with open(output_file, 'w') as file:
        file.write(content)

# Usage
#
def process_css_2(input_file, output_file):
    with open(input_file, 'r') as file:
        content = file.read()

    # Replace .eggnog followed by a property
    content = re.sub(r'\.eggnog\s+([a-z-]+:.*?;)', r'.eggnog { left: 15px; }', content)

    # Remove .eggnog if it directly precedes @
    content = re.sub(r'\.eggnog\s+(@\S+)', r'\1', content)

    # Add missing semicolons (this is a basic approach and might need refinement)
    content = re.sub(r'(\S+:\s*[^;\s{]+)\s*(?=\}|\n|$)', r'\1;', content)

    # Balance braces (this is a simple approach and might need more complex logic for nested structures)
    open_braces = content.count('{')
    close_braces = content.count('}')
    if open_braces > close_braces:
        content += '}' * (open_braces - close_braces)

    with open(output_file, 'w') as file:
        file.write(content)

process_css('output_file_2.css', 'output_file_3.css')
