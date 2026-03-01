Write-Host "🛠️ ManifestBuilder: Converting CSV to JSON Truth..." -ForegroundColor Cyan
$csvPath = "Noodle-VISION_MasterPlan_and_Tasks.csv"
if (Test-Path $csvPath) {
    Import-Csv $csvPath | ConvertTo-Json | Out-File "NEXUS_MANIFEST.json" -Encoding utf8
    Write-Host "✅ NEXUS_MANIFEST.json has been updated!" -ForegroundColor Green
} else {
    Write-Host "⏳ Waiting for CSV injection from Termux..." -ForegroundColor Yellow
}
