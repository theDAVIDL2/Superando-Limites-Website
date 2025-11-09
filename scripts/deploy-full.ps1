# Full Deployment Script
# Builds frontend, then commits and pushes to Git

# Load configuration
$configPath = ".deploy-config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    $branch = $config.repository.branch
    $repoUrl = $config.repository.url
    $frontendDir = $config.frontend.directory
} else {
    Write-Host "WARNING: .deploy-config.json not found. Using defaults." -ForegroundColor Yellow
    $branch = "main"
    $repoUrl = ""
    $frontendDir = "frontend"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Full Deployment (Build + Push)" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Frontend
Write-Host "Step 1: Building Frontend..." -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
try {
    Push-Location $frontendDir
    npm run build
    Pop-Location
    Write-Host "OK: Frontend built successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Frontend build failed - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Press Enter to continue..."
    Read-Host
    exit 1
}

Write-Host ""

# Step 2: Git Commit and Push
Write-Host "Step 2: Deploying via Git Push..." -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray

try {
    $status = git status --porcelain
    if ($status) {
        Write-Host "Changes detected. Committing and pushing..." -ForegroundColor Cyan
        
        git add .
        
        Write-Host ""
        Write-Host "Enter commit message (or press Enter for default):" -ForegroundColor Yellow
        $commitMessage = Read-Host "Message"
        
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "deploy: full deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            Write-Host "Using default: $commitMessage" -ForegroundColor DarkYellow
        }
        
        git commit -m "$commitMessage"
        git push origin $branch
        
        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Cyan
        Write-Host " Deployment Started!" -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Cyan
        Write-Host ""
        
        if ($repoUrl -and $repoUrl -ne "https://github.com/username/repo-name") {
            Write-Host "Monitor CI/CD: $repoUrl/actions" -ForegroundColor Cyan
        } else {
            Write-Host "Check your repository's Actions tab for deployment status" -ForegroundColor Cyan
        }
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "INFO: No changes detected. Nothing to commit." -ForegroundColor DarkYellow
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Git operation failed - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "Press Enter to continue..."
Read-Host
