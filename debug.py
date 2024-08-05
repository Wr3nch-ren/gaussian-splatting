import fabric
import glob

sshcontent = open('ssh.txt', 'r').readlines()
host_domain = sshcontent[0].strip()
username = sshcontent[1].strip()
port_number = sshcontent[2].strip()

connection = fabric.Connection(host=host_domain,
                               user=username,
                               port=str(port_number))
connection.run("mkdir -p ~/testing_folder")
connection.put("./testing_folder/*", "~/testing_folder")
connection.run("cat ~/testing_folder/testing_text.txt")
connection.run("rm -rf ~/testing_folder")
connection.close()