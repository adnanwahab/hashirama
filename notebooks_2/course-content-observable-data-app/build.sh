#!/bin/bash

npm run observable convert https://observablehq.com/@roboticsuniversity/scratch-pad-for-robotics-university
npm run observable convert https://observablehq.com/@roboticsuniversity/1-hardware-design-repair
npm run observable convert https://observablehq.com/@roboticsuniversity/2-perception
npm run observable convert https://observablehq.com/@roboticsuniversity/3-planning-prediction
npm run observable convert https://observablehq.com/@roboticsuniversity/4-real-world-applications-command-control-ui-and-h
npm run observable convert https://observablehq.com/@roboticsuniversity/5-science-and-mathmagic-theory



#rm docs/*.md

#ln -s  ../simulation/readme.m docs/5_simulation.md
# ln -s ../command-control-cooperative-ui/readme.md docs/4_command_control_ui.md
# ln -s ../planning-prediction/readme.md docs/3_planning_prediction.md
# ln -s ../perception/readme.md docs/2_perception.md
# ln -s ../hardware/readme.md docs/1_hardware.md
# ln -s ../../readme.md docs/index.md

# cp ../../readme.md docs/index.md
# cp ../hardware/readme.md docs/1_hardware.md
# cp ../perception/readme.md docs/2_perception.md
# cp ../planning-prediction/readme.md docs/3_planning_prediction.md
# cp ../command-control-cooperative-ui/readme.md docs/4_command_control_ui.md
# cp ../simulation/readme.md docs/5_simulation.md


# version=$1
# echo "Version specified: $version"

# # Exit in case of error
# set -e

# echo "Cleaning build directories..."
# rm -rf build/
# rm -rf dist/
# rm -rf latentscope/web/dist

# echo "Removing old virtual environment..."
# rm -rf testenv-whl/

# echo "Deactivating the virtual environment..."
# # just in case we are in a virtual env already
# # deactivate

# echo "Building the wheel..."
# python3 setup.py sdist bdist_wheel

# echo "Creating a new virtual environment..."
# python3 -m venv testenv-whl

# echo "Activating the virtual environment..."
# source testenv-whl/bin/activate

# echo "Installing the wheel..."
# pip install "dist/latentscope-${version}-py3-none-any.whl"

# echo "Deactivating the virtual environment..."
# deactivate

# echo "Build and preparation completed."
