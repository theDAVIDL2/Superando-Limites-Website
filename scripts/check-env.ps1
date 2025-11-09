# Check Environment Variables Script
# Simple version without special characters

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Environment Variables Check" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

function Show-EnvFile {
    param($path, $name)
    
    Write-Host "$name (.env):" -ForegroundColor Cyan
    
    if (Test-Path $path) {
        Write-Host "  OK: $path exists" -ForegroundColor Green
        Write-Host ""
        
        $content = Get-Content $path
        foreach ($line in $content) {
            if ($line -match "^#" -or $line -match "^\s*$") {
                Write-Host "  $line" -ForegroundColor DarkGray
            } elseif ($line -match "=") {
                $parts = $line -split "=", 2
                $key = $parts[0]
                $value = if ($parts.Length -gt 1) { $parts[1] } else { "" }
                
                if ($key -match "(KEY|SECRET|PASSWORD|TOKEN|URL)") {
                    if ($value -and $value.Trim()) {
                        Write-Host "  $key=[SET]" -ForegroundColor Green
                    } else {
                        Write-Host "  $key=[NOT SET]" -ForegroundColor Yellow
                    }
                } else {
                    Write-Host "  $line" -ForegroundColor White
                }
            } else {
                Write-Host "  $line" -ForegroundColor White
            }
        }
    } else {
        Write-Host "  ERROR: $path not found!" -ForegroundColor Red
        Write-Host "  TIP: Create it from .env.example" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Check Frontend
Show-EnvFile "frontend\.env" "Frontend"

# Check Backend
Show-EnvFile "backend\.env" "Backend"

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Recommendations:" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$warnings = @()

if (!(Test-Path "frontend\.env")) {
    $warnings += "  WARNING: Create frontend/.env file"
}

if (!(Test-Path "backend\.env")) {
    $warnings += "  WARNING: Create backend/.env file"
}

if ($warnings.Count -eq 0) {
    Write-Host "  OK: All environment files present!" -ForegroundColor Green
} else {
    foreach ($warning in $warnings) {
        Write-Host $warning -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
