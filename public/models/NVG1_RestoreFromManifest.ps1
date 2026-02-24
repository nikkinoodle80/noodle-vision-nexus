param(
  [string]$ManifestPath
)
$ErrorActionPreference="Stop"
if(-not (Test-Path $ManifestPath)){ throw "Manifest not found: $ManifestPath" }
$actions = Get-Content $ManifestPath -Raw | ConvertFrom-Json
foreach($a in $actions){
  $t=$a.Type; $src=$a.Source; $dst=$a.Dest
  try{
    switch($t){
      "CACHE_CANDIDATE" { if(Test-Path $dst){ Move-Item $dst $src -Force } }
      "LARGE_FILE" { if(Test-Path $dst){ Move-Item $dst $src -Force } }
      "ARCHIVE_TO_INGEST" { if(Test-Path $dst){ Move-Item $dst $src -Force } }
      "MOVE_SORA_SCENE" { if(Test-Path $dst){ Move-Item $dst $src -Force } }
      "DELETE_EMPTY_DIR" { if(-not (Test-Path $src)){ New-Item -ItemType Directory -Force -Path $src | Out-Null } }
      "QUARANTINE_EXT" { if(Test-Path $dst){ Move-Item $dst $src -Force } }
      default { }
    }
  }catch{
    Write-Warning "Rollback failed for $t : $dst -> $src : $_"
  }
}
Write-Host "Rollback complete."
