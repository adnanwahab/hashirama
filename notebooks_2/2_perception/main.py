
from PIL import Image, ImageOps
import os
# horizontal / vertical notebook - diffrent views on same data - annotaiton
# Define paths
# Expand '~' to the full user path
# input_image_path = os.path.expanduser(input_image_path)
# output_image_path = os.path.expanduser(output_image_path)

input_image_path = os.path.expanduser("~/hashirama/services/homelab-status-page/static/webcam.jpg")
output_image_path = os.path.expanduser("~/hashirama/services/homelab-status-page/static/jupyter_webcam.jpg")
#input_image_path = 'https://hashirama.blog/static/webcam.jpg'
#https://hashirama.blog/static/jupyter_webcam.jpg";

# Open the image

def overwrite_img():
    with Image.open(input_image_path) as img:
        # Flip the image (horizontally or vertically)
        flipped_img = ImageOps.mirror(img)  # Horizontal flip
        # Invert the colors of the image
        inverted_img = ImageOps.invert(flipped_img.convert("RGB"))

        # Save the modified image
        inverted_img.save(output_image_path)

    print(f"Processed image saved to {output_image_path}")
overwrite_img()


import time

def my_function():
    overwrite_img()
    time.sleep(1)
    my_function()
    print("shit dog")
# Run the function every 1000 seconds
my_function()
