param([string]$ScanPath = ".\")
Write-Host "🔍 Annotator Active: Scanning for B14 Safety..." -ForegroundColor Cyan
$assets = Get-ChildItem -Path $ScanPath -Recurse -Include *.spline, *.glb, *.fbx, *.csv
$report = @()
foreach ($file in $assets) {
    $status = "CLEAN"
    if (Select-String -Path $file.FullName -Pattern "strobe", "flash", "seizure") {
        $status = "NEEDS_EPILEPTIC_REVIEW"
        Write-Host "⚠️ B14 ALERT: Photosensitive trigger in $($file.Name)" -ForegroundColor Yellow
    }
    $report += [PSCustomObject]@{ FileName = $file.Name; Path = $file.FullName; Safety = $status }
}
$report | ConvertTo-Json | Out-File "annotated_results.json"
Write-Host "✅ ANNOTATION ENGINE READY" -ForegroundColor Green
