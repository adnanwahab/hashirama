# read modules - chapter - list of topics makes a data app for each one - in the
#submodule_file_names=$(jq -r '.modules[].sub_modules[] | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "")' data/odyssey/modules.json)
for filename in $submodule_file_names; do  # Indentation fixed here
    #echo "Processing $filename"  # Add a command inside the loop
#    mkdir -p "data/odyssey/$filename"
done

#bun infra/scripts/course_gen_step_2.js

#bun infra/scripts/course_gen_step_4.js
# Find all 'examples' folders in 'course_content' and move their 'data' and 'components' folders
# find course_content -type d -name "examples" | while read -r example_dir; do
#     # Move 'data' and 'components' folders to 'course_content/src'
#     if [ -d "$example_dir/data" ]; then
#         mv "$example_dir/data" course_content/src/
#     fi
#     if [ -d "$example_dir/components" ]; then
#         mv "$example_dir/components" course_content/src/
#     fi

#     # Prepend the content of 'src/index.md' from the 'examples' folder to 'course_content/src/index.md'
#     if [ -f "$example_dir/src/index.md" ]; then
#         cat "$example_dir/src/index.md" course_content/src/index.md > temp_index.md
#         mv temp_index.md course_content/src/index.md
#     fi
# done
