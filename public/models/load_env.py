# load_env.py
# ✅ Loads Nicole's .env file and injects keys into runtime

from dotenv import load_dotenv
import os

# Load .env from current folder
load_dotenv(dotenv_path=".env")

# Injected keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NOTION_TOKEN = os.getenv("NOTION_TOKEN")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
MAKE_WEBHOOK_URL = os.getenv("MAKE_WEBHOOK_URL")
DRIVE_FOLDER_ID = os.getenv("DRIVE_FOLDER_ID")
NB2_AGENT_TOKEN = os.getenv("NB2_AGENT_TOKEN")

# Validate injection
print("✅ Keys loaded:")
print(f"OPENAI_API_KEY: {OPENAI_API_KEY[:8]}...")
print(f"NOTION_TOKEN: {NOTION_TOKEN[:8]}...")
print(f"GITHUB_TOKEN: {GITHUB_TOKEN[:8]}...")