
# Lightly adapted from https://github.com/facebookresearch/segment-anything/blob/main/notebooks/automatic_mask_generator_example.ipynb
# ! ls youtube
# ! mkdir -p youtube/output_frames
import cv2
import os

def extract_frames(video_path, output_folder):
    # Open the video file
    video = cv2.VideoCapture(video_path)
    
    if not video.isOpened():
        print("Error: Could not open video.")
        return

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    frame_count = 0
    while True:
        # Read the next frame from the video
        success, frame = video.read()

        # If there are no more frames, break the loop
        if not success:
            break

        # Save the frame as an image file
        frame_path = os.path.join(output_folder, f"frame_{frame_count:05d}.jpg")
        cv2.imwrite(frame_path, frame)

        # Increment the frame count
        frame_count += 1

    # Release the video capture object
    video.release()
    print(f"Extracted {frame_count} frames to {output_folder}")

# https://blog.roboflow.com/edge-detection/
import cv2
import numpy as np
import matplotlib.pyplot as plt

def edge_detection_2():
    # Load the image
    image_path = 'flower.jpg'  # Replace with your image path
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 1.4)
    
    # Apply Canny edge detector
    edges = cv2.Canny(blurred_image, 100, 200)
    
    # Display the result
    plt.figure(figsize=(10, 5))
    
    # Original image
    plt.subplot(1, 2, 1)
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.title('Original Image')
    plt.axis('off')
    
    # Edge-detected image
    plt.subplot(1, 2, 2)
    plt.imshow(edges, cmap='gray')
    plt.title('Canny Edge Detection')
    plt.axis('off')
    
    plt.show()


    #https://blog.roboflow.com/edge-detection/

# Example usage
mp4 = os.listdir('youtube/')
output_dir = 'youtube/output_frames/'    # Directory to save the frames

for video_file in mp4:
    video_file = 'youtube/'+video_file
    print(video_file)
    # try:
    #     os.mkdir()
    #     print(f"Directory '{directory_name}' created successfully.")
    # except FileExistsError:
    #     print(f"Directory '{directory_name}' already exists.")
    #extract_frames(video_file, output_dir + video_file)
    pass

# get each frame -> process frame -> convert to svg 
# from sam2.build_sam import build_sam2
# from sam2.automatic_mask_generator import SAM2AutomaticMaskGenerator
from pathlib import Path

