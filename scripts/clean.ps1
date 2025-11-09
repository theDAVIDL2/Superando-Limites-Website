# Clean Build Artifacts Script
# Simple version without special characters

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Cleaning Build Artifacts..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$cleaned = @()

# Clean Frontend
if (Test-Path "frontend") {
    Write-Host "Cleaning Frontend..." -ForegroundColor Yellow
    
    $dirs = @("frontend\build", "frontend\node_modules\.cache", "frontend\.cache")
    
    foreach ($dir in $dirs) {
        if (Test-Path $dir) {
            try {
                Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
                $cleaned += "  OK: Removed $dir"
            } catch {
                Write-Host "  Warning: Could not remove $dir" -ForegroundColor Yellow
            }
        }
    }
    Write-Host ""
}

# Clean Backend
if (Test-Path "backend") {
    Write-Host "Cleaning Backend..." -ForegroundColor Yellow
    
    $dirs = @("backend\__pycache__", "backend\.pytest_cache")
    
    foreach ($dir in $dirs) {
        if (Test-Path $dir) {
            try {
                Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
                $cleaned += "  OK: Removed $dir"
            } catch {
                Write-Host "  Warning: Could not remove $dir" -ForegroundColor Yellow
            }
        }
    }
    Write-Host ""
}

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Summary:" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if ($cleaned.Count -gt 0) {
    Write-Host "  Cleaned items:" -ForegroundColor Green
    foreach ($item in $cleaned) {
        Write-Host $item -ForegroundColor Green
    }
} else {
    Write-Host "  OK: Already clean! Nothing to remove." -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
