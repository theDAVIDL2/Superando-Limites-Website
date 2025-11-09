# Check System Requirements Script
# Simple version without special characters

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " System Requirements Check" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: Node.js $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Node.js not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ERROR: Node.js not installed!" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: npm v$npmVersion" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: npm not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ERROR: npm not installed!" -ForegroundColor Red
    $allGood = $false
}

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Python not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ERROR: Python not installed!" -ForegroundColor Red
    $allGood = $false
}

# Check pip
Write-Host "Checking pip..." -ForegroundColor Yellow
try {
    $pipVersion = python -m pip --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $pipVersion" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: pip not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ERROR: pip not installed!" -ForegroundColor Red
    $allGood = $false
}

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Git not found!" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host "  ERROR: Git not installed!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Summary:" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if ($allGood) {
    Write-Host "  OK: All required tools are installed!" -ForegroundColor Green
    Write-Host "  You're ready to develop!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Some required tools are missing!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Installation links:" -ForegroundColor Yellow
    Write-Host "    - Node.js: https://nodejs.org/" -ForegroundColor White
    Write-Host "    - Python: https://python.org/" -ForegroundColor White
    Write-Host "    - Git: https://git-scm.com/" -ForegroundColor White
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
