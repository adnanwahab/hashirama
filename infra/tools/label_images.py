import os
from PIL import Image
import torch
from transformers import ViTForImageClassification, ViTFeatureExtractor
import pytesseract

# Set up paths to your image folders
home_dir = os.path.expanduser("~/Downloads/old-photos")
# Function to get all folder paths in the home directory
def get_all_folders_in_home():
    folders = []
    for root, dirs, files in os.walk(home_dir):
        for dir_name in dirs:
            folders.append(os.path.join(root, dir_name))
    return folders

# Get all folder paths in the home directory
folder_paths = get_all_folders_in_home()
# Load a pretrained Vision Transformer model from Hugging Face

# Load the Vision Transformer model
model_name = "google/vit-base-patch16-224"
model = ViTForImageClassification.from_pretrained(model_name)
feature_extractor = ViTFeatureExtractor.from_pretrained(model_name)

# Switch to evaluation mode
model.eval()

# Function to load and preprocess the image for ViT
def load_image(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = feature_extractor(images=image, return_tensors="pt")
    return inputs

# Function to extract text using Tesseract OCR
def extract_text(image_path):
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from {image_path}: {e}")
        return None
import json

def convert_image_to_supported_format(image_path):
    try:
        image = Image.open(image_path)
        # Convert to RGB format if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Save a temporary PNG version of the image
        new_image_path = image_path.replace(".jpeg", ".png")
        image.save(new_image_path, format="PNG")
        return new_image_path
    except Exception as e:
        print(f"Error converting image {image_path}: {e}")
        return None
    

def process_image(image_path):
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
            
        label = model.config.id2label[predicted_class_idx]
        print(label)
        # Extract text from the image
        text = extract_text(image_path)
        return text if text else "No text found"
    
# Function to label images and check for text like Gmail
def label_images_in_folder(folder_path, results):
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                # Load and preprocess image
                inputs = load_image(file_path)
                
                # Make prediction using Vision Transformer
                with torch.no_grad():
                    outputs = model(**inputs)
                    logits = outputs.logits
                    predicted_class_idx = logits.argmax(-1).item()
                
                label = model.config.id2label[predicted_class_idx]
                
                # Extract text from the image
                text = extract_text(file_path)
                results[file_path] = text if text else "No text found"
            
            except Exception as e:
                new_path = convert_image_to_supported_format(file_path)
                text = extract_text(new_path)
                if text:
                    results[new_path] = text
                else: 
                    print(f"Error processing {file_name}: {e}")

# Dictionary to store results
results = {}

# Process images in each folder
for folder in folder_paths:
    label_images_in_folder(folder, results)

# Save results to a JSON file in the home directory
output_path = os.path.join(home_dir, "butt_image_texts.json")
print(output_path, 'DONE')
with open(output_path, "w") as json_file:
    json.dump(results, json_file, indent=4)