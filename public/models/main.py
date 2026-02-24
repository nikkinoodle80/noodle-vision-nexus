import csv
import zipfile
import os

def load_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.reader(f))

def activate_scene():
    overlays = load_csv("MCP_Manifest/overlays.csv")
    glossary = load_csv("MCP_Manifest/glossary.csv")
    recovery = load_csv("MCP_Manifest/recovery_snapshot.csv")
    print("🧠 Noodle-VISION Runtime Activated")
    print(f"📦 Loaded {len(overlays)} overlays")
    print(f"📚 Loaded {len(glossary)} glossary terms")
    print(f"🛠️ Recovery agents: {len(recovery)}")

    # Simulate fallback unpack
    zip_path = "MCP_Manifest/fallback_protocols/FULL_PIPELINE_NOTION.ZIP"
    if os.path.exists(zip_path):
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall("MCP_Manifest/fallback_protocols/unpacked")
            print("✅ Fallback ZIP unpacked")

activate_scene()