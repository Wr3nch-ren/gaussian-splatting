import fabric
import os

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

sshcontent = open('ssh.txt', 'r').readlines()
host_domain = sshcontent[0].strip()
username = sshcontent[1].strip()
port_number = sshcontent[2].strip()

connection = fabric.Connection(host=host_domain,
                               user=username,
                               port=str(port_number))
connection.run("mkdir -p ~/testing_folder3")
#tilda doesn't work for put()
#connection.put("./testing_folder/testing_text.txt", f"/data/home/{username}/testing_folder/testing_text.txt")
upload_directory(connection, './testing_folder', f'/data/home/{username}/testing_folder/')
download_directory(connection, f"/data/home/{username}/testing_folder", ".\\testing_folder3")
#connection.run(f"rm -rf /data/home/{username}/testing_folder")
connection.close()