# Validate critical env vars from .env
if ($env:OS -eq "Windows_NT") {
    $envFile = "C:\Users\nicol\Build\work\NVG1\.env"
} else {
    $envFile = "/workspace/NVG1/.env"
}
if (-not (Test-Path $envFile)) {
    Write-Host "❌ No .env file found at $envFile" -ForegroundColor Red
    exit 1
}
Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*#") { return }
    if ($_ -match "^\s*$") { return }
    $parts = $_ -split "=",2
    if ($parts.Length -eq 2) {
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}
function Mask($val) {
    if ([string]::IsNullOrEmpty($val)) { return "❌ MISSING" }
    return $val.Substring(0,6) + "...(" + $val.Length + " chars)"
}
Write-Host "🔐 MCP_AUTH_TOKEN:    $(Mask($env:MCP_AUTH_TOKEN))"
Write-Host "🔐 NOODLE_MCP_TOKEN: $(Mask($env:NOODLE_MCP_TOKEN))"
Write-Host "🔐 SUPABASE_URL:     $(Mask($env:SUPABASE_URL))"
Write-Host "🔐 RENDER_API_KEY:   $(Mask($env:RENDER_API_KEY))"
