# Upload hero-section fix to cPanel via SFTP.
# Password is prompted securely — never pass it on the command line.
#
# Usage (from project root):
#   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-hero-fix.ps1
#
# Optional:
#   -Host journey-to-afghanistan.com
#   -User journeytoafghani

param(
    [string]$Host = 'journey-to-afghanistan.com',
    [string]$User = 'journeytoafghani',
    [int]$Port = 22,
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$buildSource = Join-Path $root 'public\build'
if (-not (Test-Path (Join-Path $buildSource 'manifest.json'))) {
    Write-Error "Missing public/build/manifest.json. Run: npm run build"
}

$backendFiles = @(
    'app\Support\HeroSectionPresenter.php',
    'app\Support\Media\MediaProcessor.php',
    'app\Http\Controllers\Admin\HeroSectionController.php',
)

foreach ($relative in $backendFiles) {
    if (-not (Test-Path (Join-Path $root $relative))) {
        Write-Error "Missing $relative"
    }
}

if (-not (Get-Module -ListAvailable -Name Posh-SSH)) {
    Write-Host 'Installing Posh-SSH (one-time)...'
    Install-Module Posh-SSH -Scope CurrentUser -Force -AllowClobber
}

Import-Module Posh-SSH

$securePassword = Read-Host "SFTP password for $User@$Host" -AsSecureString
$credential = New-Object System.Management.Automation.PSCredential ($User, $securePassword)

Write-Host "Connecting to $Host ..."
$session = New-SFTPSession -ComputerName $Host -Credential $credential -Port $Port -AcceptKey

if (-not $session) {
    Write-Error 'SFTP connection failed. Check host, username, password, and that SSH/SFTP is enabled in cPanel.'
}

try {
    Write-Host 'Uploading backend PHP files to jpa-website/ ...'
    foreach ($relative in $backendFiles) {
        $local = Join-Path $root $relative
        $remote = "/home/$User/jpa-website/" + ($relative -replace '\\', '/')
        $remoteDir = Split-Path $remote -Parent
        Set-SFTPPath -SessionId $session.SessionId -Path $remoteDir
        Set-SFTPFile -SessionId $session.SessionId -LocalFile $local -RemotePath $remote -Overwrite
        Write-Host "  OK $relative"
    }

    Write-Host 'Uploading public/build to public_html/build/ ...'
    $remoteBuild = "/home/$User/public_html/build"
    Set-SFTPPath -SessionId $session.SessionId -Path $remoteBuild

    Get-ChildItem -Path $buildSource -Recurse -File | ForEach-Object {
        $relative = $_.FullName.Substring($buildSource.Length + 1) -replace '\\', '/'
        $remoteFile = "$remoteBuild/$relative"
        $remoteDir = Split-Path $remoteFile -Parent
        Set-SFTPPath -SessionId $session.SessionId -Path $remoteDir
        Set-SFTPFile -SessionId $session.SessionId -LocalFile $_.FullName -RemotePath $remoteFile -Overwrite
    }

    Write-Host 'Uploading public/build to jpa-website/public/build/ ...'
    $remoteAppBuild = "/home/$User/jpa-website/public/build"
    Set-SFTPPath -SessionId $session.SessionId -Path $remoteAppBuild

    Get-ChildItem -Path $buildSource -Recurse -File | ForEach-Object {
        $relative = $_.FullName.Substring($buildSource.Length + 1) -replace '\\', '/'
        $remoteFile = "$remoteAppBuild/$relative"
        $remoteDir = Split-Path $remoteFile -Parent
        Set-SFTPPath -SessionId $session.SessionId -Path $remoteDir
        Set-SFTPFile -SessionId $session.SessionId -LocalFile $_.FullName -RemotePath $remoteFile -Overwrite
    }

    Write-Host ''
    Write-Host 'Deploy complete.'
    Write-Host '1. Open https://journey-to-afghanistan.com/check-paths.php (upload public/check-paths.php first if needed)'
    Write-Host '2. Hard refresh admin Hero section: Ctrl+Shift+R'
    Write-Host '3. Change your cPanel password if it was ever shared in chat.'
}
finally {
    if ($session) {
        Remove-SFTPSession -SessionId $session.SessionId | Out-Null
    }
}
