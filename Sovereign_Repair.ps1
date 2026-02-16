Write-Host "🏗️ AUTO-BUILDING REPAIR ENGINE..." -ForegroundColor Cyan

# 1. Force-align the remote to your personal repo (The nikkinoodle80 path)
git remote remove origin 2>$null
git remote add origin https://github.com/nikkinoodle80/noodle-vision-nexus.git
Write-Host "🔗 LINKED: Now targeting nikkinoodle80/noodle-vision-nexus" -ForegroundColor Green

# 2. Fix the MCP Config (Converting C: drive to Cloud Path)
$ConfigPath = "config/mcp_servers.json"
if (Test-Path $ConfigPath) {
    $content = Get-Content $ConfigPath -Raw | ConvertFrom-Json
    $content.mcpServers."noodle-vision-bridge".env.GOOGLE_APPLICATION_CREDENTIALS = "./config/noodle-vision-key.json"
    $content | ConvertTo-Json -Depth 10 | Set-Content $ConfigPath
    Write-Host "✅ CONFIG: Local paths converted to Cloud paths." -ForegroundColor Yellow
}

# 3. Stage the 'Soul' and the code
git add Agent_DNA.yaml
git add config/mcp_servers.json
git add .

# 4. Final Heavy Push
Write-Host "📤 EXECUTING SOVEREIGN PUSH..." -ForegroundColor Magenta
git commit -m "💎 AUTO-FIX: Injecting Agent DNA and Correcting Repo Alignment"
git push -u origin main --force

Write-Host "`n✨ HEAVY LIFTING COMPLETE. Refresh your browser now." -ForegroundColor Gold
