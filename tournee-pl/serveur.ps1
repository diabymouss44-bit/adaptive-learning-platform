# Serveur local de secours (Windows sans Python) : http://localhost:8765
$port = 8765
$root = [IO.Path]::GetFullPath($PSScriptRoot)
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.webmanifest'='application/manifest+json'; '.json'='application/json'; '.png'='image/png'; '.svg'='image/svg+xml' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$port/")
try { $l.Start() } catch { Write-Host "Le port $port est deja utilise : l'application est sans doute deja lancee."; Start-Process "http://localhost:$port/"; exit }
Write-Host "Tournee PL tourne sur http://localhost:$port/  -  garde cette fenetre ouverte."
Start-Process "http://localhost:$port/"
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
  if ($p -eq '') { $p = 'index.html' }
  $f = [IO.Path]::GetFullPath((Join-Path $root $p))
  if ($f.StartsWith($root) -and (Test-Path -LiteralPath $f -PathType Leaf)) {
    $b = [IO.File]::ReadAllBytes($f)
    $ext = [IO.Path]::GetExtension($f).ToLower()
    $c.Response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' })
    $c.Response.AddHeader('Cache-Control', 'no-cache')
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
