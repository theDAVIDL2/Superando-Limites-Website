# Clean Build Artifacts Script
# Removes build artifacts and caches

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🧹 Cleaning Build Artifacts..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$cleaned = @()
$errors = @()

# Clean Frontend
if (Test-Path "frontend") {
    Write-Host "🎨 Cleaning Frontend..." -ForegroundColor Yellow
    
    $frontendDirs = @(
        "frontend\build",
        "frontend\node_modules\.cache",
        "frontend\.cache"
    )
    
    foreach ($dir in $frontendDirs) {
        if (Test-Path $dir) {
            try {
                Remove-Item $dir -Recurse -Force
                $cleaned += "  ✅ Removed: $dir"
            } catch {
                $errors += "  ❌ Error removing $dir : $_"
            }
        }
    }
    
    Write-Host ""
}

# Clean Backend
if (Test-Path "backend") {
    Write-Host "⚡ Cleaning Backend..." -ForegroundColor Yellow
    
    $backendDirs = @(
        "backend\__pycache__",
        "backend\.pytest_cache",
        "backend\.coverage"
    )
    
    foreach ($dir in $backendDirs) {
        if (Test-Path $dir) {
            try {
                Remove-Item $dir -Recurse -Force
                $cleaned += "  ✅ Removed: $dir"
            } catch {
                $errors += "  ❌ Error removing $dir : $_"
            }
        }
    }
    
    Write-Host ""
}

# Clean Root
Write-Host "📁 Cleaning Root..." -ForegroundColor Yellow

$rootFiles = @(
    ".pytest_cache",
    "__pycache__",
    "*.pyc",
    "*.pyo",
    "*.log"
)

foreach ($pattern in $rootFiles) {
    $items = Get-ChildItem -Path . -Filter $pattern -Recurse -Force -ErrorAction SilentlyContinue
    foreach ($item in $items) {
        try {
            Remove-Item $item.FullName -Recurse -Force
            $cleaned += "  ✅ Removed: $($item.Name)"
        } catch {
            $errors += "  ❌ Error removing $($item.Name): $_"
        }
    }
}

Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 📊 Cleaning Summary:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($cleaned.Count -gt 0) {
    Write-Host "  Cleaned items:" -ForegroundColor Green
    foreach ($item in $cleaned) {
        Write-Host $item -ForegroundColor Green
    }
    Write-Host ""
}

if ($errors.Count -gt 0) {
    Write-Host "  Errors:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host $error -ForegroundColor Red
    }
    Write-Host ""
}

if ($cleaned.Count -eq 0 -and $errors.Count -eq 0) {
    Write-Host "  ✅ Already clean! Nothing to remove." -ForegroundColor Green
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

