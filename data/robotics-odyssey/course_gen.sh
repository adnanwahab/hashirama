# read modules - chapter - list of topics
# makes a data app for each one - in the

# Check if the JSON path is correct and the file is not empty
jq -r '.modules[].topics[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".json"' data/robotics-odyssey/modules.json

for filename in $(jq -r '.modules[].topics[].title | gsub(" "; "-") | ascii_downcase | gsub("[^a-z0-9-]"; "") + ".md"' data/robotics-odyssey/modules.json); do
    echo "Processing $filename"  # Add a command inside the loop
done

python3 notebooks_2/course-content-observable-data-app/docs/course_gen_step_2.py --query "gen a markdown of example markdown about the robotics topic " --input_dir data/robotics-odyssey/  --output_dir=js/course_content/docs/
