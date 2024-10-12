# Load the file with the list of paths
with open('prune.css', 'r') as file:
    paths = file.readlines()

# Remove newline characters and empty lines
paths = [path.strip() for path in paths if path.strip()]

# Sort paths by the number of subdirectories (splitting by '/' or '\\')
sorted_paths = sorted(paths, key=lambda path: path.count('/'))

# Save the sorted paths to a new file or print them
with open('sorted_paths.txt', 'w') as sorted_file:
    sorted_file.write('\n'.join(sorted_paths))

print("Paths sorted by number of subdirectories are saved to 'sorted_paths.txt'")
