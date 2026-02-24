# Set-OpenAIKey.ps1
# This script checks for an existing OpenAI API key, prompts for one if missing,
# and saves it permanently to the user environment.
Write-Host "🔍 Checking for existing OPENAI_API_KEY..."
$currentKey = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY", "User")
if (![string]::IsNullOrEmpty($currentKey)) {
    Write-Host "✅ An existing OPENAI_API_KEY is already set for this user."
    Write-Host "Current value starts with: $($currentKey.Substring(0,6))..."
} else {
    Write-Host "⚠️  No OPENAI_API_KEY found. Let's set it up."
    $key = Read-Host "Please enter your OpenAI API key (starts with sk-)"
    if ($key -match "^sk-[A-Za-z0-9]{10,}$") {
        setx OPENAI_API_KEY "$key" | Out-Null
        Write-Host "✅ API key saved permanently to your user environment."
        Write-Host "Restart PowerShell or VS Code to apply it to new sessions."
    } else {
        Write-Host "❌ That doesn’t look like a valid key. Try again and check for typos."
    }
}
# Optional: display verification
$newKey = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY", "User")
if (![string]::IsNullOrEmpty($newKey)) {
    Write-Host "`nVerification:"
    Write-Host "OPENAI_API_KEY is now set to: $($newKey.Substring(0,6))...(hidden)"
} else {
    Write-Host "❌ Key not found after setting attempt."
}
