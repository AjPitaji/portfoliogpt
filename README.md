# Connect to the server using SFTP protocol
open sftp://fts150023@fts2.mfts.jpmchase.net -privatekey=W:\puttygen\LIQ_SSH2RSA_2048_prod.ppk

# Check if the session started successfully
# List remote directory to check if the session is active
ls

# Exit WinSCP
exit