import subprocess

# Define the input and output file paths
import os
import subprocess

# Define the input and output directories
input_dir = "./static/videos/"
output_dir = "./static/videos/converted/"

# Ensure the output directory exists
#os.makedirs(output_dir, exist_ok=True)

# Iterate through all files in the input directory
for filename in os.listdir(input_dir):
    if filename.endswith(".ivf"):
        input_file = os.path.join(input_dir, filename)
        output_file = os.path.join(output_dir, os.path.splitext(filename)[0] + ".mp4")

        # Define the ffmpeg command
        command = [
            "ffmpeg",
            "-i", input_file,
            "-c:v", "libx264",
            "-an",  # Remove audio
            output_file
        ]

        # Execute the command
        subprocess.run(command, capture_output=True)
        print(filename, "complete")

print("Conversion complete!")

# always new stream
