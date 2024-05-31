#From TODO
# Extracting Automation (Have Script) [Need Auto Linker] {Slight Modification on Original Script to change mode}
# One Button Picture Viewing + UI (Have Viewer) [Need UI] {Full Auto + Semi Auto}

# Making Auto Linker

import tkinter as tk
import subprocess

def run_imageprocessor():
    imageprocessor_script = "./imageprocessor.py"
    
    try:
        result = subprocess.run(
            ["python", imageprocessor_script]
        )