import os
import re

# Directory containing your CSS files
directory = './'

# List all files matching your pattern
css_files = [f for f in os.listdir(directory) if f.startswith('parallel_chunk') and f.endswith('.txt')]

# Define a regex pattern to detect if a line looks like CSS (contains typical CSS characters)
css_pattern = re.compile(r'[{;}]')

# Open the output file
with open('combined_css_file.css', 'w') as output_file:
    for css_file in css_files:
        # Read each file
        with open(os.path.join(directory, css_file), 'r') as f:
            lines = f.readlines()
            # Filter out lines that don't match the CSS pattern
            for line in lines:
                if css_pattern.search(line):  # Keep the line if it contains CSS characters
                    output_file.write(line)
print('hii')
