
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import logging
# 40 left - 60 days - already -20 
# from sam2.build_sam import build_sam2
# from sam2.automatic_mask_generator import SAM2AutomaticMaskGenerator
from pathlib import Path

def mask_generate(original_path="../homelab-status-page/static/webcam.jpg"):
    import os
    # if using Apple MPS, fall back to CPU for unsupported ops
    os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"
    import numpy as np
    import torch
    import matplotlib.pyplot as plt
    from PIL import Image
    # red vs blue
    # day 9 - rewidn -> apm 
    # yugioh abridged 
    # seinfeld
    print("predicted images")
    
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
    

    import os

# Original file path
    # original_path = "../homelab-status-page/static/sensor_data/webcam_20240919_185834.jpg"
    
    # Split the original path into directory and filename
    directory, filename = os.path.split(original_path.replace("webcam", "mutated_webcam"))
    
    # Modify the filename
    #new_filename = filename.replace("webcam_", "mutated_")
    
    # Combine the directory and new filename to get the new path
    new_path = os.path.join(directory, filename)
    
    print(f"Original Path: {original_path}")
    print(f"New Path: {new_path}")
    
    output_dir = Path(directory)
    #output_dir.mkdir(parents=True, exist_ok=True) 

    output_file_path = output_dir / filename
    print("going to save file at " + str(output_file_path))
# siwtch back and ofrth between verbzaliaton + action - so others follow along 
    # print("opening " + url)
    # #print(output)
    # print("opening " + url)
    #return url
    image = Image.open(original_path)
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
    
    #print(len(masks))
    #print(masks[0].keys())
    
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
    #output_file_path_2 = output_dir / (file_name.split('.')[0] + '_2.png')
    print(f"Segmented image saved at: {output_file_path}")



# Set up logging
logging.basicConfig(filename='directory_changes.log', level=logging.INFO, format='%(asctime)s - %(message)s')

class DirectoryEventHandler(FileSystemEventHandler):
    def on_modified(self, event):
        logging.info(f"Modified: {event.src_path}")

    def on_created(self, event):
        print("HI", event.src_path)
        import time
        start_time = time.time() 

        mask_generate(event.src_path)

        end_time = time.time() 
        print(f"Appending chunk shit to file took {end_time - start_time:.4f} seconds.")
     
#        image_predictor('../homelab-status-page/static/sensor_data/')
        logging.info(f"Created: {event.src_path}")

    def on_deleted(self, event):
        print("HI", event)
        logging.info(f"Deleted: {event.src_path}")

# Directory to be monitored
directory_to_watch = '../homelab-status-page/static/sensor_data/webcam/'

event_handler = DirectoryEventHandler()
observer = Observer()
observer.schedule(event_handler, path=directory_to_watch, recursive=True)
observer.start()

try:
    while True:
        print("5 seconds elapsed")
        time.sleep(5)
except KeyboardInterrupt:
    observer.stop()
observer.join()


