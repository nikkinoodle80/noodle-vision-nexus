#!/bin/bash

# === MCP Fallback Injector ===
# Nicole’s legacy-safe, emotionally annotated environment sync

# 🧠 Default fallback values (used if not injected by Render or shell)
export PORT=${PORT:-31337}
export MCP_HOST=${MCP_HOST:-127.0.0.1}
export MCP_MODE=${MCP_MODE:-live}
export OVERLAY_FLAG=${OVERLAY_FLAG:-enabled}
export HUD_VERSION=${HUD_VERSION:-v1.6b}
export MODEL_PATH=${MODEL_PATH:-./src/data/model.json}

# 🔐 Echo injected values for HUD validation
echo "🔐 MCP ENVIRONMENT INJECTION:"
echo "PORT=$PORT"
echo "MCP_HOST=$MCP_HOST"
echo "MCP_MODE=$MCP_MODE"
echo "OVERLAY_FLAG=$OVERLAY_FLAG"
echo "HUD_VERSION=$HUD_VERSION"
echo "MODEL_PATH=$MODEL_PATH"

# 🧬 Optional: Inject into model.json if needed
if [ -f "$MODEL_PATH" ]; then
  echo "🧠 model.json found at $MODEL_PATH"
else
  echo "⚠️ model.json not found at $MODEL_PATH"
fi

# 🚀 Start the cockpit
echo "🚀 Launching cockpit on port $PORT..."
node server.js
#!/bin/bash

echo "🔍 Checking for misplaced index.html..."

if [ -f "src/index.html" ]; then
  mv src/index.html ./index.html
  echo "✅ Moved index.html to root."
else
  echo "⚠️ No index.html found in src/. Skipping move."
fi

echo "🔍 Scanning server.js for Vite import..."

if grep -q "import vite" server.js; then
  sed -i '/import vite/d' server.js
  echo "✅ Removed 'import vite' from server.js."
else
  echo "✅ No Vite import found in server.js."
fi

echo "🚀 Fix complete. You can now run: npm start"
