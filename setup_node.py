import os
import sys
import urllib.request
import zipfile
import shutil

DEST_DIR = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\Users\\shett\\AppData\\Local"), "NodeJS")
ZIP_URL = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
ZIP_PATH = os.path.join(os.environ.get("TEMP", "C:\\Users\\shett\\AppData\\Local\\Temp"), "node.zip")

def setup_node():
    node_exe = os.path.join(DEST_DIR, "node.exe")
    if os.path.exists(node_exe):
        print(f"Node already present at {node_exe}")
        return

    print(f"Downloading Node.js v20.18.0 from {ZIP_URL}...")
    urllib.request.urlretrieve(ZIP_URL, ZIP_PATH)
    print("Extracting Node.js...")
    extract_temp = os.path.join(os.environ.get("TEMP", "C:\\Users\\shett\\AppData\\Local\\Temp"), "node_extracted")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        zip_ref.extractall(extract_temp)

    extracted_folder = os.path.join(extract_temp, "node-v20.18.0-win-x64")
    if os.path.exists(DEST_DIR):
        shutil.rmtree(DEST_DIR)
    shutil.move(extracted_folder, DEST_DIR)
    print(f"Node.js successfully installed to {DEST_DIR}")

if __name__ == "__main__":
    setup_node()
