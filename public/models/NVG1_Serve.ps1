param(
  [int]$Port = 8088,
  [string]$Root = "C:\Users\nicol\Build\work\NVG1\works"
)
$ErrorActionPreference="Stop"
Write-Host "Serving $Root on http://localhost:$Port"
# Use Python if available, else .NET HttpListener
try{
  python - <<'PY'
import http.server, socketserver, sys, os
port = int(sys.argv[1]) if len(sys.argv)>1 else 8088
root = sys.argv[2] if len(sys.argv)>2 else os.getcwd()
os.chdir(root)
with socketserver.TCPServer(("", port), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Serving {root} on http://localhost:{port}")
    httpd.serve_forever()
PY
  $LASTEXITCODE=0
}catch{
  # fallback
  Add-Type -AssemblyName System.Net.HttpListener
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$Port/")
  $l.Start()
  Write-Host "Fallback server started."
  while($l.IsListening){
    $ctx=$l.GetContext()
    $path=$ctx.Request.Url.AbsolutePath.TrimStart('/')
    if([string]::IsNullOrWhiteSpace($path)){ $path="index.html" }
    $file=Join-Path $Root $path
    if(Test-Path $file){
      $bytes=[System.IO.File]::ReadAllBytes($file)
      $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
      $ctx.Response.StatusCode=404
    }
    $ctx.Response.Close()
  }
}
