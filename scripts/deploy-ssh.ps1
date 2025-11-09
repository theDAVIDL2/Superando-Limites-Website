# Deploy via SSH/SCP Script
# Uses .deploy-config.json for configuration

# Load configuration
$configPath = ".deploy-config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    
    if ($config.ssh.enabled) {
        $sshUser = $config.ssh.user
        $sshHost = $config.ssh.host
        $remotePath = $config.ssh.path
        $sshKeyPath = $config.ssh.key_path
        $frontendBuildPath = "$($config.frontend.directory)/build/"
    } else {
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Yellow
        Write-Host " SSH Deployment Not Configured" -ForegroundColor Red
        Write-Host "============================================================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To enable SSH deployment:" -ForegroundColor White
        Write-Host "  1. Edit .deploy-config.json" -ForegroundColor Cyan
        Write-Host "  2. Set ssh.enabled to true" -ForegroundColor Cyan
        Write-Host "  3. Configure ssh.user, ssh.host, and ssh.path" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press Enter to continue..."
        Read-Host
        exit 0
    }
} else {
    Write-Host ""
    Write-Host "ERROR: .deploy-config.json not found!" -ForegroundColor Red
    Write-Host "Please run deploy-manager.bat to create configuration." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Enter to continue..."
    Read-Host
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " SSH Deployment" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Validate configuration
if ($sshUser -eq "your_ssh_user" -or $sshHost -eq "your_server_ip" -or $remotePath -eq "/var/www/html") {
    Write-Host "ERROR: SSH configuration incomplete!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please edit .deploy-config.json and set:" -ForegroundColor Yellow
    Write-Host "  - ssh.user (your SSH username)" -ForegroundColor White
    Write-Host "  - ssh.host (your server IP or domain)" -ForegroundColor White
    Write-Host "  - ssh.path (remote directory path)" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter to continue..."
    Read-Host
    exit 1
}

# Check for SCP
Write-Host "Checking for SCP client..." -ForegroundColor Yellow
try {
    $null = scp -V 2>&1
    Write-Host "OK: SCP client found" -ForegroundColor Green
} catch {
    Write-Host "ERROR: SCP client not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install OpenSSH Client:" -ForegroundColor Yellow
    Write-Host "  Windows: Settings -> Apps -> Optional Features -> OpenSSH Client" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter to continue..."
    Read-Host
    exit 1
}

Write-Host ""

# Check/Build Frontend
Write-Host "Checking frontend build..." -ForegroundColor Yellow
if (-not (Test-Path $frontendBuildPath)) {
    Write-Host "Frontend not built. Building now..." -ForegroundColor DarkYellow
    try {
        Push-Location $config.frontend.directory
        npm run build
        Pop-Location
        Write-Host "OK: Frontend built" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Build failed - $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Press Enter to continue..."
        Read-Host
        exit 1
    }
} else {
    Write-Host "OK: Frontend build found" -ForegroundColor Green
}

Write-Host ""

# Perform deployment
Write-Host "Uploading to $sshUser@$sshHost:$remotePath ..." -ForegroundColor Yellow
Write-Host ""

try {
    # Build SCP command
    $scpCmd = "scp -r `"$frontendBuildPath*`" `"${sshUser}@${sshHost}:${remotePath}`""
    
    # Add key if specified
    if ($sshKeyPath -and (Test-Path $sshKeyPath)) {
        $scpCmd = "scp -i `"$sshKeyPath`" -r `"$frontendBuildPath*`" `"${sshUser}@${sshHost}:${remotePath}`""
    }
    
    Write-Host "Executing: $scpCmd" -ForegroundColor DarkGray
    Write-Host ""
    
    Invoke-Expression $scpCmd
    
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host " Deployment Complete!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Files uploaded to: $remotePath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You may need to restart your web server." -ForegroundColor DarkYellow
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "ERROR: Deployment failed - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check:" -ForegroundColor Yellow
    Write-Host "  - SSH credentials are correct" -ForegroundColor White
    Write-Host "  - Server is reachable" -ForegroundColor White
    Write-Host "  - You have write permissions to $remotePath" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press Enter to continue..."
Read-Host