def mask_generate(url="../homelab-status-page/static/webcam.jpg"):
    import os
    # if using Apple MPS, fall back to CPU for unsupported ops
    os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"
    import numpy as np
    import torch
    import matplotlib.pyplot as plt
    from PIL import Image
    
    # select the device for computation
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print(f"using device: {device}")
    
    if device.type == "cuda":
        # use bfloat16 for the entire notebook
        torch.autocast("cuda", dtype=torch.bfloat16).__enter__()
        # turn on tfloat32 for Ampere GPUs (https://pytorch.org/docs/stable/notes/cuda.html#tensorfloat-32-tf32-on-ampere-devices)
        if torch.cuda.get_device_properties(0).major >= 8:
            torch.backends.cuda.matmul.allow_tf32 = True
            torch.backends.cudnn.allow_tf32 = True
    elif device.type == "mps":
        print(
            "\nSupport for MPS devices is preliminary. SAM 2 is trained with CUDA and might "
            "give numerically different outputs and sometimes degraded performance on MPS. "
            "See e.g. https://github.com/pytorch/pytorch/issues/84936 for a discussion."
        )
    
    np.random.seed(3)
    
    def show_anns(anns, borders=True):
        if len(anns) == 0:
            return
        sorted_anns = sorted(anns, key=(lambda x: x['area']), reverse=True)
        ax = plt.gca()
        ax.set_autoscale_on(False)
    
        img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
        img[:, :, 3] = 0
        for ann in sorted_anns:
            m = ann['segmentation']
            color_mask = np.concatenate([np.random.random(3), [0.5]])
            img[m] = color_mask 
            if borders:
                import cv2
                contours, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE) 
                # Try to smooth contours
                contours = [cv2.approxPolyDP(contour, epsilon=0.01, closed=True) for contour in contours]
                cv2.drawContours(img, contours, -1, (0, 0, 1, 0.4), thickness=1) 
    
        ax.imshow(img)
    file_name = url
    
    output_dir = Path('./youtube/semseg/ohshc__Finding_out_Haruhi_is_a_girl/')
    output_dir = Path('./mask_output/')
    output_dir.mkdir(parents=True, exist_ok=True) 

    output_file_path = output_dir / file_name
    print("going to save file at " + str(output_file_path))

    # print("opening " + url)
    # #print(output)
    # print("opening " + url)

    #return url
    image = Image.open('./youtube/output_frames/ohshc__Finding_out_Haruhi_is_a_girl/' + url)
    image = np.array(image.convert("RGB"))
    
    plt.figure(figsize=(20, 20))
    plt.imshow(image)
    plt.axis('off')
    plt.show()
    
    from sam2.build_sam import build_sam2
    from sam2.automatic_mask_generator import SAM2AutomaticMaskGenerator
    
    sam2_checkpoint = "./sam2_hiera_tiny.pt"
    model_cfg = "sam2_hiera_t.yaml"
    
    sam2 = build_sam2(model_cfg, sam2_checkpoint, device=device, apply_postprocessing=False)
    
    mask_generator = SAM2AutomaticMaskGenerator(sam2)
    
    masks = mask_generator.generate(image)
    
    print(len(masks))
    print(masks[0].keys())
    
    plt.figure(figsize=(20, 20))
    plt.imshow(image)
    show_anns(masks)
    plt.axis('off')
    plt.show()
    
    mask_generator_2 = SAM2AutomaticMaskGenerator(
        model=sam2,
        points_per_side=64,
        points_per_batch=128,
        pred_iou_thresh=0.7,
        stability_score_thresh=0.92,
        stability_score_offset=0.7,
        crop_n_layers=1,
        box_nms_thresh=0.7,
        crop_n_points_downscale_factor=2,
        min_mask_region_area=25.0,
        use_m2m=True,
    )
    
    masks2 = mask_generator_2.generate(image)
    
    plt.figure(figsize=(20, 20))
    plt.imshow(image)
    show_anns(masks2)
    plt.axis('off')
    #plt.show()
    plt.savefig(output_file_path, bbox_inches='tight', pad_inches=0)
    plt.close()  # Close the plot to free up memory
    output_file_path_2 = output_dir / (file_name.split('.')[0] + '_2.png')
    print(f"Segmented image saved at: {output_file_path}")



