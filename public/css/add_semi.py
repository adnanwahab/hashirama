import re 
def add_missing_semicolons(input_file, output_file):
    with open(input_file, 'r') as file:
        content = file.read()

    # Regular expression to match CSS rules without semicolons
    # This pattern looks for property: value pairs not followed by a semicolon
    pattern = r'([\w-]+\s*:\s*[^;\{\}]+)(?=\s*[\}\n])'

    # Replace matches by adding a semicolon
    modified_content = re.sub(pattern, r'\1;', content)

    with open(output_file, 'w') as file:
        file.write(modified_content)

# Usage
add_missing_semicolons('./combined_css_file.css', 'output.css')
