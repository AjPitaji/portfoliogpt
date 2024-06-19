import subprocess

# Define the WinSCP command and script file path
winscp_path = r"C:\Program Files (x86)\WinSCP\WinSCP.com"
script_path = r"I:\ds\check_ftp_connection.txt"

# Run the WinSCP command using subprocess
result = subprocess.run([winscp_path, '/script', script_path], capture_output=True, text=True)

# Check the output for authentication success
if 'Authentication failed' in result.stdout or 'Host does not exist' in result.stdout:
    print("Authentication failed or host does not exist.")
elif 'Session started' in result.stdout:
    print("Authentication successful.")
else:
    print("Could not determine the authentication status.")

# Print the full output for debugging purposes
print("\nFull Output:\n", result.stdout)