import subprocess

def run_ftp_command(server, username, password):
    commands = f"""
    open {server}
    user {username} {password}
    quit
    """
    
    # Run the FTP command
    process = subprocess.Popen(['ftp', '-n'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    output, error = process.communicate(commands)
    
    if error:
        print(f"Error: {error}")
    else:
        print(output)

# Replace with your local FTP server details
server = '127.0.0.1'
username = 'your_username'
password = 'your_password'

run_ftp_command(server, username, password)
