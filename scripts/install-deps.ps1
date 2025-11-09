# Install Dependencies Script
# Installs all project dependencies

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 📦 Installing All Dependencies..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$success = $true

# Install Frontend Dependencies
if (Test-Path "frontend\package.json") {
    Write-Host "📱 Installing Frontend Dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Frontend installation completed with warnings." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error installing frontend dependencies: $_" -ForegroundColor Red
        $success = $false
    }
    
    Pop-Location
    Write-Host ""
} else {
    Write-Host "⚠️  Frontend not found, skipping..." -ForegroundColor Yellow
    Write-Host ""
}

# Install Backend Dependencies
if (Test-Path "backend\requirements.txt") {
    Write-Host "⚡ Installing Backend Dependencies..." -ForegroundColor Yellow
    Push-Location backend
    
    try {
        # Check if virtual environment exists
        if (!(Test-Path ".venv")) {
            Write-Host "🔨 Creating virtual environment..." -ForegroundColor Yellow
            python -m venv .venv
        }
        
        # Activate and install
        Write-Host "📦 Installing Python packages..." -ForegroundColor Yellow
        .\.venv\Scripts\pip install -r requirements.txt
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Backend installation completed with warnings." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error installing backend dependencies: $_" -ForegroundColor Red
        $success = $false
    }
    
    Pop-Location
    Write-Host ""
} else {
    Write-Host "⚠️  Backend not found, skipping..." -ForegroundColor Yellow
    Write-Host ""
}

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($success) {
    Write-Host "🎉 All dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installation completed with some errors." -ForegroundColor Yellow
    Write-Host "   Please check the output above for details." -ForegroundColor Yellow
}
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