def mask_generate(url="../homelab-status-page/static/webcam.jpg"):
    import os
    # if using Apple MPS, fall back to CPU for unsupported ops
    import numpy as np
    import torch
    import matplotlib.pyplot as plt
    from PIL import Image
    
    # select the device for computation
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
    print(f"using device: {device}")
    
    if device.type == "cuda":
        # use bfloat16 for the entire notebook
        torch.autocast("cuda", dtype=torch.bfloat16).__enter__()
        # turn on tfloat32 for Ampere GPUs (https://pytorch.org/docs/stable/notes/cuda.html#tensorfloat-32-tf32-on-ampere-devices)
        if torch.cuda.get_device_properties(0).major >= 8:
            torch.backends.cuda.matmul.allow_tf32 = True
            torch.backends.cudnn.allow_tf32 = True
    elif device.type == "mps":
        print(
            "\nSupport for MPS devices is preliminary. SAM 2 is trained with CUDA and might "
            "give numerically different outputs and sometimes degraded performance on MPS. "
            "See e.g. https://github.com/pytorch/pytorch/issues/84936 for a discussion."
        )
    
    np.random.seed(3)
    
    def show_anns(anns, borders=True):
        if len(anns) == 0:
            return
        sorted_anns = sorted(anns, key=(lambda x: x['area']), reverse=True)
        ax = plt.gca()
        ax.set_autoscale_on(False)
    
        img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
        img[:, :, 3] = 0
        for ann in sorted_anns:
            m = ann['segmentation']
            color_mask = np.concatenate([np.random.random(3), [0.5]])
            img[m] = color_mask 
            if borders:
                import cv2
                contours, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE) 
                # Try to smooth contours
                contours = [cv2.approxPolyDP(contour, epsilon=0.01, closed=True) for contour in contours]
                cv2.drawContours(img, contours, -1, (0, 0, 1, 0.4), thickness=1) 
    
        ax.imshow(img)
    
    image = Image.open(url)
    image = np.array(image.convert("RGB"))
    
    plt.figure(figsize=(20, 20))
    plt.imshow(image)
    plt.axis('off')
    plt.show()
    
    from sam2.build_sam import build_sam2
    from sam2.automatic_mask_generator import SAM2AutomaticMaskGenerator
    
    sam2_checkpoint = "./nosam2_hiera_tiny.pt"
    model_cfg = "sam2_hiera_t.yaml"
    
    sam2 = build_sam2(model_cfg, sam2_checkpoint, device=device, apply_postprocessing=False)
    
    mask_generator = SAM2AutomaticMaskGenerator(sam2)
    
    masks = mask_generator.generate(image)
    
    print(len(masks))
    print(masks[0].keys())
    
    plt.figure(figsize=(20, 20))
    plt.imshow(image)
    show_anns(masks)
    plt.axis('off')
    plt.show()
    
    mask_generator_2 = SAM2AutomaticMaskGenerator(
        model=sam2,
        points_per_side=64,
        points_per_batch=128,
        pred_iou_thresh=0.7,
        stability_score_thresh=0.92,
        stability_score_offset=0.7,
        crop_n_layers=1,
        box_nms_thresh=0.7,
        crop_n_points_downscale_factor=2,
        min_mask_region_area=25.0,
        use_m2m=True,
    )
    
    masks2 = mask_generator_2.generate(image)
    
    plt.figure(figsize=(20, 20))
    plt.imshow(image)
    show_anns(masks2)
    plt.axis('off')
    plt.show()





# from pytubefix import Playlist
# from pytubefix import YouTube 

# from pytubefix.cli import on_progress
# SAVE_PATH = "./youtube" 

# brown_blue_math_playlists = [
#     'https://www.youtube.com/watch?v=d-o3eB9sfls&list=PLZHQObOWTQDPHP40bzkb0TKLRPwQGAoC-',
#     'https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
#     'https://www.youtube.com/watch?v=WUvTyaaNkzM&list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
#     'https://www.youtube.com/watch?v=r6sGWTCMz2k&list=PLZHQObOWTQDN52m7Y21ePrTbvXkPaWVSg',
#     'https://www.youtube.com/watch?v=OkmNXy7er84&list=PLZHQObOWTQDMXMi3bUMThGdYqos36X_lA',
#     'https://www.youtube.com/watch?v=8rrHTtUzyZA&list=PLZHQObOWTQDMp_VZelDYjka8tnXNpXhzJ',
# ]

# SAVE_PATH = "./youtube/mp4_content/"

# def download_yt(link):
#     SAVE_PATH = "./youtube/mp4_content/" 
#     try: 
#         # object creation using YouTube 
#         yt = YouTube(link) 
#     except Exception as e: 
#         # to handle exception and print error
#         print(f"Connection Error for {link}: {e}")
#         return  # Exit the function if there's an error

#     # Check if yt is defined
#     if yt is not None:
#         # Get all streams and filter for mp4 files
#         mp4_streams = yt.streams.filter(file_extension='mp4').all()

