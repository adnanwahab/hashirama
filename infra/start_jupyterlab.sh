#!/bin/bash

# Activate your virtual environment or conda environment if needed
# source ~/myenv/bin/activate

eval "$(micromamba shell hook --shell bash)"

micromamba activate sam

# Start JupyterLab
jupyter lab --no-browser --ip=0.0.0.0 --port=8888 &
