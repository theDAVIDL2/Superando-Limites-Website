# Install Dependencies Script
# Simple version without special characters

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Installing All Dependencies..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Install Frontend
if (Test-Path "frontend\package.json") {
    Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "Warning: Check output above for errors" -ForegroundColor Yellow
    }
    Write-Host ""
} else {
    Write-Host "Warning: Frontend not found" -ForegroundColor Yellow
    Write-Host ""
}

# Install Backend
if (Test-Path "backend\requirements.txt") {
    Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
    Push-Location backend
    
    if (!(Test-Path ".venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv .venv
    }
    
    Write-Host "Installing Python packages..." -ForegroundColor Yellow
    .\.venv\Scripts\pip install -r requirements.txt
    
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "Warning: Check output above for errors" -ForegroundColor Yellow
    }
    Write-Host ""
} else {
    Write-Host "Warning: Backend not found" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Done!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