#         # Check if there are any mp4 streams
#         if mp4_streams:
#             # get the video with the highest resolution
#             d_video = mp4_streams[0]
            
#             try: 
#                 # downloading the video 
#                 d_video.download(output_path=SAVE_PATH)
#                 print('Video downloaded successfully!')
#             except Exception as e: 
#                 print(f"Some Error occurred while downloading {link}: {e}")
#         else:
#             print(f"No mp4 streams available for {link}")
#     else:
#         print(f"yt object not created for {link}")

# youtube_86_motiongraphics_playlist = ['https://www.youtube.com/playlist?list=PL79TBmLa4lTTq9w7AYjaLo9RSXkzrihVY']

# for playlist in (brown_blue_math_playlists + youtube_86_motiongraphics_playlist): 
#     pl = Playlist(playlist)
#     for url in pl.video_urls:
#         print(url)
#         download_yt(url)
import os
from pytubefix import YouTube 
from pytubefix.cli import on_progress
from pytubefix.innertube import _default_clients

#apm  - effective  - 

# art of tennis

SAVE_PATH = "./youtube" #to_do 
apple = 'https://www.youtube.com/watch?v=cwCMV7LF6S4'
#apple = 'https://youtu.be/cwCMV7LF6S4?si=BvAYyjbT4dkoiM1E'
todoroki = 'https://www.youtube.com/watch?v=wpOhT35YtWg'
light = 'https://www.youtube.com/watch?v=fiZhLla-2wA'
flower = 'https://www.youtube.com/watch?v=QSKBJvq8FDI&pp=ygURb3VyYW4gcGFpbnRpbmcgMjQ%3D'
logos = 'https://www.youtube.com/watch?v=1tj7Y3PR16s'
names = 'logos flower light todoroki apple'.split(' ')
links = [logos, flower, light, todoroki, apple] 
# https://github.com/JuanBindez/pytubefix
#os.chdir(r"./youtube")
def download_yt(name, link):
    try: 
        # object creation using YouTube 
        yt = YouTube(link) 
    except: 
        #to handle exception 
        print("Connection Error") 
    
    # Get all streams and filter for mp4 files
    mp4_streams = yt.streams.filter(file_extension='mp4'
                                    #, on_progress_callback = on_progress
                                   ).all()
    
    # get the video with the highest resolution
    d_video = mp4_streams[0]
    #print(mp4_streams)
    try: 
        # downloading the video 
        d_video.download(output_path=SAVE_PATH)
        print('Video downloaded successfully!')
    except: 
        print("Some Error!")

# for i, link in enumerate(links): 
#     download_yt(names[i], link)
#download_yt('apple', apple)


import os
import time
from pytubefix import Playlist, YouTube, exceptions
from pytubefix.cli import on_progress

SAVE_PATH = "./youtube/mp4_content/"

# List of playlists to download
brown_blue_math_playlists = [
    'https://www.youtube.com/watch?v=d-o3eB9sfls&list=PLZHQObOWTQDPHP40bzkb0TKLRPwQGAoC-',
    'https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
    'https://www.youtube.com/watch?v=WUvTyaaNkzM&list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
    'https://www.youtube.com/watch?v=r6sGWTCMz2k&list=PLZHQObOWTQDN52m7Y21ePrTbvXkPaWVSg',
    'https://www.youtube.com/watch?v=OkmNXy7er84&list=PLZHQObOWTQDMXMi3bUMThGdYqos36X_lA',
    'https://www.youtube.com/watch?v=8rrHTtUzyZA&list=PLZHQObOWTQDMp_VZelDYjka8tnXNpXhzJ',
]

youtube_86_motiongraphics_playlist = ['https://www.youtube.com/playlist?list=PL79TBmLa4lTTq9w7AYjaLo9RSXkzrihVY']

# Combined list of playlists
playlists = brown_blue_math_playlists + youtube_86_motiongraphics_playlist

