#!/bin/bash

# Directory containing the scripts
SCRIPT_DIR=$(dirname "$0")

# Target directory for symlinks
TARGET_DIR="/usr/local/bin"

# Iterate over each .sh file in the script directory
for script in "$SCRIPT_DIR"/*.sh; do
    # Get the base name of the script
    script_name=$(basename "$script")
    
    # Create a symlink in the target directory
    ln -sf "$script" "$TARGET_DIR/$script_name"
done

echo "Symlinks created for all scripts in $SCRIPT_DIR to $TARGET_DIR"
