# --- Persistent Sora Watcher + Flask + Notion Sync + Folder Lock ---

$workDir = "C:\Users\nicol\Build\work"
$sd = "$workDir\data\sora"
$recoveryDir = "$workDir\data\recovery"
$logFile = "$workDir\data\posted_log.txt"
$syncDir = "$workDir\NotionSync"
$url = "http://127.0.0.1:5000/scene"

# --- Ensure paths exist ---
$dirs = @($recoveryDir, $syncDir)
foreach ($d in $dirs) { if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d | Out-Null } }

# --- Lock work folder ---
attrib +R $workDir /S /D
Write-Host "[LOCKED] $workDir is read-only."

# --- Unlock on exit ---
Register-EngineEvent PowerShell.Exiting -Action { attrib -R $workDir /S /D; Write-Host "[UNLOCKED] Folder unlocked." } | Out-Null

# --- Define watcher ---
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $sd
$watcher.Filter = "*.json"
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite'
$watcher.EnableRaisingEvents = $true

# --- Define action ---
$action = {
    $file = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    try {
        $content = Get-Content -Raw -Path $file -Encoding UTF8
        ConvertFrom-Json $content | Out-Null
        Invoke-RestMethod -Uri $using:url -Method POST -Body $content -ContentType "application/json"
        Write-Host "[AUTO POST] $name"
        Add-Content -Path $using:logFile -Value $name
        # --- Sync to Notion folder ---
        Copy-Item -Path $file -Destination (Join-Path $using:syncDir $name) -Force
        Write-Host "[SYNCED] $name copied to NotionSync."
        Remove-Item -Path $file -Force
    } catch {
        Copy-Item -Path $file -Destination (Join-Path $using:recoveryDir $name) -Force
        Write-Host "[RECOVERY] $name moved to recovery folder."
    }
}

# --- Register events ---
Register-ObjectEvent $watcher Created -Action $action | Out-Null
Register-ObjectEvent $watcher Changed -Action $action | Out-Null
Write-Host "[INFO] Watcher running. Drop JSONs in $sd. Logs -> $logFile. Sync -> $syncDir."

# --- Launch Flask ---
$flaskCmd = "python -m flask run --host=127.0.0.1 --port=5000"
Start-Process powershell -ArgumentList "-NoExit", "-Command cd `"$workDir`"; $flaskCmd" -WindowStyle Normal

# --- Keep alive ---
while ($true) { Start-Sleep -Seconds 1 }