def video_exists(video_title):
    """Check if the video file already exists in the SAVE_PATH directory."""
    # Create a valid filename by replacing illegal characters
    filename = f"{video_title}.mp4".replace('/', '-').replace('\\', '-').replace('|', '-').replace('?', '')
    return os.path.exists(os.path.join(SAVE_PATH, filename))

def download_yt(link):
    """Download the YouTube video from the provided link if it doesn't already exist."""
    try: 
        # Create YouTube object
        yt = YouTube(link)
        video_title = yt.title

        if video_exists(video_title):
            print(f"Video '{video_title}' already exists. Skipping download.")
            return

        # Filter for mp4 streams
        mp4_streams = yt.streams.filter(file_extension='mp4')
        
        # Get the highest resolution video
        if mp4_streams:
            d_video = mp4_streams.order_by('resolution').desc().first()
            
            try: 
                # Download the video 
                d_video.download(output_path=SAVE_PATH)
                print(f"Video '{video_title}' downloaded successfully!")
            except Exception as e: 
                print(f"Error occurred while downloading '{video_title}': {e}")
        else:
            print(f"No mp4 streams available for '{video_title}'")
            
    except exceptions.VideoUnavailable:
        print(f"Video {link} is unavailable. Skipping.")
    except exceptions.RegexMatchError:
        print(f"Invalid video URL: {link}. Skipping.")
    except Exception as e: 
        print(f"An error occurred: {e}")
    finally:
        # Rate limiting to avoid triggering warnings
        time.sleep(2)  # Wait for 2 seconds before processing the next video

# for playlist in playlists: 
#     pl = Playlist(playlist)
#     for url in pl.video_urls:
#         print(f"Processing {url}")
#         download_yt(url)



import cv2
import os

def extract_frames(video_path, output_folder):
    # Open the video file
    video = cv2.VideoCapture(video_path)
    if not video.isOpened():
        print(f"Error: Could not open video: {video_path}")
        return
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    frame_count = 0
    while True:
        # Read the next frame from the video
        success, frame = video.read()

        # If there are no more frames, break the loop
        if not success:
            break

        # Save the frame as an image file
        frame_path = os.path.join(output_folder, f"frame_{frame_count:05d}.jpg")
        cv2.imwrite(frame_path, frame)

        # Increment the frame count
        frame_count += 1

    # Release the video capture object
    video.release()
    print(f"Extracted {frame_count} frames to {output_folder}")

# Example usage
mp4_files = os.listdir('youtube/mp4_content/')
output_dir = 'youtube/output_frames/'  # Directory to save the frames

def divide_frames(mp4_file):
    for video_file in mp4_files:
        pass
        #video_path = os.path.join('youtube/mp4_content', video_file)  # Full path to the video
        print(f"Processing video: {video_path}")
        
        if video_file.endswith('.mp4'):  # Ensure we're only processing mp4 files
            extract_frames(video_path, os.path.join(output_dir, video_file.replace(".mp4", "")))
        else:
            print(f"Skipping non-video file: {video_file}")
    #1 download 1000 videos
#2. split into frames
#3. process frames
#3a segment -> convert masked areas to SVG -> triagnluate svg to match dcolors
#3b label frames
#3c high entropy frames - seam carving
#3d replicate / apis to try stuff -> move to local to optimize + make chaepr
#4. join svg frames into lottie
# SAVE_PATH = "./youtube/mp4_content" 
# print(SAVE_PATH)
# import os
# #! mkdir -p youtube/mp4_content
# os.listdir('youtube/mp4_content')

import cv2
import os
from pathlib import Path

