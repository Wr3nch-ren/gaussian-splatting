#From TODO
# Extracting Automation (Have Script) [Need Auto Linker] {Slight Modification on Original Script to change mode}
# One Button Picture Viewing + UI (Have Viewer) [Need UI] {Full Auto + Semi Auto}

# Making Auto Linker

import tkinter as tk
import os
import sys
import subprocess

def run_imageprocessor():
    imageprocessor_script = "./imageprocessor.py"
    
    # try:
    #     result = subprocess.run(
    #         ["python", imageprocessor_script]
    #     )
    pass

def is_conda_environment_active(env_name):
    return os.environ.get("CONDA_DEFAULT_ENV") == env_name

def run_convert_in_conda_env(env_name):
    command = f'conda activate {env_name} && python convert.py -s .'
    
    ps_script = f'''
    $env:CONDA_DEFAULT_ENV = "{env_name}"
    conda activate $env:CONDA_DEFAULT_ENV
    {command}
    '''
    
    process = subprocess.Popen(["powershell", "-Command", ps_script], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    if process.returncode == 0:
        print("Command executed successfully:")
        print(stdout.decode())
    else:
        print("Error executing command:")
        print(stderr.decode())
        
def run_python_script():
    env_name = "gaussian_splatting"
    
    if is_conda_environment_active(env_name):
        command = [sys.executable, "convert.py", "-s", "."]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    else:
        run_convert_in_conda_env(env_name)
        
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("Command executed successfully:")
        print(stdout.decode())
    else:
        print("Error executing command:")
        print(stderr.decode())
        
def some_function():
    print("Some function is running...")
    run_python_script()
    
some_function()