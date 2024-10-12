#!/bin/bash

# Directory containing the scripts
SCRIPT_DIR=$(dirname "$0")

# Target directory for symlinks
TARGET_DIR="/usr/local/bin"

# Iterate over each .sh file in the script directory
for script in "$SCRIPT_DIR"/*.sh; do
    # Ensure the script is executable
    chmod +x "$script"
    
    # Get the base name of the script
    script_name=$(basename "$script")
    
    # Create a symlink in the target directory
    ln -sf "$script" "$TARGET_DIR/$script_name"

        # Create a symlink in the target directory
    if ln -sf "$script" "$TARGET_DIR/$script_name"; then
        echo "Symlink created for $script_name"
    else
        echo "Failed to create symlink for $script_name" >&2
    fi
done

echo "Symlinks created for all scripts in $SCRIPT_DIR to $TARGET_DIR"



alias yarn="bun"
alias npm="bun"
alias deno="deno --accept-all"
add_alias() {
    if [ $# -ne 2 ]; then
        echo "Usage: add_alias <alias_name> <command>"
        return 1
    fi

    local alias_name=$1
    local command=$2

    # Check if the alias already exists
    if alias "$alias_name" &>/dev/null; then
        echo "Alias '$alias_name' already exists."
        return 1
    fi

    # Add the alias to the file
    echo "alias $alias_name=\"$command\"" >> "$0"
    echo "Alias '$alias_name' added successfully."
}

# Example usage:
# add_alias myalias "mycommand"