def extract_frames(video_path, output_folder):
    # Open the video file
    video = cv2.VideoCapture(str(video_path))  # Convert Path object to string
    
    if not video.isOpened():
        print(f"Error: Could not open video: {video_path}")
        return

    # Create the output folder if it doesn't exist
    output_folder.mkdir(parents=True, exist_ok=True)

    frame_count = 0
    while True:
        # Read the next frame from the video
        success, frame = video.read()

        # If there are no more frames, break the loop
        if not success:
            break

        # Save the frame as an image file
        frame_path = output_folder / f"frame_{frame_count:05d}.jpg"
        cv2.imwrite(str(frame_path), frame)

        # Increment the frame count
        frame_count += 1

    # Release the video capture object
    video.release()
    print(f"Extracted {frame_count} frames to {output_folder}")

# Example usage
mp4_files = Path('.').glob('*.mp4')  # Use Pathlib to get all .mp4 files in the folder
output_dir = Path('youtube/output_frames')  # Directory to save the frames

#mp4_files = ["output_reencoded.mp4"]
#mp4_files = ["./shit.mp4"]
# for video_file in mp4_files:
#     pass
#     video_path = video_file
#     print(f"Processing video: {video_path}")
# #    video_output_folder = './'
#     video_output_folder = output_dir / video_file.stem  # Create subfolder based on video file name
#     extract_frames(video_path, video_output_folder)

from diffusers import FluxPipeline
import torch

ckpt_id = "black-forest-labs/FLUX.1-schnell"
prompt = [
    "an astronaut riding a rhino",
    # more prompts here
]
height, width = 1024, 1024
def working_flux():
# denoising
    pipe = FluxPipeline.from_pretrained(
        ckpt_id,
        torch_dtype=torch.bfloat16,
    )
    pipe.vae.enable_tiling()
    pipe.vae.enable_slicing()
    pipe.enable_sequential_cpu_offload() # offloads modules to CPU on a submodule level (rather than model level)
    
    image = pipe(
        prompt,
        num_inference_steps=1,
        guidance_scale=0.0,
        height=height,
        width=width,
    ).images[0]
    return image



import cv2
import numpy as np
import matplotlib.pyplot as plt

from PIL import Image

