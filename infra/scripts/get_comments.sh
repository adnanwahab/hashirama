# File to process
input_file="services/homelab-status-page/src/HandleObservableServer.go"

# Output file
output_file="comments.txt"

# Extract single-line comments
grep -o '//.*' "$input_file" > "$output_file"

# Extract multi-line comments
sed -n '/\/\*/,/\*\//p' "$input_file" >> "$output_file"

echo "Comments have been extracted to $output_file"