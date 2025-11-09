@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Root directory of this script
set "ROOT=%~dp0"

REM Launch backend in a new PowerShell 7 window
start "Backend" pwsh -NoLogo -NoExit -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%ROOT%backend'; if (-not (Test-Path .venv)) { python -m venv .venv }; .\.venv\Scripts\Activate.ps1; if (-not (Test-Path '.venv\_deps_installed.flag')) { Write-Host 'Installing backend dependencies...' -ForegroundColor Yellow; python -m pip install --upgrade pip >$null 2>&1; pip install -r requirements.txt; New-Item -ItemType File -Path '.venv\_deps_installed.flag' -Force >$null 2>&1; }; Write-Host 'Starting backend at http://localhost:8000/api' -ForegroundColor Green; uvicorn server:app --host 0.0.0.0 --port 8000 --reload"

REM Launch frontend in another PowerShell 7 window
start "Frontend" pwsh -NoLogo -NoExit -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%ROOT%frontend'; if (Test-Path yarn.lock) { Write-Host 'Installing frontend deps via yarn...' -ForegroundColor Yellow; yarn install --frozen-lockfile; } else { Write-Host 'yarn.lock not found; running yarn install' -ForegroundColor Yellow; yarn install; }; Write-Host 'Starting frontend (yarn start)...' -ForegroundColor Green; yarn start"

endlocal
exit /b 0


