# Simple Deployment Dashboard
# Uses .deploy-config.json for user-specific settings

# Load configuration
$configPath = ".deploy-config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    $repoUrl = $config.repository.url
    $liveUrl = $config.deployment.live_url
    $branch = $config.repository.branch
} else {
    Write-Host "WARNING: .deploy-config.json not found!" -ForegroundColor Yellow
    Write-Host "Using default values. Please run deploy-manager.bat to configure." -ForegroundColor Yellow
    $repoUrl = "https://github.com/username/repo"
    $liveUrl = "https://your-website.com"
    $branch = "main"
}

function Show-Menu {
    Clear-Host
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "              DEPLOYMENT DASHBOARD" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  [1] Quick Deploy (Auto Message)" -ForegroundColor White
    Write-Host "  [2] Deploy with Custom Message" -ForegroundColor White
    Write-Host "  [3] Check Git Status" -ForegroundColor White
    Write-Host "  [4] View Recent Commits" -ForegroundColor White
    Write-Host "  [5] Open GitHub Repository" -ForegroundColor White
    Write-Host "  [6] Open Live Website" -ForegroundColor White
    Write-Host ""
    Write-Host "  [0] Back to Main Menu" -ForegroundColor Red
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
}

$running = $true

while ($running) {
    Show-Menu
    $choice = Read-Host "Enter choice (0-6)"
    
    if ($choice -eq "1") {
        # Quick deploy
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Cyan
        Write-Host " QUICK DEPLOY" -ForegroundColor Yellow
        Write-Host "============================================================" -ForegroundColor Cyan
        Write-Host ""
        
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $message = "deploy: update $timestamp"
        
        Write-Host "Commit message: $message" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "[1/4] Adding files..." -ForegroundColor Yellow
        git add .
        Write-Host "Done" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "[2/4] Committing..." -ForegroundColor Yellow
        git commit -m "$message"
        Write-Host ""
        
        Write-Host "[3/4] Pushing to $branch..." -ForegroundColor Yellow
        git push origin $branch
        Write-Host ""
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "============================================================" -ForegroundColor Cyan
            Write-Host " SUCCESS! Deployment started" -ForegroundColor Green
            Write-Host "============================================================" -ForegroundColor Cyan
            Write-Host ""
            if ($repoUrl -ne "https://github.com/username/repo") {
                Write-Host "Monitor at: $repoUrl/actions" -ForegroundColor Cyan
            }
            if ($liveUrl -ne "https://your-website.com") {
                Write-Host "Live site: $liveUrl" -ForegroundColor Cyan
            }
            Write-Host ""
        } else {
            Write-Host "WARNING: Check messages above" -ForegroundColor Yellow
            Write-Host ""
        }
        
        Write-Host "Press Enter to continue..."
        Read-Host
    }
    elseif ($choice -eq "2") {
        # Custom message
        Write-Host ""
        Write-Host "Enter commit message:" -ForegroundColor Yellow
        $message = Read-Host "Message"
        
        if ($message) {
            Write-Host ""
            Write-Host "[1/3] Adding..." -ForegroundColor Yellow
            git add .
            Write-Host ""
            
            Write-Host "[2/3] Committing..." -ForegroundColor Yellow
            git commit -m "$message"
            Write-Host ""
            
            Write-Host "[3/3] Pushing..." -ForegroundColor Yellow
            git push origin $branch
            Write-Host ""
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "SUCCESS!" -ForegroundColor Green
            }
        }
        
        Write-Host ""
        Write-Host "Press Enter to continue..."
        Read-Host
    }
    elseif ($choice -eq "3") {
        # Git status
        Write-Host ""
        git status
        Write-Host ""
        Write-Host "Press Enter to continue..."
        Read-Host
    }
    elseif ($choice -eq "4") {
        # Recent commits
        Write-Host ""
        git log --oneline -10
        Write-Host ""
        Write-Host "Press Enter to continue..."
        Read-Host
    }
    elseif ($choice -eq "5") {
        # GitHub Repository
        Write-Host ""
        Write-Host "Opening repository..." -ForegroundColor Yellow
        if ($repoUrl -ne "https://github.com/username/repo") {
            Start-Process $repoUrl
        } else {
            Write-Host "ERROR: Repository URL not configured in .deploy-config.json" -ForegroundColor Red
        }
        Start-Sleep -Seconds 1
    }
    elseif ($choice -eq "6") {
        # Live website
        Write-Host ""
        Write-Host "Opening website..." -ForegroundColor Yellow
        if ($liveUrl -ne "https://your-website.com") {
            Start-Process $liveUrl
        } else {
            Write-Host "ERROR: Live URL not configured in .deploy-config.json" -ForegroundColor Red
        }
        Start-Sleep -Seconds 1
    }
    elseif ($choice -eq "0") {
        $running = $false
        Write-Host ""
        Write-Host "Returning to main menu..." -ForegroundColor Yellow
        Start-Sleep -Seconds 1
    }
    else {
        Write-Host ""
        Write-Host "Invalid choice!" -ForegroundColor Red
        Start-Sleep -Seconds 2
    }
}