def pixelate_image(image_path, output_path, pixel_size):
    """
    Apply a pixelation effect to an image and save the result.
    
    :param image_path: Path to the input image
    :param output_path: Path to save the pixelated image
    :param pixel_size: Size of the pixels in the pixelated image
    """
    # Open the image
    img = Image.open(image_path)
    
    # Calculate the size of the reduced image
    small_img_size = (img.width // pixel_size, img.height // pixel_size)
    
    # Resize down
    small_img = img.resize(small_img_size, resample=Image.NEAREST)
    
    # Resize up to original size
    pixelated_img = small_img.resize(img.size, Image.NEAREST)
    
    # Save the result
    pixelated_img.save(output_path)
    #pixelated_img.show()
    return pixelated_img



# Paths to input and output images
#https://files.hashirama.blog/youtube/output_frames/Easy%20Falling%20Leaves%20-%20Adobe%20After%20Effects%20tutorial/frame_00097.jpg
src = 'youtube/output_frames/Easy Falling Leaves - Adobe After Effects tutorial/'

# ass_dir = 'Easy Falling Leaves - Adobe After Effects tutorial/'
# base_dir = 'youtube/output_frames/'
#source_dir = base_dir + ass_dir
img_name = 'frame_00605.jpg'
input_image_path = src + img_name  # Original image
output_image_path = "./pixelated_image.png"  # Pixelated image output

# Pixel size for the effect
pixel_size = 16

# Apply pixelation effect
#print(input_image_path)
#pixelated_img = pixelate_image(input_image_path, output_image_path, pixel_size)
#display(pixelated_img)
#main(output_image_path)


def prewitt_edge_detection(image):
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply horizontal Prewitt kernel
    kernel_x = np.array([[-1, 0, 1],
                         [-1, 0, 1],
                         [-1, 0, 1]])
    horizontal_edges = cv2.filter2D(gray_image, -1, kernel_x)
    
    # Apply vertical Prewitt kernel
    kernel_y = np.array([[-1, -1, -1],
                         [0, 0, 0],
                         [1, 1, 1]])
    vertical_edges = cv2.filter2D(gray_image, -1, kernel_y)    
    # Ensure both arrays have the same data type
    horizontal_edges = np.float32(horizontal_edges)
    vertical_edges = np.float32(vertical_edges)
    
    # Compute gradient magnitude
    gradient_magnitude = cv2.magnitude(horizontal_edges, vertical_edges)
    
    # Optional: Apply thresholding to highlight edges
    threshold = 50
    _, edges = cv2.threshold(gradient_magnitude, threshold, 255, cv2.THRESH_BINARY)
    
    return edges

    # Read the input image
    image = cv2.imread('flower.jpg')
    
    # Apply Prewitt edge detection
    edges = prewitt_edge_detection(image)
    
    # Plotting both images using subplots
    plt.figure(figsize=(10, 5))
    
    # Original Image
    plt.subplot(1, 2, 1)
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.title('Original Image')
    plt.axis('off')
    
    # Detected Edges
    plt.subplot(1, 2, 2)
    plt.imshow(edges, cmap='gray')
    plt.title('Prewitt Edge Detection')
    plt.axis('off')

#plt.show()

#print('Max mem allocated (GB) while denoising:', torch.cuda.max_memory_allocated() / (1024 ** 3))


##https://github.com/barbagroup/AeroPython

# jeremey howard
# peter norvig
# lucumr
# simonw
# https://github.com/thombashi/sqlitebiter
# https://github.com/topics/python
# https://pypi.org/project/pixels2svg/
# https://medium.com/@anand.butani/from-pixels-to-vectors-mastering-image-to-svg-conversion-with-python-eca75805b247
# https://pypi.org/project/svglib/
# https://github.com/mapbox/earcut
# https://medium.com/skymod-tech/re-birth-of-the-game-changer-sam-2-segment-anything-model-2-by-meta-ai-6b9a5a9f50b9
# https://github.com/facebookresearch/segment-anything-2/blob/main/notebooks/video_predictor_example.ipynb
# https://github.com/facebookresearch/segment-anything-2/blob/main/notebooks/image_predictor_example.ipynb
# https://github.com/facebookresearch/segment-anything-2/blob/main/notebooks/automatic_mask_generator_example.ipynb
# https://docs.ultralytics.com/usage/python/#track
# https://docs.ultralytics.com/hub/quickstart/
# https://docs.ultralytics.com/guides/object-counting/
# https://docs.ultralytics.com/guides/heatmaps/#real-world-applications
# https://tailwindui.com/components/application-ui/data-display/calendars
# https://observablehq.com/@mbostock/packing-circles-inside-a-rectangle
# https://github.github.com/gfm/
# https://x.com/flornkm/status/1835655689936445948
# https://threejs.org/examples/css3d_periodictable
# https://replicate.com/yorickvp/llava-v1.6-mistral-7b
# https://replicate.com/yorickvp/llava-13b
# https://replicate.com/zsxkib/whisper-lazyloading
# https://medium.com/skymod-tech/re-birth-of-the-game-changer-sam-2-segment-anything-model-2-by-meta-ai-6b9a5a9f50b9
# https://github.com/facebookresearch/segment-anything-2?tab=readme-ov-file
# https://github.com/facebookresearch/segment-anything-2/blob/main/notebooks/image_predictor_example.ipynb
# https://github.com/facebookresearch/segment-anything-2/blob/main/notebooks/image_predictor_example.ipynb
# https://huggingface.co/models
# https://replicate.com/ayumuakagi/segment_anything_model?prediction=jbt36s09ndrg80chzjhrtcgfp8
# https://github.com/facebookresearch/segment-anything-2/blob/main/notebooks/video_predictor_example.ipynb
# http://localhost:8000/every-research-paper-zoox-waymo-visualized
# https://replicate.com/daanelson/yolox
# https://replicate.com/adirik/grounding-dino
