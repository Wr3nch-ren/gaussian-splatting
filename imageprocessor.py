# From TODO
# Image Automation [Need Date Time Renamer, Compressed file reader, Full Folder Reader] {Might try on creation time}

# Detect Compressed File Type (.zip) then extract to another directory

import os
import cv2
import patoolib
import shutil
import tkinter as tk
from tkinter import messagebox as mb
from tkinter import filedialog as fd
from PIL import Image
from pillow_heif import register_heif_opener

# For selecting compressed files
def open_file_selection():
    file_path = fd.askopenfilename(
        title="Select a compressed file or video",
        filetypes=[
            ("Compressed files", "*.zip *.tar *.gz *.rar *.7z *.bz2 *.xz"),
            ("Video files", "*.mp4 *.avi *.mov *.mkv *.flv *.wmv *.webm *.mpg *.mpeg *.3gp")
        ]
    )
    # check for video or zip file
    if file_path:
        if file_path.lower().endswith(('.zip', '.tar', '.gz', '.rar', '.7z', '.bz2', '.xz')):
            extract_file(file_path)
        elif file_path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm', '.mpg', '.mpeg', '.3gp')):
            convert_video_to_jpg(file_path)
        else:
            mb.showerror("Error", "Unsupported file type selected")
        
# For directory creation
def create_clean_dir(dir):
    if os.path.exists(dir):
        shutil.rmtree(dir)
    os.makedirs(dir)
    
# Function to move files from subdirectories to the main directory
def move_files_to_main_directory(main_directory):
    for root, dirs, files in os.walk(main_directory, topdown=False):
        for name in files:
            file_path = os.path.join(root, name)
            shutil.move(file_path, main_directory)
        for name in dirs:
            os.rmdir(os.path.join(root, name))

# For Extract file
def extract_file(file_path):
    extracted_dir = "input"
    create_clean_dir(extracted_dir)
    try:
        # Extract the archive file using patoolib
        patoolib.extract_archive(file_path, outdir=extracted_dir)
        move_files_to_main_directory(extracted_dir)
        convert_images_to_jpg(extracted_dir)
        mb.showinfo("Success", f"Extracted {file_path} to {extracted_dir}")
    except Exception as e:
        mb.showerror("Error", f"Failed to extract {file_path}. Error: {e}")

# For Image conversion
def convert_images_to_jpg(directory):
    register_heif_opener()
    image_formats = ('.heic', '.png', '.bmp', '.gif', '.tiff', '.webp', '.jpeg', '.jpg')  # Add more formats if needed
    
    for photo in os.listdir(directory):
        full_photo_path = os.path.join(directory, photo)

        # Skip non-files and non-supported formats
        if not os.path.isfile(full_photo_path):
            print(f"{full_photo_path} is not supported.")
            continue

        # Check file extension
        if photo.lower().endswith('.jpg'):
            print(f"{photo} is already a JPG. Skipping.")
            continue

        # Process non-JPG images
        if photo.lower().endswith(image_formats):
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

# For Video Conversion to images
def convert_video_to_jpg(directory):
    video = cv2.VideoCapture(directory)
    try:
        if not os.path.exists("input"):
            os.makedirs("input")
    except OSError:
        print("Error: Creating input directory")

    currentframe = 0
    while(True):
        ret,frame = video.read()
        
        if ret:
            name = "./input/" + str(currentframe) + ".jpg"
            print("Creating..."+name)
            
            cv2.imwrite(name, frame)
            currentframe+=1
        else:
            break
    video.release()
    cv2.destroyAllWindows()
open_file_selection()