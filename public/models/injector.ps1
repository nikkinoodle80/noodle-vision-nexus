param (
    [string]$LocalDir = "C:\Users\nicol\Build\work\data",
    [string]$Endpoint = "http://localhost:5000",
    [int]$Limit = 2000
)

$files = Get-ChildItem -Path "$LocalDir\*" -Include *.json, *.csv, *.ndjson -File
if ($files.Count -eq 0) { Write-Host "[WARN] No result files found in $LocalDir"; return }

$sent = 0
foreach ($file in $files) {
    $fullPath = $file.FullName
    try {
        $content = Get-Content -Raw -Path $fullPath -Encoding UTF8
        $records = if ($file.Extension -eq ".csv") { Import-Csv -Path $fullPath } else { ConvertFrom-Json $content }

        foreach ($rec in $records) {
            $json = $rec | ConvertTo-Json -Depth 5
            if ($rec.PSObject.Properties["scene"]) { $endpointType="scene"; $label=$rec.scene }
            elseif ($rec.PSObject.Properties["type"]) { $endpointType="trigger"; $label=$rec.type }
            else { $endpointType="trigger"; $label="generic" }

            $url = "$Endpoint/$endpointType"
            $response = Invoke-RestMethod -Uri $url -Method POST -Body $json -ContentType "application/json"
            $log = "[POST] $url ? $label ? Response: $response"
            Add-Content -Path "$LocalDir\injector_output.log" -Value $log
            Write-Host $log
            $sent++
        }
    } catch { Write-Host "[ERROR] Failed to process $fullPath ? $_" }
    if ($sent -ge $Limit) { Write-Host "[INFO] Hit limit ($Limit). Stopping."; break }
}
Write-Host "[DONE] Sent $sent records. Output saved to $LocalDir\injector_output.log"
