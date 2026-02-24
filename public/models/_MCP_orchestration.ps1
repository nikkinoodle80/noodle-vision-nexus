# ===========================
# MCP Orchestration — Global Auto-Discovery + Self-Healing + .env Loader + Pause
# ===========================

# === CONFIG: Paths ===
$REPO_DIR        = "C:\Organized_Workspace\ActiveBuilds"
$MANIFEST_SUBDIR = "mcp\manifests"
$LOG_SUBDIR      = "mcp\logs"

# === Load .env file if present ===
$envFile = "C:\_MCP_env\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*#') { return }
        if ($_ -match '^\s*$') { return }
        $parts = $_ -split '=', 2
        if ($parts.Count -eq 2) {
            $name  = $parts[0].Trim()
            $value = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# === Tokens from env vars ===
$NOTION_TOKEN    = $env:NOTION_TOKEN
$NB2_DB_SUMMARY  = $env:NB2_DB_SUMMARY
$ZAPIER_HOOK     = $env:ZAPIER_HOOK

# === Flags ===
$DRY_RUN         = $false
$PUSH_TO_GIT     = $true
$UPDATE_NOTION   = $true
$TRIGGER_ZAPIER  = $true

function Write-Color($Text, $Color="White") { Write-Host $Text -ForegroundColor $Color }
function Ensure-Dir($Path) { if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null } }

