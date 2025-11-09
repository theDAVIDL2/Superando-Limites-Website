# Check System Requirements Script
# Validates that all required tools are installed

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🔍 Checking System Requirements..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$requirements = @()
$allGood = $true

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
    $requirements += @{ Name = "Node.js"; Status = "OK"; Version = $nodeVersion }
} catch {
    Write-Host "  ❌ Node.js: Not installed!" -ForegroundColor Red
    $requirements += @{ Name = "Node.js"; Status = "MISSING"; Version = "N/A" }
    $allGood = $false
}

# Check npm
Write-Host "📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm: v$npmVersion" -ForegroundColor Green
    $requirements += @{ Name = "npm"; Status = "OK"; Version = "v$npmVersion" }
} catch {
    Write-Host "  ❌ npm: Not installed!" -ForegroundColor Red
    $requirements += @{ Name = "npm"; Status = "MISSING"; Version = "N/A" }
    $allGood = $false
}

# Check Python
Write-Host "🐍 Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "  ✅ Python: $pythonVersion" -ForegroundColor Green
    $requirements += @{ Name = "Python"; Status = "OK"; Version = $pythonVersion }
} catch {
    Write-Host "  ❌ Python: Not installed!" -ForegroundColor Red
    $requirements += @{ Name = "Python"; Status = "MISSING"; Version = "N/A" }
    $allGood = $false
}

# Check pip
Write-Host "📦 Checking pip..." -ForegroundColor Yellow
try {
    $pipVersion = python -m pip --version
    Write-Host "  ✅ pip: $pipVersion" -ForegroundColor Green
    $requirements += @{ Name = "pip"; Status = "OK"; Version = $pipVersion }
} catch {
    Write-Host "  ❌ pip: Not installed!" -ForegroundColor Red
    $requirements += @{ Name = "pip"; Status = "MISSING"; Version = "N/A" }
    $allGood = $false
}

# Check Git
Write-Host "🔧 Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "  ✅ Git: $gitVersion" -ForegroundColor Green
    $requirements += @{ Name = "Git"; Status = "OK"; Version = $gitVersion }
} catch {
    Write-Host "  ❌ Git: Not installed!" -ForegroundColor Red
    $requirements += @{ Name = "Git"; Status = "MISSING"; Version = "N/A" }
    $allGood = $false
}

Write-Host ""

# Optional Tools
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🔧 Optional Tools:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
Write-Host "🚂 Checking Railway CLI..." -ForegroundColor Yellow
try {
    railway --version | Out-Null
    Write-Host "  ✅ Railway CLI: Installed" -ForegroundColor Green
} catch {
    Write-Host "  ℹ️  Railway CLI: Not installed (optional)" -ForegroundColor DarkGray
    Write-Host "     Install: npm i -g @railway/cli" -ForegroundColor DarkGray
}

Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 📊 Requirements Summary:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($allGood) {
    Write-Host "  ✅ All required tools are installed!" -ForegroundColor Green
    Write-Host "  🎉 You're ready to develop!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Some required tools are missing!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  📝 Installation instructions:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($req in $requirements) {
        if ($req.Status -eq "MISSING") {
            switch ($req.Name) {
                "Node.js" {
                    Write-Host "     • Node.js: https://nodejs.org/" -ForegroundColor White
                }
                "Python" {
                    Write-Host "     • Python: https://python.org/" -ForegroundColor White
                }
                "Git" {
                    Write-Host "     • Git: https://git-scm.com/" -ForegroundColor White
                }
            }
        }
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

