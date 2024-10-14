


# read modules - chapter - list of topics
# makes a data app for each one - in the

# Check if the JSON path is correct and the file is not empty

#rm data/odyssey/*.md

#file_names=$(jq -r '.modules[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json)


#file_names=$(jq -r '.modules[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json)
submodule_file_names=$(jq -r '.modules[].sub_modules[] | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "")' data/odyssey/modules.json)
# echo $submodule_file_names

# #echo $file_names

for filename in $submodule_file_names; do  # Indentation fixed here
    #echo "Processing $filename"  # Add a command inside the loop
    # Add your desired command here, for example:
    mkdir -p "data/odyssey/$filename"
done
#python3 infra/scripts/course_gen_step_2.py --query "gen a markdown of example markdown about the robotics topic " --input_dir data/odyssey/  --output_dir=data/odyssey/



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
