# From TODO
# Image Automation [Need Date Time Renamer, Compressed file reader, Full Folder Reader] {Might try on creation time}

# Detect Compressed File Type (.zip) then extract to another directory

import os
import zipfile
import patoolib
import shutil
import tkinter as tk
from tkinter import filedialog as fd, messagebox
from PIL import Image
from pillow_heif import register_heif_opener

# For selecting compressed files
def open_compressed_file_selection():
    file_path = fd.askopenfilename(
        title="Select a compressed file",
        filetypes=[("Compressed files", "*.zip *.tar *.gz *.rar *.7z *.bz2 *.xz")]
    )
    if file_path:
        extract_file(file_path)
        
# For directory creation
def create_clean_dir(dir):
    if os.path.exists(dir):
        shutil.rmtree(dir)
    os.makedirs(dir)

# For Extract file
def extract_file(file_path):
    extracted_dir = "input"
    create_clean_dir(extracted_dir)
    try:
        # Extract the archive file using patoolib
        patoolib.extract_archive(file_path, outdir=extracted_dir)
        convert_images_to_jpg(extracted_dir)
        messagebox.showinfo("Success", f"Extracted {file_path} to {extracted_dir}")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to extract {file_path}. Error: {e}")

# For Image conversion
def convert_images_to_jpg(directory):
    register_heif_opener()
    image_formats = ('.heic', '.png', '.bmp', '.gif', '.tiff', '.webp')  # Add more formats if needed
    image_files = [photo for photo in os.listdir(directory) if photo.lower().endswith(image_formats)]
    print(f"Found image files: {image_files}")
    
    for photo in image_files:
        full_photo_path = os.path.join(directory, photo)
        try:
            temp_img = Image.open(full_photo_path)
            jpg_photo = os.path.join(directory, os.path.splitext(photo)[0] + ".jpg")
            temp_img.convert("RGB").save(jpg_photo, "JPEG")
            print(f"Converted {photo} to {jpg_photo}")
            
            # Delete the original file
            os.remove(full_photo_path)
            print(f"Deleted original file {photo}")
        except Exception as e:
            print(f"Failed to convert {photo}. Error: {e}")

open_compressed_file_selection()