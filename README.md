import xml.etree.ElementTree as ET

# Sample XML content
xml_content = '''<ftp>
<transmissiontype>winscp</transmissiontype>
<ftpprm>
    <hostname>example.com</hostname>
    <userid>user123</userid>
    <ppkfilename>key.ppk</ppkfilename>
</ftpprm>
</ftp>'''

# Parse the XML content
root = ET.fromstring(xml_content)

# Extract required elements
transmission_type = root.find('transmissiontype').text
hostname = root.find('ftpprm/hostname').text
userid = root.find('ftpprm/userid').text
ppkfilename = root.find('ftpprm/ppkfilename').text

# Print the extracted information
print(f'Transmission Type: {transmission_type}')
print(f'Hostname: {hostname}')
print(f'User ID: {userid}')
print(f'PPK Filename: {ppkfilename}')