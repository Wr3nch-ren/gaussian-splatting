#From TODO
# Extracting Automation (Have Script) [Need Auto Linker] {Slight Modification on Original Script to change mode}
# One Button Picture Viewing + UI (Have Viewer) [Need UI] {Full Auto + Semi Auto}

# Making Auto Linker

import tkinter as tk
import os
import sys
import subprocess

env_name = "gaussian_splatting"
training_mode = "cuda"

# This function will run in local
def run_imageprocessor():
    imageprocessor_script = "./imageprocessor.py"
    result = subprocess.run(
        ["python", imageprocessor_script]
    )
    return result

# This function will run in local
def is_conda_environment_active(env_name):
    return os.environ.get("CONDA_DEFAULT_ENV") == env_name

def run_in_conda_env(env_name, filename):
    
    # This function will run in local
    if filename == "convert.py":
        command = f'conda activate {env_name} && python {filename} -s .'
        
        # Initialize conda environment
        ps_script = f'''
        $env:CONDA_DEFAULT_ENV = "{env_name}"
        conda activate $env:CONDA_DEFAULT_ENV
        {command}
        '''
        
        process = subprocess.Popen(["powershell", "-Command", ps_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # This function will run in slurm ssh
    if filename == "train.py":
        if training_mode == "cuda":
            command = f'conda activate {env_name} && python {filename} -s . -m ./output/ -w --data_device cuda'
        if training_mode == "cpu":
            command = f'conda activate {env_name} && python {filename} -s . -m ./output/ -w --data_device cpu'
        else:
            command = f'conda activate {env_name} && python {filename} -s . -m ./output/ -w'
            
        # Initialize conda environment
        ps_script = f'''
        $env:CONDA_DEFAULT_ENV = "{env_name}"
        conda activate $env:CONDA_DEFAULT_ENV
        {command}
        '''
        
        # Modification to linux bash
        process = subprocess.Popen(["bash", "-Command", ps_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    stdout, stderr = process.communicate()

    if process.returncode == 0:
        print("Command executed successfully:")
        print(stdout.decode())
    else:
        print("Error executing command:")
        print(stderr.decode())

# This function will run in local
def run_convert_script():
    if is_conda_environment_active(env_name):
        command = [sys.executable, "convert.py", "-s", "."]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    else:
        run_in_conda_env(env_name, "convert.py")

    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("Command executed successfully:")
        print(stdout.decode())
    else:
        print("Error executing command:")
        print(stderr.decode())

# This function will run in slurm ssh
def run_train_script():
    if is_conda_environment_active(env_name):
        if training_mode == "cuda":
            command = [sys.executable, "train.py", "-s", ".", "-m", "./output/", "-w", "--data_device", "cuda"]
        if training_mode == "cpu":
            command = [sys.executable, "train.py", "-s", ".", "-m", "./output/", "-w", "--data_device", "cpu"]
        else:
            command = [sys.executable, "train.py", "-s", ".", "-m", "./output/", "-w"]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    else:
        run_in_conda_env(env_name, "train.py")

    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("Command executed successfully:")
        print(stdout.decode())
    else:
        print("Error executing command:")
        print(stderr.decode())

# This function will run in local
# Pending for web visualizer
def run_visualizer():
    command = ["SIBR_gaussianViewer_app", "-m", "./output/"]
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("Command executed successfully:")
        print(stdout.decode())
    else:
        print("Error executing command:")
        print(stderr.decode())

# Run all scripts
def autorun():
    run_imageprocessor()
    run_convert_script()
    run_train_script()
    run_visualizer()

autorun()