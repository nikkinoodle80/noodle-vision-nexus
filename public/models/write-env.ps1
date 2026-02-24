# Auto-create and write .env file for Noodle-VISION
if ($env:OS -eq "Windows_NT") {
    $envFile = "C:\Users\nicol\Build\work\NVG1\.env"
    $gitignore = "C:\Users\nicol\Build\work\NVG1\.gitignore"
} else {
    $envFile = "/workspace/NVG1/.env"
    $gitignore = "/workspace/NVG1/.gitignore"
}
$folder = Split-Path $envFile
if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Force -Path $folder | Out-Null }

# Write .env content
@"
NODE_ENV=production
PORT=5000
APP_NAME=Noodle-VISION
MCP_REGISTRY_PATH=/workspace/NVG1/registry.json
HUD_OVERLAY_MODE=active
LOG_LEVEL=debug

SUPABASE_URL=https://lektchshcgubtxouwdmq.supabase.co
SUPABASE_ANON_KEY=<your anon key>
SUPABASE_SERVICE_ROLE_KEY=<your service role key>

RENDER_API_KEY=<your Render API key>

OPENAI_API_KEY=<your OpenAI API key>

REPLIT_DB_URL=https://kv.replit.com/v0/<your-db-url>
SESSION_SECRET=<your session secret>
GOOGLE_API_KEY=<your Google API key>

MCP_AUTH_TOKEN=<your MCP token>
NOODLE_MCP_TOKEN=<your Noodle MCP token>
"@ | Set-Content -Path $envFile -Encoding UTF8

# Ensure .env is in .gitignore
if (-not (Test-Path $gitignore)) {
    ".env" | Set-Content -Path $gitignore -Encoding UTF8
} elseif (-not (Select-String -Path $gitignore -Pattern '^\s*\.env\s*$')) {
    Add-Content -Path $gitignore -Value "`n.env"
}

Write-Host "✅ .env written to $envFile and protected in .gitignore" -ForegroundColor Green
