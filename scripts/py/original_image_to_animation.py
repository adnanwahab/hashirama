import ollama
import replicate
from PIL import Image, ImageSequence
import requests
import sys
### use desktop --- get a flux endpoint 
file_path = "static/jp/downloaded_image.gif"
output_path = "static/jp/downloaded_image_mutated.gif"
REPLICATE_API_TOKEN="r8_NflAOISFvIpGr1sWDNKCrfOTl9PKAQ73sGJ9x"


def user_land(src):
    frames = get_frames_from_gif(src)

    frames = get_most_different_frames(frames)
    labeled_frames = label_frames(frames)
    print(labeled_frames)
    mutated_frames = mutate_frames([frame for frame, _ in labeled_frames])
    #mutated_frames = remove_bg(mutated_frames)
    output_path = convert_frames_to_gif([frame for frame, _ in mutated_frames], output_path)
    return output_path

def get_most_different_frames(frames):
    # get 5 frames - most different 
    print(frames)
    return frames[0: len(frames) - 1: len(frames)// 5]

def get_image(src):
    try:
        with open(file_path, "rb") as file:
            file_content = file.read()
            print("File read successfully.")
            return file_content
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")



def get_frames_from_gif(src):

    try:
        with Image.open(file_path) as img:
            frames = [frame.copy() for frame in ImageSequence.Iterator(img)]
            print(f"GIF successfully divided into {len(frames)} frames.")
            return frames
            # for i, frame in enumerate(frames):
            #     frame.save(f"/static/original_image/frame_{i:03d}.png")
            return frames
    except Exception as e:
        print(f"An error occurred while processing the GIF: {e}")

        # import torch
        # from transformers import LlamaForImageClassification, LlamaProcessor

        # # Load the pre-trained model and processor
        # model = LlamaForImageClassification.from_pretrained("microsoft/llava-v1-vit")
        # processor = LlamaProcessor.from_pretrained("microsoft/llava-v1-vit")

        # annotations = []

        # for i, frame in enumerate(frames):
        #     # Preprocess the frame
        #     inputs = processor(images=frame, return_tensors="pt")

        #     # Perform the annotation
        #     with torch.no_grad():
        #         outputs = model(**inputs)
        #         logits = outputs.logits
        #         predicted_class_idx = logits.argmax(-1).item()
        #         predicted_class = model.config.id2label[predicted_class_idx]

        #     annotations.append((f"frame_{i:03d}.png", predicted_class))
        #     print(f"Frame {i:03d} annotated as {predicted_class}")

        # # Save annotations to a file
        # annotations_file_path = "/static/original_image/annotations.txt"
        # try:
        #     with open(annotations_file_path, "w") as annotations_file:
        #         for frame_name, annotation in annotations:
        #             annotations_file.write(f"{frame_name}: {annotation}\n")
        #     print(f"Annotations saved successfully to {annotations_file_path}")
        # except Exception as e:
        #     print(f"An error occurred while saving annotations: {e}")





def label_frames(frames):
    labeled_frames = []
    for i, frame in enumerate(frames):
        # Save the frame temporarily
        temp_path = f"temp_frame_{i}.png"
        frame.save(temp_path)
        
        # Process the frame with Ollama
        res = ollama.chat(
            model="llava:7b",
            messages=[
                {
                    'role': 'user',
                    'content': 'Describe this image:',
                    'images': [temp_path]
                }
            ]
        )
        
        # Add the labeled frame to the list
        labeled_frames.append((frame, res['message']['content']))
        
        # Remove the temporary file
        import os
        os.remove(temp_path)
    
    return labeled_frames

def control_net(frame):
    client = replicate.Client(api_token=REPLICATE_API_TOKEN)

    output = client.run(
        "rossjillian/controlnet:795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
        input={
            "eta": 0,
            "seed": 20,
            "image": "https://replicate.delivery/pbxt/IYQLHLFDraqCrjDUoiwpM9xBhQM1eQVHbxBiNxcbwctUamzb/user_1.png",
            "scale": 9,
            "steps": 20,
            "prompt": "left half of image = original, right half of image = scribble",
            "scheduler": "DDIM",
            "structure": "scribble",
            "num_outputs": 1,
            "low_threshold": 100,
            "high_threshold": 200,
            "negative_prompt": "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            "image_resolution": 512,
            "return_reference_image": False
        }
    )
    print(output)
    return output

#flux + infill - just use replicate 
def mutate_frames(frames):
    mutated_frames = []
    for frame in frames:
        mutated_frames.append(control_net(frame))
    return mutated_frames

def remove_bg(frame):
    input = {
        "image": "https://replicate.delivery/pbxt/Ho28olmw8dnOffOz7yjuPK6UGsOPqFUfpCnq1ur8zaAKxiPH/animal-1.jpeg"
    }

    output = replicate.run(
        "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        input=input
    )
    print(output)

def convert_frames_to_gif(frames, output_path):
    frames[0].save(output_path, save_all=True, append_images=frames[1:], optimize=False, duration=100, loop=0)
    return True



def download_image(url, output_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(output_path, 'wb') as file:
            file.write(response.content)
        print(f"Image downloaded successfully to {output_path}")
    else:
        print(f"Failed to download image. Status code: {response.status_code}")
        sys.exit(1)

def process_image(image_path):
    # Your existing image processing code goes here
    print(f"Processing image: {image_path}")
    # ... (rest of your image processing logic)

def main():
    # Read the URL from the file
    with open("static/jp/original.txt", "r") as file:
        url = file.read().strip()

    # Define the output path for the downloaded image
    output_path = "static/jp/downloaded_image.gif"

    # Download the image
    download_image(url, output_path)

    # Process the downloaded image
    if user_land(output_path):
        print("done")
    else:
        print("failed")

if __name__ == "__main__":
    main()

# try collaboratory - and get jupyter as good - before using it again ..









