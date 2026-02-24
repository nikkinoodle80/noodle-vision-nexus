# ============================
# Run-Automation.ps1 (Auto-detect version)
# ============================
# Finds the newest build JSON file in the work folder,
# checks automation flags, and performs Git actions.

$buildDir = "C:\Users\nicol\Build\work"
$logDir = "C:\Users\nicol\Build\logs"

# Find latest JSON file
$latestJson = Get-ChildItem -Path $buildDir -Filter *.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $latestJson) {
    Write-Host "❌ No .json build files found in $buildDir."
    exit 1
}

$BuildFilePath = $latestJson.FullName
Write-Host "🧩 Using latest build file: $BuildFilePath"

# Read JSON
$build = Get-Content $BuildFilePath -Raw | ConvertFrom-Json

$buildName       = $build.properties.'Build Name'.title[0].text.content
$pushToGit       = $build.properties.PushToGit.checkbox
$promoteToMain   = $build.properties.PromoteToMain.checkbox
$shockIndex      = $build.properties.wowShockIndex.number
$timestamp       = Get-Date -Format 'yyyyMMdd_HHmmss'
$logFile         = "$logDir\$($buildName)_$timestamp.log"

# Make sure log folder exists
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

Add-Content $logFile "=== Automation run for $buildName ==="
Add-Content $logFile "Started at $(Get-Date)"
Add-Content $logFile "wowShockIndex: $shockIndex"
Add-Content $logFile ""

# Git logic
if ($pushToGit) {
    Write-Host "✅ PushToGit is enabled — committing and pushing..."
    Add-Content $logFile "PushToGit: TRUE — committing and pushing."

    git add .
    git commit -m "Automated commit for build: $buildName"
    git push origin HEAD

    if ($promoteToMain) {
        Write-Host "🚀 PromoteToMain is enabled — merging into main..."
        Add-Content $logFile "PromoteToMain: TRUE — merging to main."

        git checkout main
        git merge HEAD@{1}
        git push origin main
    } else {
        Write-Host "➡️ PromoteToMain disabled — skipping main merge."
        Add-Content $logFile "PromoteToMain: FALSE — skipping main merge."
    }
} else {
    Write-Host "⏸ PushToGit is disabled — no Git actions taken."
    Add-Content $logFile "PushToGit: FALSE — no Git actions performed."
}

Add-Content $logFile "Completed at $(Get-Date)"
Write-Host "✅ Automation complete. Log saved at $logFile"
