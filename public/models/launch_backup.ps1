# --- Persistent Sora Watcher + Flask Launcher + Recovery + Folder Lock ---

# Paths
$workDir = "C:\Users\nicol\Build\work"
$sd = "$workDir\data\sora"
$recoveryDir = "$workDir\data\recovery"
$logFile = "$workDir\data\posted_log.txt"

# --- Create recovery folder if missing ---
if (-not (Test-Path $recoveryDir)) { New-Item -ItemType Directory -Path $recoveryDir | Out-Null }

# --- Lock work folder ---
attrib +R $workDir /S /D
Write-Host "[LOCKED] $workDir and subfolders are read-only."

# --- Unlock on exit ---
Register-EngineEvent PowerShell.Exiting -Action {
    attrib -R $workDir /S /D
    Write-Host "[UNLOCKED] $workDir and subfolders unlocked."
} | Out-Null

# --- Define watcher ---
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $sd
$watcher.Filter = "*.json"
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite'
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# --- Copy variables for the action block ---
$logFileCopy = $logFile
$recoveryDirCopy = $recoveryDir

# --- Define action ---
$action = {
    $file = $Event.SourceEventArgs.FullPath
    $content = Get-Content -Raw -Path $file -Encoding UTF8

    try {
        ConvertFrom-Json $content | Out-Null
        Invoke-RestMethod -Uri "http://127.0.0.1:5000/scene" -Method POST -Body $content -ContentType "application/json"
        Add-Content -Path $logFileCopy -Value $($Event.SourceEventArgs.Name)
        Write-Host "[AUTO POST] $($Event.SourceEventArgs.Name)"
    } catch {
        $dest = Join-Path $recoveryDirCopy $($Event.SourceEventArgs.Name)
        Copy-Item -Path $file -Destination $dest -Force
        Write-Host "[RECOVERY] $($Event.SourceEventArgs.Name) → moved to recovery folder."
    }
}

# --- Register events ---
Register-ObjectEvent $watcher Created -Action $action
Register-ObjectEvent $watcher Changed -Action $action

Write-Host "[INFO] Watcher started. Drop JSONs in '$sd'. Logs: $logFile. Recovery: $recoveryDir."

# --- Keep script alive ---
while ($true) { Start-Sleep -Seconds 1 }

# --- Launch Flask in a new window ---
$flaskCmd = "python -m flask run --host=127.0.0.1 --port=5000"
Start-Process powershell -ArgumentList "-NoExit", "-Command cd `"$workDir`"; $flaskCmd" -WindowStyle Normal
