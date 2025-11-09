# Build and Test All Script
# Builds frontend and tests backend

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🔨 Building and Testing Everything..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$frontendSuccess = $false
$backendSuccess = $false

# Build Frontend
if (Test-Path "frontend\package.json") {
    Write-Host "🎨 Building Frontend..." -ForegroundColor Yellow
    Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Push-Location frontend
    
    try {
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
            $frontendSuccess = $true
        } else {
            Write-Host ""
            Write-Host "❌ Frontend build failed!" -ForegroundColor Red
        }
    } catch {
        Write-Host ""
        Write-Host "❌ Error building frontend: $_" -ForegroundColor Red
    }
    
    Pop-Location
    Write-Host ""
} else {
    Write-Host "⚠️  Frontend not found, skipping..." -ForegroundColor Yellow
    Write-Host ""
}

# Test Backend
if (Test-Path "backend\server.py") {
    Write-Host "🧪 Testing Backend..." -ForegroundColor Yellow
    Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Push-Location backend
    
    try {
        # Check if pytest is available
        if (Test-Path ".venv\Scripts\pytest.exe") {
            .\.venv\Scripts\pytest.exe
        } else {
            pytest
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ All backend tests passed!" -ForegroundColor Green
            $backendSuccess = $true
        } else {
            Write-Host ""
            Write-Host "⚠️  Some backend tests failed." -ForegroundColor Yellow
        }
    } catch {
        Write-Host ""
        Write-Host "❌ Error testing backend: $_" -ForegroundColor Red
    }
    
    Pop-Location
    Write-Host ""
} else {
    Write-Host "⚠️  Backend not found, skipping..." -ForegroundColor Yellow
    Write-Host ""
}

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 📊 Build and Test Summary:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "frontend\package.json") {
    if ($frontendSuccess) {
        Write-Host "  ✅ Frontend: Built successfully" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Frontend: Build failed" -ForegroundColor Red
    }
}

if (Test-Path "backend\server.py") {
    if ($backendSuccess) {
        Write-Host "  ✅ Backend: All tests passed" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Backend: Some tests failed" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

