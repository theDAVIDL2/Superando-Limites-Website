# ================================================================
# Frontend Deployment Script - SSH/FTP Deployment
# ================================================================
# 
# This script automates the deployment of your React frontend to
# any hosting provider that supports SSH/FTP (Hostinger, cPanel, etc.)
#
# Usage:
#   .\deploy-frontend.ps1
#   .\deploy-frontend.ps1 -SkipBuild
#
# ================================================================

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

# Colors for output
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"
$ColorInfo = "Cyan"
$ColorHeader = "Magenta"

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$FrontendDir = Join-Path $ProjectRoot "frontend"
$BuildDir = Join-Path $FrontendDir "build"
$ConfigFile = Join-Path $ScriptDir "deploy-config.json"

# ================================================================
# FUNCTIONS
# ================================================================

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor $ColorHeader
    Write-Host "  $Text" -ForegroundColor $ColorHeader
    Write-Host "=============================================" -ForegroundColor $ColorHeader
    Write-Host ""
}

function Write-Step {
    param([string]$Text)
    Write-Host "[STEP] $Text" -ForegroundColor $ColorInfo
}

function Write-Success {
    param([string]$Text)
    Write-Host "[SUCCESS] $Text" -ForegroundColor $ColorSuccess
}

function Write-Warning {
    param([string]$Text)
    Write-Host "[WARNING] $Text" -ForegroundColor $ColorWarning
}

function Write-Error {
    param([string]$Text)
    Write-Host "[ERROR] $Text" -ForegroundColor $ColorError
}

function Get-DeployConfig {
    if (-not (Test-Path $ConfigFile)) {
        Write-Error "Configuration file not found: $ConfigFile"
        Write-Warning "Creating default configuration..."
        
        $defaultConfig = @{
            ssh_host = "your-server.com"
            ssh_port = "22"
            ssh_user = "your-username"
            ssh_password = "YOUR_PASSWORD_HERE"
            remote_path = "/public_html"
            use_ssh = $true
            backup_before_deploy = $true
        }
        
        $defaultConfig | ConvertTo-Json -Depth 10 | Set-Content $ConfigFile
        
        Write-Info ""
        Write-Info "Configuration file created at:"
        Write-Info "  $ConfigFile"
        Write-Warning ""
        Write-Warning "IMPORTANT: Please edit the file and add your credentials!"
        Write-Warning ""
        
        return $null
    }
    
    try {
        $config = Get-Content $ConfigFile | ConvertFrom-Json
        
        if ($config.ssh_password -eq "YOUR_PASSWORD_HERE") {
            Write-Error "Please configure your credentials in:"
            Write-Info "  $ConfigFile"
            return $null
        }
        
        return $config
    } catch {
        Write-Error "Failed to load configuration: $_"
        return $null
    }
}

function Test-Requirements {
    Write-Step "Checking requirements..."
    
    # Check for Node.js
    $hasNode = Get-Command node -ErrorAction SilentlyContinue
    if (-not $hasNode) {
        Write-Error "Node.js is not installed!"
        Write-Info "Download from: https://nodejs.org/"
        return $false
    }
    
    # Check for npm
    $hasNpm = Get-Command npm -ErrorAction SilentlyContinue
    if (-not $hasNpm) {
        Write-Error "npm is not installed!"
        return $false
    }
    
    # Check for PuTTY tools (pscp, plink) if using SSH
    $hasPscp = Get-Command pscp -ErrorAction SilentlyContinue
    $hasPlink = Get-Command plink -ErrorAction SilentlyContinue
    
    if (-not $hasPscp -or -not $hasPlink) {
        Write-Warning "PuTTY tools (pscp, plink) not found in PATH"
        Write-Info "Install from: https://www.putty.org/"
        Write-Info "Or deployment will use alternative methods"
    }
    
    Write-Success "Basic requirements met"
    return $true
}

function Build-Frontend {
    Write-Step "Building frontend for production..."
    
    if (-not (Test-Path $FrontendDir)) {
        Write-Error "Frontend directory not found: $FrontendDir"
        return $false
    }
    
    Push-Location $FrontendDir
    
    try {
        Write-Info "  Installing dependencies..."
        $installOutput = npm install 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install dependencies"
            Write-Info $installOutput
            Pop-Location
            return $false
        }
        
        Write-Info "  Building production bundle..."
        $buildOutput = npm run build 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Build failed!"
            Write-Info $buildOutput
            Pop-Location
            return $false
        }
        
        if (-not (Test-Path $BuildDir)) {
            Write-Error "Build directory not created: $BuildDir"
            Pop-Location
            return $false
        }
        
        $buildSize = (Get-ChildItem $BuildDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        $fileCount = (Get-ChildItem $BuildDir -Recurse -File).Count
        
        Write-Success "Build completed successfully"
        Write-Info "  Build size: $([math]::Round($buildSize, 2)) MB"
        Write-Info "  Files: $fileCount"
        
        Pop-Location
        return $true
    } catch {
        Write-Error "Build error: $_"
        Pop-Location
        return $false
    }
}

function Backup-RemoteDirectory {
    param($config)
    
    if (-not $config.backup_before_deploy) {
        Write-Info "Backup disabled in configuration"
        return $true
    }
    
    Write-Step "Creating backup of remote directory..."
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "$($config.remote_path)_backup_$timestamp"
    
    try {
        $backupCmd = "cp -r $($config.remote_path) $backupPath"
        
        $plinkArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "$($config.ssh_user)@$($config.ssh_host)",
            $backupCmd
        )
        
        # Cache SSH key
        echo y | plink -P $config.ssh_port -pw $config.ssh_password "$($config.ssh_user)@$($config.ssh_host)" "exit" 2>&1 | Out-Null
        
        & plink @plinkArgs 2>&1 | Out-Null
        
        Write-Success "Backup created: $backupPath"
        return $true
    } catch {
        Write-Warning "Could not create backup: $_"
        return $true  # Continue anyway
    }
}

