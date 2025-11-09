# Check Environment Variables Script
# Validates environment configuration

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🔐 Environment Variables Check" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

function Show-EnvFile {
    param($path, $name)
    
    Write-Host "📁 $name (.env):" -ForegroundColor Cyan
    
    if (Test-Path $path) {
        Write-Host "  ✅ $path exists" -ForegroundColor Green
        Write-Host ""
        
        # Read and display (hiding sensitive values)
        $content = Get-Content $path
        foreach ($line in $content) {
            if ($line -match "^#" -or $line -match "^\s*$") {
                Write-Host "  $line" -ForegroundColor DarkGray
            } elseif ($line -match "=") {
                $parts = $line -split "=", 2
                $key = $parts[0]
                $value = $parts[1]
                
                # Check if it's a sensitive key
                if ($key -match "(KEY|SECRET|PASSWORD|TOKEN|URL)") {
                    if ($value -and $value.Trim()) {
                        Write-Host "  $key=" -NoNewline -ForegroundColor White
                        Write-Host "[SET]" -ForegroundColor Green
                    } else {
                        Write-Host "  $key=" -NoNewline -ForegroundColor White
                        Write-Host "[NOT SET]" -ForegroundColor Yellow
                    }
                } else {
                    Write-Host "  $line" -ForegroundColor White
                }
            } else {
                Write-Host "  $line" -ForegroundColor White
            }
        }
    } else {
        Write-Host "  ❌ $path not found!" -ForegroundColor Red
        Write-Host "  💡 Create it from .env.example" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Check Frontend .env
Show-EnvFile "frontend\.env" "Frontend"

# Check Backend .env
Show-EnvFile "backend\.env" "Backend"

# Recommendations
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 💡 Recommendations:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$warnings = @()

if (!(Test-Path "frontend\.env")) {
    $warnings += "  ⚠️  Create frontend/.env file"
}

if (!(Test-Path "backend\.env")) {
    $warnings += "  ⚠️  Create backend/.env file"
}

if ($warnings.Count -eq 0) {
    Write-Host "  ✅ All environment files are present!" -ForegroundColor Green
} else {
    foreach ($warning in $warnings) {
        Write-Host $warning -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

