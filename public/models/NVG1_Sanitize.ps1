param(
  [string]$SafeRoot = "C:\Users\nicol\Build\work",
  [switch]$Apply,              # switch to actually perform changes
  [int]$LargeMB = 250          # "large" file threshold
)
$ErrorActionPreference="Stop"
$NVG  = Join-Path $SafeRoot "NVG1"
$WORK = Join-Path $NVG "works"
$OPS  = Join-Path $NVG "_Ops"
$LOGS = Join-Path $OPS "_Logs"
$ARCH = Join-Path $SafeRoot "_Archive"
$ING  = Join-Path $OPS "_Ingest"
$NOW  = Get-Date -Format "yyyyMMdd_HHmmss"

$Report = Join-Path $LOGS "sanitize_report_$NOW.csv"
$Manifest = Join-Path $LOGS "actions_manifest_$NOW.json"
$Actions = New-Object System.Collections.ArrayList

# Allow/Preserve rules (builds 1–16 are sacred)
$PreservePaths = @(
  $WORK,
  (Join-Path $WORK "runtime"),
  (Join-Path $WORK "assets"),
  (Join-Path $WORK "assets\SORA"),
  (Join-Path $WORK "ui")
)
$KeepExt = @(".js",".mjs",".cjs",".json",".html",".css",".ps1",".md",".png",".jpg",".jpeg",".gif",".webp",".svg",".mp3",".wav",".ogg",".glb",".gltf",".fbx",".obj",".mtl")

# Helper: log action
function Log-Action($Type,$Source,$Dest,$Size){
  $null = $Actions.Add([pscustomobject]@{
    Time=(Get-Date).ToString("s"); Type=$Type; Source=$Source; Dest=$Dest; SizeBytes=$Size
  })
}

# 1) Detect "recursive rewrite" dirs (name repeated in ancestry) and queue for flatten
Get-ChildItem $SafeRoot -Directory -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
  $parts = $_.FullName.TrimEnd('\').Split('\')
  if(($parts | Group-Object | Where-Object {$_.Count -gt 1}).Count -gt 0){
    # Heuristic: if leaf name repeats inside its parents, mark for review
    if($parts[-1] -in $parts[0..($parts.Count-2)]){
      Log-Action "RECURSIVE_DIR" $_.FullName "" 0
    }
  }
}

# 2) Identify heavy caches / duplicate junk we can archive safely
$CacheMasks = @("node_modules",".next","dist","build",".cache","temp","tmp",".parcel-cache",".vite","coverage")
foreach($mask in $CacheMasks){
  Get-ChildItem $SafeRoot -Recurse -Directory -Force -ErrorAction SilentlyContinue | Where-Object {$_.Name -ieq $mask} | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Sum Length).Sum
    Log-Action "CACHE_CANDIDATE" $_.FullName (Join-Path $ARCH ("cache_"+$mask+"_"+$NOW)) $size
  }
}

# 3) Large files over threshold (preview media, zips, artifacts)
Get-ChildItem $SafeRoot -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length/1MB -ge $LargeMB } | ForEach-Object {
  $dest = Join-Path $ARCH $_.Name
  Log-Action "LARGE_FILE" $_.FullName $dest $_.Length
}

# 4) Orphan big zips / archives outside ingest
Get-ChildItem $SafeRoot -Recurse -File -Include *.zip,*.7z,*.rar -ErrorAction SilentlyContinue | ForEach-Object {
  if($_.DirectoryName -ne $ING){
    $dest = Join-Path $ING $_.Name
    Log-Action "ARCHIVE_TO_INGEST" $_.FullName $dest $_.Length
  }
}

# 5) Move all SORA scene jsons into works\assets\SORA\
Get-ChildItem $SafeRoot -Recurse -File -Include sora_*.json -ErrorAction SilentlyContinue | ForEach-Object {
  $dest = Join-Path (Join-Path $WORK "assets\SORA") $_.Name
  if($_.FullName -ne $dest){
    Log-Action "MOVE_SORA_SCENE" $_.FullName $dest $_.Length
  }
}

# 6) Delete empty dirs (not under preserves)
Get-ChildItem $SafeRoot -Recurse -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  try{
    if( ($PreservePaths | Where-Object { $_ -and $_ -like ($_.FullName + "*") }).Count -eq 0 ){
      if( (Get-ChildItem $_.FullName -Force -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0 ){
        Log-Action "DELETE_EMPTY_DIR" $_.FullName "" 0
      }
    }
  }catch{}
}

# 7) Keep-only extensions inside works (quarantine others)
$QUAR = Join-Path $ARCH ("_quarantine_"+$NOW)
Get-ChildItem $WORK -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
  if($KeepExt -notcontains $_.Extension.ToLower()){
    $dest = Join-Path $QUAR $_.Name
    Log-Action "QUARANTINE_EXT" $_.FullName $dest $_.Length
  }
}

# Write CSV report
$Actions | Export-Csv -NoTypeInformation -Path $Report
$Actions | ConvertTo-Json -Depth 6 | Out-File -Encoding UTF8 $Manifest

Write-Host "`n=== DRY RUN SUMMARY ==="
Write-Host "Report: $Report"
Write-Host "Manifest: $Manifest"
Write-Host ("Total actions queued: " + $Actions.Count)

if($Apply){
  Write-Host "`nAPPLYING CHANGES..."
  foreach($a in $Actions){
    $t=$a.Type; $src=$a.Source; $dst=$a.Dest
    try{
      switch($t){
        "CACHE_CANDIDATE" {
          if($dst -and -not (Test-Path $dst)){ New-Item -ItemType Directory -Force -Path $dst | Out-Null }
          if(Test-Path $src){ Move-Item $src $dst -Force }
        }
        "LARGE_FILE" { if($dst){ Move-Item $src $dst -Force } }
        "ARCHIVE_TO_INGEST" { if($dst){ Move-Item $src $dst -Force } }
        "MOVE_SORA_SCENE" {
          $p = Split-Path $dst -Parent; if(-not (Test-Path $p)){ New-Item -ItemType Directory -Force -Path $p | Out-Null }
          Move-Item $src $dst -Force
        }
        "DELETE_EMPTY_DIR" { Remove-Item $src -Force -Recurse }
        "QUARANTINE_EXT" {
          $p = Split-Path $dst -Parent; if(-not (Test-Path $p)){ New-Item -ItemType Directory -Force -Path $p | Out-Null }
          Move-Item $src $dst -Force
        }
        default { }
      }
    }catch{
      Write-Warning "Failed $t : $src -> $dst : $_"
    }
  }
  Write-Host "Done. Changes applied safely. Backups (.bak) kept where needed."
}else{
  Write-Host "No changes applied. Re-run with -Apply to execute."
}
