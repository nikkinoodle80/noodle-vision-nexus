Write-Host '--- Cleaning GitHub Repo ---' -ForegroundColor Yellow
if (!(Test-Path '.gitignore')) { '/node_modules
.env
dist/' | Out-File -FilePath '.gitignore' }
git rm -r --cached node_modules --quiet
git add .
git commit -m 'Nexus Secured: Infrastructure Optimized'
git push origin main
Write-Host '🛡️ NEXUS OPTIMIZED AND PUSHED TO GITHUB' -ForegroundColor Green
