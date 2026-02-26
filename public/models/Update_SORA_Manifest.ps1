# Auto-updates SORA.json when any sora_*.json changes
$dir = "C:\Users\nicol\Documents\noodle-vision-nexus\public\models"

function Update-Manifest {
    $scenes = Get-ChildItem "$dir\sora_*.json" -ErrorAction SilentlyContinue | ForEach-Object { $_.Name }
    if ($scenes.Count -gt 0) {
        @{ scenes = $scenes } | ConvertTo-Json | Set-Content "$dir\SORA.json" -Encoding UTF8
        Write-Host "SORA manifest updated at $(Get-Date -Format T)"
    } else {
        Write-Host "No scene files found — manifest unchanged"
    }
}

# Watcher to auto-refresh when files change
$watcher = New-Object System.IO.FileSystemWatcher $dir, 'sora_*.json'
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

Register-ObjectEvent $watcher Changed -Action { Update-Manifest }
Register-ObjectEvent $watcher Created -Action { Update-Manifest }
Register-ObjectEvent $watcher Deleted -Action { Update-Manifest }
Register-ObjectEvent $watcher Renamed -Action { Update-Manifest }

Write-Host "Watching $dir for SORA scene changes..."
Write-Host "Leave this PowerShell window open to keep auto-update running."
# Run once on startup
Update-Manifest
