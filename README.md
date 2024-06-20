import xml.etree.ElementTree as ET

def get_transmission_mode(xml_file):
    # Parse the XML file
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Find the TransmissionMode tag
    transmission_mode = root.find('TransmissionMode')

    # Check if the tag was found and return its text content
    if transmission_mode is not None:
        return transmission_mode.text
    else:
        return None

if __name__ == "__main__":
    xml_file = 'example.xml'  # Replace with your XML file path
    transmission_mode = get_transmission_mode(xml_file)
    if transmission_mode:
        print(f'TransmissionMode: {transmission_mode}')
    else:
        print('TransmissionMode tag not found')