import subprocess
from constants import USERNAME, PASSWORD, HOST, PORT, DBNAME, QUERY

# Construct the connection string
conn_str = f"{USERNAME}/{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

# Construct the SQL*Plus command
sqlplus_command = f"sqlplus -S {conn_str}"

# Create the full SQL script
sql_script = f"SET PAGESIZE 50000\nSET LINESIZE 32767\nSET FEEDBACK OFF\nSET HEADING OFF\n{QUERY};\nEXIT;\n"

# Run the command using subprocess
result = subprocess.run(
    sqlplus_command,
    input=sql_script,
    text=True,
    shell=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Check for errors
if result.returncode != 0:
    print("Error:", result.stderr)
else:
    print("Query Result:\n", result.stdout.strip())