import cv2
import numpy as np
from torchvision import transforms
import os
import json
from collections import defaultdict
from PIL import Image, ImageEnhance
import glob
import generator
import torch
from torchvision.utils import save_image

# Use relative paths for Docker compatibility
UPLOADS_DIR = "uploads"
FRAGMENTS_DIR = "fragments"
METADATA_FILE = "fragment_metadata.json"

def breakIntoPieces(input_dir=UPLOADS_DIR, output_dir=FRAGMENTS_DIR, metadata_file=METADATA_FILE):
    os.makedirs(output_dir, exist_ok=True)
    metadata_list = []
    panel_num = 0
    
    # Use os.path.join for cross-platform safety
    image_paths = glob.glob(os.path.join(input_dir, "*.png"))
    
    for img_path in image_paths:
        img = cv2.imread(img_path)
        if img is None:
            continue
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            if w > 100 and h > 100:
                fragment = img[y:y+h, x:x+w]
                resized_fragment = cv2.resize(fragment, (128, 128), interpolation=cv2.INTER_AREA)
                
                fragment_name = f"fragment{panel_num}.png"
                fragment_path = os.path.join(output_dir, fragment_name)
                
                cv2.imwrite(fragment_path, resized_fragment)
                metadata_list.append({
                    "base_image": os.path.basename(img_path),
                    "original_width": img.shape[1],
                    "original_height": img.shape[0],
                    "x": x, "y": y, "w": w, "h": h,
                    "fragment_filename": fragment_name
                })
                panel_num += 1

    with open(metadata_file, "w") as f:
        json.dump(metadata_list, f, indent=2)

def colorise(gen=generator.gen, DEVICE=generator.DEVICE, input_dir=FRAGMENTS_DIR):
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=1),
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
    ])

    gen.eval()
    image_paths = glob.glob(os.path.join(input_dir, "*.png"))
    
    for img_path in image_paths:
        img = Image.open(img_path)
        input_tensor = transform(img).unsqueeze(0).to(DEVICE) 
        
        with torch.no_grad():
            output = gen(input_tensor)
            # Rescale from [-1, 1] to [0, 1]
            output = (output + 1) / 2
            
            # Save directly back to the fragment path
            save_image(output, img_path)  
            enhance_to_match(img_path, img_path)

def enhance_to_match(input_img_path, out_path, 
                     contrast_factor=1.1, saturation_factor=1.3, 
                     sharpness_factor=1.7, brightness_factor=1.0):
    img = Image.open(input_img_path).convert("RGB")
    img = ImageEnhance.Contrast(img).enhance(contrast_factor)
    img = ImageEnhance.Color(img).enhance(saturation_factor)
    img = ImageEnhance.Sharpness(img).enhance(sharpness_factor)
    img = ImageEnhance.Brightness(img).enhance(brightness_factor)
    img.save(out_path)

def reconstruct(fragment_dir=FRAGMENTS_DIR, output_dir=UPLOADS_DIR, metadata_file=METADATA_FILE):
    if not os.path.exists(metadata_file):
        print("Metadata file not found.")
        return

    with open(metadata_file, "r") as f:
        metadata_list = json.load(f)

    fragments_by_image = defaultdict(list)
    for item in metadata_list:
        fragments_by_image[item["base_image"]].append(item)

    for base_image, fragments in fragments_by_image.items():
        original_width = fragments[0]['original_width']
        original_height = fragments[0]['original_height']
        
        # Create white canvas (255) instead of manual pixel looping (faster)
        canvas = np.full((original_height, original_width, 3), 255, dtype=np.uint8)

        for frag in fragments:
            frag_path = os.path.join(fragment_dir, frag["fragment_filename"])
            fragment_img = cv2.imread(frag_path)
            if fragment_img is None:
                continue
            
            fragment_resized = cv2.resize(fragment_img, (frag["w"], frag["h"]))
            x, y, w, h = frag["x"], frag["y"], frag["w"], frag["h"]
            canvas[y:y+h, x:x+w] = fragment_resized
            
        # Standardize the final output name
        cv2.imwrite("return.png", canvas)

def delete_all_files_in_folder(folder_path):
    if not os.path.exists(folder_path):
        return
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")