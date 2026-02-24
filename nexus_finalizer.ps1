Write-Host '--- Installing Supabase Wiring ---' -ForegroundColor Cyan
npm install @supabase/supabase-js
if (!(Test-Path 'src\logic')) { New-Item -ItemType Directory -Path 'src\logic' -Force }
'export const hardwareDNA = { display: \"Sony Bravia XR\", auth: \"Smart Ring v1\", voltage: 120 };' | Out-File -FilePath 'src\logic\HardwareMapper.js'
Write-Host '✅ Local Wiring Complete!' -ForegroundColor Green
node nexus_init.js
