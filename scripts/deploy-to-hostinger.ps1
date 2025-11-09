# Deploy to Hostinger Script
# Uploads frontend build to public_html via SCP
# Preserves specified folders (like l2/)

# Load configuration
$configPath = ".hostinger-config.json"

if (-not (Test-Path $configPath)) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host " Configuration Not Found!" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Creating configuration from example..." -ForegroundColor Yellow
    
    if (Test-Path ".hostinger-config.json.example") {
        Copy-Item ".hostinger-config.json.example" ".hostinger-config.json"
        Write-Host "Configuration file created: .hostinger-config.json" -ForegroundColor Green
        Write-Host ""
        Write-Host "Please edit .hostinger-config.json with your Hostinger details:" -ForegroundColor Cyan
        Write-Host "  - host (e.g., ssh.hostinger.com)" -ForegroundColor White
        Write-Host "  - user (your FTP/SSH username)" -ForegroundColor White
        Write-Host "  - remote_path (e.g., /home/u123456789/public_html)" -ForegroundColor White
        Write-Host ""
        Write-Host "Press Enter to open configuration file..." -ForegroundColor Yellow
        Read-Host
        notepad ".hostinger-config.json"
        Write-Host ""
        Write-Host "Please restart deployment after configuring." -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "ERROR: .hostinger-config.json.example not found!" -ForegroundColor Red
        exit 1
    }
}

# Load config
$config = Get-Content $configPath -Raw | ConvertFrom-Json

$sshHost = $config.hostinger.host
$sshPort = $config.hostinger.port
$sshUser = $config.hostinger.user
$remotePath = $config.hostinger.remote_path
$excludeFolders = $config.hostinger.exclude_folders
$buildPath = $config.frontend.build_path

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Hostinger Deployment" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project: $($config.project_name)" -ForegroundColor White
Write-Host "Host: $sshHost" -ForegroundColor White
Write-Host "User: $sshUser" -ForegroundColor White
Write-Host "Path: $remotePath" -ForegroundColor White
Write-Host ""

# Validate configuration
if ($sshHost -eq "your-server.hostinger.com" -or $sshUser -eq "u123456789") {
    Write-Host "ERROR: Configuration not completed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please edit .hostinger-config.json with your actual Hostinger credentials." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Enter to open configuration..." -ForegroundColor Cyan
    Read-Host
    notepad ".hostinger-config.json"
    exit 1
}

# Check for SCP
Write-Host "Checking for SCP client..." -ForegroundColor Yellow
try {
    $null = scp 2>&1
    Write-Host "OK: SCP client available" -ForegroundColor Green
} catch {
    Write-Host "ERROR: SCP not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install OpenSSH Client:" -ForegroundColor Yellow
    Write-Host "  Windows: Settings -> Apps -> Optional Features -> OpenSSH Client" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Check build path
if (-not (Test-Path $buildPath)) {
    Write-Host "ERROR: Build not found at $buildPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please build the frontend first:" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "OK: Build found at $buildPath" -ForegroundColor Green
Write-Host ""

# Create temporary deployment folder
$tempDeploy = "temp_deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Write-Host "Preparing deployment package..." -ForegroundColor Yellow

try {
    # Create temp directory
    New-Item -ItemType Directory -Path $tempDeploy -Force | Out-Null
    
    # Copy build contents
    Copy-Item -Path "$buildPath\*" -Destination $tempDeploy -Recurse -Force
    
    Write-Host "OK: Package prepared" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "ERROR: Failed to prepare package - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Display what will be preserved
if ($excludeFolders -and $excludeFolders.Count -gt 0) {
    Write-Host "Folders that will be preserved on server:" -ForegroundColor Cyan
    foreach ($folder in $excludeFolders) {
        Write-Host "  - $remotePath/$folder" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# Deploy
Write-Host "Uploading to Hostinger..." -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

try {
    # Upload files via SCP
    $scpCommand = "scp -P $sshPort -r `"$tempDeploy\*`" `"$sshUser@$sshHost`:$remotePath/`""
    
    Write-Host "Executing: $scpCommand" -ForegroundColor DarkGray
    Write-Host ""
    
    Invoke-Expression $scpCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host " Deployment Successful!" -ForegroundColor Yellow
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Files uploaded to: $remotePath" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Preserved folders:" -ForegroundColor Cyan
        foreach ($folder in $excludeFolders) {
            Write-Host "  - $folder/" -ForegroundColor DarkGray
        }
        Write-Host ""
        Write-Host "Website: https://silviosuperandolimites.com.br" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERROR: Upload failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Troubleshooting:" -ForegroundColor Yellow
        Write-Host "  1. Verify SSH credentials in .hostinger-config.json" -ForegroundColor White
        Write-Host "  2. Check if SSH access is enabled in Hostinger panel" -ForegroundColor White
        Write-Host "  3. Verify remote_path exists on server" -ForegroundColor White
        Write-Host "  4. Check firewall/network connection" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
} finally {
    # Cleanup temp folder
    if (Test-Path $tempDeploy) {
        Remove-Item -Path $tempDeploy -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Cleaned up temporary files" -ForegroundColor DarkGray
        Write-Host ""
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

