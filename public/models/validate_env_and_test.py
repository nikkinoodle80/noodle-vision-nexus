# validate_env_and_test.py
# ✅ Validates .env keys and performs dry-run OpenAI call

from dotenv import load_dotenv
import os
import requests

# Load .env
load_dotenv(dotenv_path=".env")

# Required keys
required_keys = [
    "OPENAI_API_KEY",
    "NOTION_TOKEN",
    "GITHUB_TOKEN",
    "MAKE_WEBHOOK_URL",
    "DRIVE_FOLDER_ID",
    "NB2_AGENT_TOKEN"
]

# Check for missing keys
missing = [key for key in required_keys if not os.getenv(key)]
if missing:
    print("❌ Missing keys:")
    for key in missing:
        print(f" - {key}")
    exit(1)
else:
    print("✅ All keys present.")

# Dry-run OpenAI call
api_key = os.getenv("OPENAI_API_KEY")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Say hello"}]
}

try:
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    if response.status_code == 200:
        print("✅ Dry-run OpenAI call succeeded.")
        print("🔁 Response preview:", response.json()["choices"][0]["message"]["content"])
    else:
        print(f"⚠️ Dry-run failed with status {response.status_code}")
        print(response.text)
except Exception as e:
    print("❌ Error during dry-run:", str(e))