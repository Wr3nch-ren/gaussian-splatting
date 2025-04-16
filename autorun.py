#From TODO
# Extracting Automation (Have Script) [Need Auto Linker] {Slight Modification on Original Script to change mode}
# One Button Picture Viewing + UI (Have Viewer) [Need UI] {Full Auto + Semi Auto}

# Making Auto Linker

import tkinter as tk
import os
import sys
import subprocess
import fabric

env_name = "gaussian_splatting"
training_mode = "cpu"
local_mode = True
renderer_mode = "web"

# Default Advanced settings for training
resolution = 1
white_background = True
sh_degree = 3
final_iteration = 30000
save_iteration = 7000
densify_from_iter = 500
densify_until_iter = 15000

# This function will handle file uploading
def upload_directory(connection, local_dir, remote_dir):
    def upload_recursive(local_path, remote_path):
        # Iterate over the items in the local directory
        for item in os.listdir(local_path):
            local_item_path = os.path.join(local_path, item)
            remote_item_path = os.path.join(remote_path, item).replace("\\", "/")
            
            if os.path.isdir(local_item_path):
                # If it's a directory, create the directory on the remote server
                connection.run(f"mkdir -p {remote_item_path}", hide=True)
                
                # Recursively upload the contents of the directory
                upload_recursive(local_item_path, remote_item_path)
            elif os.path.isfile(local_item_path):
                # If it's a file, upload it to the remote server
                connection.put(local_item_path, remote_item_path)
            else:
                # Handle other types of items if necessary (e.g., symbolic links)
                pass
    
    # Start the recursive upload from the base local and remote directories
    upload_recursive(local_dir, remote_dir)

# This function will handle file downloading
def download_directory(connection, remote_dir, local_dir):
    def download_recursive(remote_path, local_path):
        # Ensure local directory exists
        if not os.path.exists(local_path):
            os.makedirs(local_path)
        
        # List items in the remote directory
        result = connection.run(f"ls {remote_path}", hide=True)
        items = result.stdout.splitlines()
        
        for item in items:
            remote_item_path = os.path.join(remote_path, item).replace("\\", "/")
            local_item_path = os.path.join(local_path, item)

            # Check if the item is a directory
            if connection.run(f"test -d {remote_item_path}", hide=True, warn=True).ok:
                # If it's a directory, create the directory locally and download contents
                if not os.path.exists(local_item_path):
                    os.makedirs(local_item_path)
                download_recursive(remote_item_path, local_item_path)
            elif connection.run(f"test -f {remote_item_path}", hide=True, warn=True).ok:
                # If it's a file, download it
                connection.get(remote_item_path, local_item_path)
            else:
                # Handle other types of items if necessary
                pass

    # Start the recursive download from the base remote and local directories
    download_recursive(remote_dir, local_dir)

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
        if white_background:
            command = f'conda activate {env_name} && python {filename} -s . -m ./output/ -w --data_device {training_mode} --resolution {resolution} --sh_degree {sh_degree} --final_iteration {final_iteration} --save_iteration {save_iteration} --densify_from_iter {densify_from_iter} --densify_until_iter {densify_until_iter}'
        else:
            command = f'conda activate {env_name} && python {filename} -s . -m ./output/ --data_device {training_mode} --resolution {resolution} --sh_degree {sh_degree} --final_iteration {final_iteration} --save_iteration {save_iteration} --densify_from_iter {densify_from_iter} --densify_until_iter {densify_until_iter}'
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
        print("Command executed successfully")
        print(stdout.decode())
    else:
        print("Error executing command")
        print(stderr.decode())

# This function will run in local
def run_convert_script():
    if is_conda_environment_active(env_name):
        command = [sys.executable, "convert.py", "-s", "."]
        process = subprocess.Popen(command, stdout=sys.stdout, stderr=sys.stderr)
    else:
        run_in_conda_env(env_name, "convert.py")

    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("Command executed successfully")
        # print(stdout.decode())
    else:
        print("Error executing command")
        # print(stderr.decode())

