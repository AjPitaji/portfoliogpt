import subprocess

def open_shell_and_run_command():
    try:
        # Open a new terminal window and run the command
        subprocess.run(["gnome-terminal", "--", "bash", "-c", "ds tool; exec bash"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    open_shell_and_run_command()