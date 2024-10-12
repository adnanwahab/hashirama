#!/bin/bash

# Path to your script
SCRIPT_PATH="infra/scripts/install.sh"

# Extract the current version number
CURRENT_VERSION=$(grep -oP 'Script version: \K[0-9]+\.[0-9]+\.[0-9]+' "$SCRIPT_PATH")

# Increment the patch version
IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
NEW_VERSION="$major.$minor.$((patch + 1))"

# Update the version in the script
sed -i "s/Script version: $CURRENT_VERSION/Script version: $NEW_VERSION/" "$SCRIPT_PATH"

# Add the changes to the commit
git add "$SCRIPT_PATH"
git commit --amend --no-edit