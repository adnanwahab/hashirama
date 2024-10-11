#!/bin/bash

# Ensure we are in the correct directory
if [ ! -d ".git" ]; then
  echo "This is not a Git repository."
  exit 1
fi

# Backup the .git directory
mv .git .git_backup

# Reinitialize the Git repository
git init

# Add all current files to the new repository
git add .

# Commit the current state of the repository
git commit -m "Initial commit with current state"

echo "Git history has been reinitialized with the current state."

# Optional: Remove the backup if everything works fine
echo "If everything looks good, you can remove the backup of the original Git history:"
echo "rm -rf .git_backup"