function Clear-RemoteDirectory {
    param($config)
    
    Write-Step "Cleaning remote directory..."
    
    $cleanCmd = "cd $($config.remote_path) && rm -rf * && echo 'Cleaned'"
    
    try {
        $plinkArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "$($config.ssh_user)@$($config.ssh_host)",
            $cleanCmd
        )
        
        $output = & plink @plinkArgs 2>&1
        
        Write-Success "Remote directory cleaned"
        return $true
    } catch {
        Write-Warning "Could not clean directory: $_"
        return $true
    }
}

function Upload-Files {
    param($config)
    
    Write-Step "Uploading files to server..."
    
    if (-not (Test-Path $BuildDir)) {
        Write-Error "Build directory not found: $BuildDir"
        return $false
    }
    
    if ($DryRun) {
        Write-Warning "DRY RUN: Would upload files from $BuildDir"
        return $true
    }
    
    try {
        Write-Info "  Using PSCP for file transfer..."
        
        $pscpArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "-r",
            "$BuildDir\*",
            "$($config.ssh_user)@$($config.ssh_host):$($config.remote_path)/"
        )
        
        $uploadOutput = & pscp @pscpArgs 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Files uploaded successfully"
            return $true
        } else {
            Write-Error "Upload failed!"
            Write-Info $uploadOutput
            return $false
        }
    } catch {
        Write-Error "Upload error: $_"
        return $false
    }
}

function Verify-Deployment {
    param($config)
    
    Write-Step "Verifying deployment..."
    
    try {
        $verifyCmd = "cd $($config.remote_path) && ls -la | head -20"
        
        $plinkArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "$($config.ssh_user)@$($config.ssh_host)",
            $verifyCmd
        )
        
        $result = & plink @plinkArgs 2>&1
        
        Write-Info ""
        Write-Info "Remote directory contents:"
        Write-Host $result -ForegroundColor Gray
        Write-Info ""
        
        Write-Success "Verification complete"
        return $true
    } catch {
        Write-Warning "Could not verify deployment: $_"
        return $true
    }
}

# ================================================================
# MAIN DEPLOYMENT PROCESS
# ================================================================

function Start-Deployment {
    Write-Header "FRONTEND DEPLOYMENT STARTING"
    
    # Check requirements
    if (-not (Test-Requirements)) {
        Write-Error ""
        Write-Error "Requirements not met. Aborting."
        return
    }
    
    # Load configuration
    $config = Get-DeployConfig
    if (-not $config) {
        Write-Error ""
        Write-Error "Configuration error. Aborting."
        return
    }
    
    # Display configuration
    Write-Host ""
    Write-Host "Configuration:" -ForegroundColor $ColorInfo
    Write-Host "  Server: $($config.ssh_host):$($config.ssh_port)" -ForegroundColor Gray
    Write-Host "  User: $($config.ssh_user)" -ForegroundColor Gray
    Write-Host "  Remote Path: $($config.remote_path)" -ForegroundColor Gray
    Write-Host "  Backup: $($config.backup_before_deploy)" -ForegroundColor Gray
    Write-Host ""
    
    # Confirmation
    if (-not $DryRun) {
        $confirm = Read-Host "Continue with deployment? (yes/no)"
        if ($confirm -ne "yes") {
            Write-Warning ""
            Write-Warning "Deployment cancelled by user"
            return
        }
    } else {
        Write-Warning "DRY RUN MODE - No actual changes will be made"
    }
    
    Write-Header "DEPLOYMENT PROCESS"
    
    # Step 1: Build
    if (-not $SkipBuild) {
        if (-not (Build-Frontend)) {
            Write-Error ""
            Write-Error "Build failed. Aborting deployment."
            return
        }
    } else {
        Write-Info "Skipping build (using existing build)"
        if (-not (Test-Path $BuildDir)) {
            Write-Error "Build directory not found: $BuildDir"
            Write-Error "Cannot skip build when no build exists"
            return
        }
    }
    
    Write-Host ""
    
    # Step 2: Backup
    Backup-RemoteDirectory $config | Out-Null
    Write-Host ""
    
    # Step 3: Clean
    Clear-RemoteDirectory $config | Out-Null
    Write-Host ""
    
    # Step 4: Upload
    if (-not (Upload-Files $config)) {
        Write-Error ""
        Write-Error "Upload failed. Deployment incomplete."
        return
    }
    
    Write-Host ""
    
    # Step 5: Verify
    Verify-Deployment $config | Out-Null
    
    # Success
    Write-Header "DEPLOYMENT COMPLETE"
    
    Write-Success "✅ Frontend deployed successfully!"
    Write-Host ""
    Write-Info "Your site should now be live at:"
    Write-Host "  https://your-domain.com" -ForegroundColor $ColorInfo
    Write-Host ""
    Write-Info "Next steps:"
    Write-Info "  1. Visit your site and verify it's working"
    Write-Info "  2. Check browser console for errors"
    Write-Info "  3. Test all major features"
    Write-Host ""
}

# ================================================================
# SCRIPT EXECUTION
# ================================================================

try {
    Start-Deployment
} catch {
    Write-Error ""
    Write-Error "Unexpected error: $_"
    Write-Error $_.ScriptStackTrace
} finally {
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor $ColorHeader
    Write-Host ""
}

# Pause to read output
if (-not $DryRun) {
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

