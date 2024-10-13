


# read modules - chapter - list of topics
# makes a data app for each one - in the

# Check if the JSON path is correct and the file is not empty

rm data/odyssey/*.md

#file_names=$(jq -r '.modules[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json)


#file_names=$(jq -r '.modules[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json)
# submodule_file_names=$(jq -r '.modules[].sub_modules[] | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json)
# echo $submodule_file_names

# #echo $file_names

for filename in $submodule_file_names; do  # Indentation fixed here
    echo "Processing $filename"  # Add a command inside the loop
    # Add your desired command here, for example:
    touch "course_content/src/$filename"

    echo "---" > "course_content/src/$filename"
    echo "title: $filename" >> "course_content/src/$filename"
    echo "toc: true" >> "course_content/src/$filename"
    echo "---" >> "course_content/src/$filename"
    done
python3 infra/scripts/course_gen_step_2.py --query "gen a markdown of example markdown about the robotics topic " --input_dir data/odyssey/  --output_dir=data/odyssey/
cp 
