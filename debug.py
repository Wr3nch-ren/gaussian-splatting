import fabric
import glob
import os

sshcontent = open('ssh.txt', 'r').readlines()
host_domain = sshcontent[0].strip()
username = sshcontent[1].strip()
port_number = sshcontent[2].strip()

connection = fabric.Connection(host=host_domain,
                               user=username,
                               port=str(port_number))
connection.run("mkdir -p ~/testing_folder")
#tilda doesn't work for put()
#connection.put("./testing_folder/testing_text.txt", f"/data/home/{username}/testing_folder/testing_text.txt")
allfile = []
for filename in os.listdir("./testing_folder/"):
        allfile.append(filename)
        local_file = os.path.join("./testing_folder/", filename)
        if os.path.isfile(local_file):
            remote_file = os.path.join(f"/data/home/{username}/testing_folder/", filename)
            connection.put(local_file, remote_file)
for filename in allfile:
    connection.run("cat ~/testing_folder/" + filename)
connection.run(f"rm -rf /data/home/{username}/testing_folder")
connection.close()