# === Enumerate ready local drives ===
$drives = [System.IO.DriveInfo]::GetDrives() |
  Where-Object { $_.DriveType -in @([System.IO.DriveType]::Fixed, [System.IO.DriveType]::Removable) -and $_.IsReady } |
  ForEach-Object { $_.RootDirectory.FullName.TrimEnd('\') }
if (-not $drives) { Write-Color "ERROR: No ready local drives found." Red; exit 1 }

# === Auto-discover MCP tool scripts ===
$targets = @{
  RECOVERY_AGENT   = "recovery_agent.py"
  ANNOTATOR        = "Annotator.ps1"
  MANIFEST_BUILDER = "ManifestBuilder.ps1"
  MCP_REORG        = "MCPReorg.ps1"
}
foreach ($key in $targets.Keys) {
  $found = $null
  foreach ($drive in $drives) {
    $found = Get-ChildItem -Path "$drive\" -Filter $targets[$key] -Recurse -ErrorAction SilentlyContinue |
             Select-Object -First 1 -ExpandProperty FullName
    if ($found) { break }
  }
  if ($found) {
    Set-Variable -Name $key -Value $found -Scope Script
    Write-Color "Found $($targets[$key]) at $found" Green
  } else {
    Write-Color "ERROR: Could not find $($targets[$key])" Red
    exit 1
  }
}

# === Self-healing config files ===
$overlayMapPath = "C:\_MCP_overlay_map.json"
$mcpSchemaPath  = "C:\_MCP_schema.json"
if (-not (Test-Path $overlayMapPath)) { '{"emotion":"signalEmpathy","legacyFlag":true,"namingConvention":"dyslexiaSafe"}' | Out-File $overlayMapPath -Encoding UTF8 }
if (-not (Test-Path $mcpSchemaPath))  { '{"root":"C:\\","ports":["video","audio","docs"],"cableRacks":["rackA","rackB"],"presets":["room1","room2"]}' | Out-File $mcpSchemaPath -Encoding UTF8 }

# === Working folders ===
$OUT_DIR      = "C:\_MCP_recovery_out"
$ANNOTATED    = "C:\_MCP_annotated_results.json"
$MANIFEST_DIR = "C:\_MCP_manifests"
Ensure-Dir $OUT_DIR
Ensure-Dir $MANIFEST_DIR

# === Start timer ===
$startTime = Get-Date
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# === Backup ===
$backupRoot = "C:\_MCP_backup_$timestamp"
Ensure-Dir $backupRoot
foreach ($drive in $drives) {
  $letter = ($drive -replace "[:\\]", "")
  $dst = Join-Path $backupRoot $letter
  Ensure-Dir $dst
  robocopy "$drive\" "$dst" /MIR /R:1 /W:1 /MT:16 /NFL /NDL /NP /NJH /NJS `
    /XD "$drive\Windows" "$drive\Program Files" "$drive\Program Files (x86)" `
        "$drive\ProgramData" "$drive\Users\*\AppData" `
        "$drive\_MCP_*" | Out-Null
}

# === Recovery Agent scan ===
$scanOutDirs = @()
foreach ($drive in $drives) {
  $letter = ($drive -replace "[:\\]", "")
  $driveOut = Join-Path $OUT_DIR "scan_$letter"
  Ensure-Dir $driveOut
  $scanOutDirs += $driveOut
  python $RECOVERY_AGENT scan `
    --input "$drive\" `
    --output $driveOut `
    --flatten false `
    --exclude "Windows" "Program Files" "Program Files (x86)" "ProgramData" "Users/*/AppData" "_MCP_*"
}

# === Merge Recon_master.csv ===
$reconPaths = @()
foreach ($d in $scanOutDirs) {
  $candidate = Join-Path $d "Recon_master.csv"
  if (Test-Path $candidate) { $reconPaths += $candidate }
}
$masterRecon = Join-Path $OUT_DIR "Recon_master.csv"
$first = $true
if (Test-Path $masterRecon) { Remove-Item $masterRecon -Force }
foreach ($rp in $reconPaths) {
  $lines = Get-Content $rp
  if ($lines.Count -gt 0) {
    if ($first) { Set-Content -Path $masterRecon -Value $lines; $first = $false }
    else { Add-Content -Path $masterRecon -Value $lines[1..($lines.Count-1)] }
  }
}

# === Annotation ===
& $ANNOTATOR -Input $masterRecon -OverlayMap $overlayMapPath -Output $ANNOTATED

# === Manifest build ===
& $MANIFEST_BUILDER -Input $ANNOTATED -SchemaMap $mcpSchemaPath -Output $MANIFEST_DIR

# === Reorg ===
& $MCP_REORG -Manifest "$MANIFEST_DIR\mcp_manifest.json" -DryRun:$DRY_RUN

# === Integrity check ===
$missingFiles = @()
if (Test-Path "$MANIFEST_DIR\mcp_manifest.json") {
  $manifestData = Get-Content "$MANIFEST_DIR\mcp_manifest.json" | ConvertFrom-Json
  foreach ($item in $manifestData) {
    if ($item.new_path -and -not (Test-Path $item.new_path)) { $missingFiles += $item.new_path }
  }
}
$integrityPassed = ($missingFiles.Count -eq 0)

# === Summary ===
$scannedCount   = (Import-Csv $masterRecon).Count
$annotatedCount = (Get-Content $ANNOTATED | Measure-Object -Line).Lines
$movedCount     = (Get-Content "$MANIFEST_DIR\mcp_manifest.json" | Select-String -Pattern '"new_path"').Count
$elapsed        = (Get-Date) - $startTime
Write-Color "Files scanned: $scannedCount" Green
Write-Color "Files annotated: $annotatedCount" Green
Write-Color "Files moved/reorg: $movedCount" Green
Write-Color "Backup location: $backupRoot" Yellow
Write-Color "Elapsed time: $elapsed" Yellow
Write-Color ("Integrity check: " + ($(if($integrityPassed){"PASSED"}else{"FAILED"}))) ($(if($integrityPassed){"Green"}else{"Red"}))

# === Integrity log ===
$integrityLog = @{
    RunTimestamp   = $timestamp
    FilesScanned   = $scannedCount
    FilesAnnotated = $annotatedCount
    FilesMoved     = $movedCount
    BackupLocation = $backupRoot
    ElapsedTime    = $elapsed.ToString()
    IntegrityPassed= $integrityPassed
    MissingFiles   = $missingFiles
}
$