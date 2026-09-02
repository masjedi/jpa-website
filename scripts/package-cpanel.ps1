# Package a cPanel upload zip (Windows PowerShell)
#
# Run from the project root:
#   npm run package:cpanel
#   or: powershell -ExecutionPolicy Bypass -File ./scripts/package-cpanel.ps1

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $root

Write-Host 'Building frontend assets...'
npm run build

if (-not (Test-Path 'public/build/manifest.json')) {
    throw 'public/build/manifest.json missing. Vite build failed.'
}

if (Test-Path 'public/hot') {
    Remove-Item 'public/hot' -Force
    Write-Host 'Removed public/hot'
}

$distDir = Join-Path $root 'dist'
New-Item -ItemType Directory -Force -Path $distDir | Out-Null
$zipPath = Join-Path $distDir 'jpa-website-cpanel.zip'

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$staging = Join-Path $distDir 'staging'
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $staging | Out-Null

$include = @(
    'app',
    'bootstrap',
    'config',
    'database',
    'public',
    'routes',
    'storage',
    'vendor',
    'artisan',
    'composer.json',
    'composer.lock',
    '.env.production.example'
)

foreach ($item in $include) {
    $source = Join-Path $root $item
    if (-not (Test-Path $source)) {
        throw "Missing required path: $item"
    }
    $destination = Join-Path $staging $item
    Write-Host "Copying $item..."
    Copy-Item $source $destination -Recurse -Force
}

# Blade views are required at runtime; compiled JS/CSS live in public/build.
Write-Host 'Copying resources/views...'
New-Item -ItemType Directory -Force -Path (Join-Path $staging 'resources') | Out-Null
Copy-Item (Join-Path $root 'resources\views') (Join-Path $staging 'resources\views') -Recurse -Force

Write-Host 'Refreshing production vendor in staging (no-dev)...'
Push-Location $staging
try {
    composer install --no-dev --optimize-autoloader --no-interaction
} finally {
    Pop-Location
}

$removePaths = @(
    'public\hot',
    'public\storage',
    'storage\logs\laravel.log',
    'storage\pail',
    'storage\inertia-devtools',
    'database\factories',
    'bootstrap\cache\packages.php',
    'bootstrap\cache\services.php',
    'bootstrap\cache\config.php',
    'bootstrap\cache\routes-v7.php',
    'bootstrap\cache\events.php'
)

foreach ($relative in $removePaths) {
    $target = Join-Path $staging $relative
    if (Test-Path $target) {
        Remove-Item $target -Recurse -Force
    }
}

Get-ChildItem (Join-Path $staging 'storage\logs') -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -ne '.gitignore' } |
    Remove-Item -Force

Write-Host "Creating $zipPath ..."
$tar = Get-Command tar -ErrorAction SilentlyContinue
if ($null -ne $tar) {
    & tar -a -cf $zipPath -C $staging .
} else {
    Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zipPath -Force
}

Remove-Item $staging -Recurse -Force

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-Host ''
Write-Host "Done: $zipPath ($sizeMb MB)"
Write-Host 'Next: follow docs/DEPLOY-CPANEL.md'