# This function will run in cluster
def run_train_script():
    if not local_mode:
        # Connect to cluster
        
        # Tutorial for non-local: Make a ssh.txt file with this exact pattern in your directory
        '''
        hostdomain
        username
        portnumber
        ''' 
        sshcontent = open('ssh.txt', 'r').readlines()
        domain = sshcontent[0].strip()
        username = sshcontent[1].strip()
        port_number = sshcontent[2].strip()
        # "fabric" will automatically read your ssh private key in your local path
        connection = fabric.Connection(host=domain,
                                       user=username,
                                       port=port_number)
        # Check if directory is exist
        isExist = connection.run(f"test -d /data/home/{username}/gaussian-splatting/sparse && echo True || echo False")
        # Deletes old directory if it is exist
        if bool(isExist):
            connection.run("rm -rf ~/gaussian-splatting/sparse")
        # Making an empty folder
        connection.run("mkdir ~/gaussian-splatting/sparse")
        # Upload sparse file to cluster for training
        upload_directory(connection, './sparse', f'/data/home/{username}/gaussian-splatting/')
        # From: python train.py -s $FOLDER_PATH -, $FOLDER_PATH/output
        # Train using container
        #connection.run("singularity exec --nv gaussian-splatting.sif python train.py -s ./gaussian-splatting -m ./gaussian-splatting/output -w")
        # Get the output folder into local directory
        download_directory(connection, "./gaussian-splatting/output", ".\\output")
        # When everything is ended, disconnect
        connection.close()
    else:
        if is_conda_environment_active(env_name):
            if white_background:
                command = [sys.executable, 
                           "train.py", 
                           "-s", ".", 
                           "-m", "./output/", 
                           "-w", 
                           "--data_device", training_mode, 
                           "--resolution", str(resolution), 
                           "--sh_degree", str(sh_degree), 
                           "--final_iteration", str(final_iteration), 
                           "--save_iteration", str(save_iteration), 
                           "--densify_from_iter", str(densify_from_iter), 
                           "--densify_until_iter", str(densify_until_iter)]
            else:
                command = [sys.executable, 
                           "train.py", 
                           "-s", ".", 
                           "-m", "./output/", 
                           "--data_device", training_mode, 
                           "--resolution", str(resolution), 
                           "--sh_degree", str(sh_degree), 
                           "--final_iteration", str(final_iteration), 
                           "--save_iteration", str(save_iteration), 
                           "--densify_from_iter", str(densify_from_iter), 
                           "--densify_until_iter", str(densify_until_iter)]
            process = subprocess.Popen(command, stdout=sys.stdout, stderr=sys.stderr)
        else:
            run_in_conda_env(env_name, "train.py")

        stdout, stderr = process.communicate()
        if process.returncode == 0:
            print("Command executed successfully")
            # print(stdout.decode())
        else:
            print("Error executing command")
            # print(stderr.decode())

# This function will run in local
# Using point cloud tools to convert output and visualize using splat
def run_visualizer():
    if renderer_mode == "executable":
        command = ["SIBR_gaussianViewer_app", "-m", "./output/"]
    if renderer_mode == "web":
        # Convert using point cloud tools directory
        command = ["python", 
                   "point-cloud-tools/convert.py", 
                   "./output/point_cloud/iteration_30000/point_cloud.ply",
                   "./output/iteration_30000.splat",
                   "--ply_input_format=inria"]
        print(".ply to .splat conversion is successful, sending redirect url to web browser via ws_server.py")
    process = subprocess.Popen(command, stdout=sys.stdout, stderr=sys.stderr)
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("Command executed successfully")
        # print(stdout.decode())
    else:
        print("Error executing command")
        # print(stderr.decode())

# Run all scripts
def autorun():
    run_imageprocessor()
    run_convert_script()
    run_train_script()
    run_visualizer()

# autorun()