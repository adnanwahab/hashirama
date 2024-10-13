# read modules - chapter - list of topics
# makes a data app for each one - in the

# Check if the JSON path is correct and the file is not empty
rm course_content/docs/*.md

python3 infra/scripts/course_gen_step_2.py --query "gen a markdown of example markdown about the robotics topic " --input_dir data/robotics-odyssey/  --output_dir=js/course_content/docs/
