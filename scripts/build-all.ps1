# Build and Test All Script
# Simple version without special characters

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Building and Testing Everything..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Build Frontend
if (Test-Path "frontend\package.json") {
    Write-Host "Building Frontend..." -ForegroundColor Yellow
    Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
    Push-Location frontend
    npm run build
    $frontendOK = ($LASTEXITCODE -eq 0)
    Pop-Location
    Write-Host ""
} else {
    Write-Host "Warning: Frontend not found" -ForegroundColor Yellow
    Write-Host ""
    $frontendOK = $false
}

# Test Backend
if (Test-Path "backend\server.py") {
    Write-Host "Testing Backend..." -ForegroundColor Yellow
    Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
    Push-Location backend
    
    if (Test-Path ".venv\Scripts\pytest.exe") {
        .\.venv\Scripts\pytest.exe
    } else {
        pytest
    }
    
    $backendOK = ($LASTEXITCODE -eq 0)
    Pop-Location
    Write-Host ""
} else {
    Write-Host "Warning: Backend not found" -ForegroundColor Yellow
    Write-Host ""
    $backendOK = $false
}

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Summary:" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "frontend\package.json") {
    if ($frontendOK) {
        Write-Host "  OK: Frontend built successfully" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Frontend build failed" -ForegroundColor Red
    }
}

if (Test-Path "backend\server.py") {
    if ($backendOK) {
        Write-Host "  OK: Backend tests passed" -ForegroundColor Green
    } else {
        Write-Host "  Warning: Some backend tests failed" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
