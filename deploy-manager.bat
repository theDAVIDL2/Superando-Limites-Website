@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

REM ================================================================
REM Development & Deployment Manager v2.0
REM Website Project - Automated Deployment System
REM ================================================================

:MENU
cls
call :SHOW_MENU
set /p "choice=Enter your choice (0-15): "

if "%choice%"=="1" goto FRONTEND_DEV
if "%choice%"=="2" goto BACKEND_DEV
if "%choice%"=="3" goto BOTH_DEV
if "%choice%"=="4" goto INSTALL_ALL
if "%choice%"=="5" goto BUILD_FRONTEND
if "%choice%"=="6" goto TEST_BACKEND
if "%choice%"=="7" goto BUILD_ALL
if "%choice%"=="8" goto DEPLOY_DASHBOARD
if "%choice%"=="9" goto DEPLOY_FRONTEND
if "%choice%"=="10" goto DEPLOY_FULL
if "%choice%"=="11" goto CHECK_ENV
if "%choice%"=="12" goto VIEW_LOGS
if "%choice%"=="13" goto CLEAN
if "%choice%"=="14" goto OPTIMIZE_IMAGES
if "%choice%"=="15" goto CHECK_REQUIREMENTS
if "%choice%"=="0" goto EXIT

powershell -NoProfile -Command "Write-Host '❌ Invalid choice! Please try again.' -ForegroundColor Red"
timeout /t 2 >nul
goto MENU

REM ============================================================
REM SHOW MENU FUNCTION
REM ============================================================

:SHOW_MENU
powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Host ''; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host '         🚀 WEBSITE PROJECT - DEV MANAGER v2.0 🚀' -ForegroundColor Yellow; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host ''; Write-Host ' 💻 DEVELOPMENT' -ForegroundColor Green; Write-Host '  [1] Start Frontend Dev Server (React)' -ForegroundColor White; Write-Host '  [2] Start Backend Dev Server (FastAPI)' -ForegroundColor White; Write-Host '  [3] Start Both (Frontend + Backend)' -ForegroundColor White; Write-Host '  [4] Install All Dependencies' -ForegroundColor White; Write-Host ''; Write-Host ' 🔨 BUILD & TEST' -ForegroundColor Green; Write-Host '  [5] Build Frontend for Production' -ForegroundColor White; Write-Host '  [6] Test Backend' -ForegroundColor White; Write-Host '  [7] Build & Test Everything' -ForegroundColor White; Write-Host ''; Write-Host ' 🚀 DEPLOYMENT' -ForegroundColor Green; Write-Host '  [8] 🎯 Deployment Dashboard (Git Push)' -ForegroundColor White; Write-Host '  [9] Deploy via SSH' -ForegroundColor White; Write-Host '  [10] Full Deployment (Build + Git Push)' -ForegroundColor White; Write-Host ''; Write-Host ' 🛠️  UTILITIES' -ForegroundColor Green; Write-Host '  [11] Check Environment Variables' -ForegroundColor White; Write-Host '  [12] View Deployment Logs' -ForegroundColor White; Write-Host '  [13] Clean Build Artifacts' -ForegroundColor White; Write-Host '  [14] Run Image Optimization' -ForegroundColor White; Write-Host '  [15] Check System Requirements' -ForegroundColor White; Write-Host ''; Write-Host '  [0] Exit' -ForegroundColor Red; Write-Host ''; Write-Host '═══════════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host '';"
goto :EOF

REM ============================================================
REM DEVELOPMENT SECTION
REM ============================================================

:FRONTEND_DEV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🎨 Starting Frontend Development Server...          ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

if not exist "frontend\package.json" (
    powershell -NoProfile -Command "Write-Host '❌ Frontend directory not found!' -ForegroundColor Red"
    timeout /t 2
    goto MENU
)

cd frontend
powershell -NoProfile -Command "Write-Host '✅ Opening new terminal for Frontend...' -ForegroundColor Green"
start "Frontend Dev Server" cmd /k "npm start"
timeout /t 2 >nul
cd ..

powershell -NoProfile -Command "Write-Host ''; Write-Host '✅ Frontend server starting...' -ForegroundColor Green; Write-Host '🌐 URL: http://localhost:3000' -ForegroundColor Cyan; Write-Host '📝 Check the new terminal window for logs' -ForegroundColor Yellow; Write-Host '';"
pause
goto MENU

:BACKEND_DEV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  ⚡ Starting Backend Development Server...           ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

if not exist "backend\server.py" (
    powershell -NoProfile -Command "Write-Host '❌ Backend directory not found!' -ForegroundColor Red"
    timeout /t 2
    goto MENU
)

cd backend
powershell -NoProfile -Command "Write-Host '✅ Opening new terminal for Backend...' -ForegroundColor Green"
start "Backend Dev Server" cmd /k "uvicorn server:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2 >nul
cd ..

powershell -NoProfile -Command "Write-Host ''; Write-Host '✅ Backend server starting...' -ForegroundColor Green; Write-Host '🌐 API: http://localhost:8000' -ForegroundColor Cyan; Write-Host '📚 Docs: http://localhost:8000/docs' -ForegroundColor Cyan; Write-Host '📝 Check the new terminal window for logs' -ForegroundColor Yellow; Write-Host '';"
pause
goto MENU

:BOTH_DEV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🚀 Starting Both Frontend and Backend...            ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

REM Start Backend
if exist "backend\server.py" (
    powershell -NoProfile -Command "Write-Host '⚡ Starting Backend...' -ForegroundColor Yellow"
    cd backend
    start "Backend Dev Server" cmd /k "uvicorn server:app --reload --host 0.0.0.0 --port 8000"
    cd ..
    timeout /t 2 >nul
    powershell -NoProfile -Command "Write-Host '✅ Backend started' -ForegroundColor Green"
) else (
    powershell -NoProfile -Command "Write-Host '⚠️  Backend not found, skipping...' -ForegroundColor Yellow"
)

REM Start Frontend
if exist "frontend\package.json" (
    powershell -NoProfile -Command "Write-Host '🎨 Starting Frontend...' -ForegroundColor Yellow"
    cd frontend
    start "Frontend Dev Server" cmd /k "npm start"
    cd ..
    timeout /t 2 >nul
    powershell -NoProfile -Command "Write-Host '✅ Frontend started' -ForegroundColor Green"
) else (
    powershell -NoProfile -Command "Write-Host '⚠️  Frontend not found, skipping...' -ForegroundColor Yellow"
)

powershell -NoProfile -Command "Write-Host ''; Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host '🎉 Both servers are starting!' -ForegroundColor Green; Write-Host ''; Write-Host '📱 Frontend: http://localhost:3000' -ForegroundColor Cyan; Write-Host '⚡ Backend:  http://localhost:8000' -ForegroundColor Cyan; Write-Host '📚 API Docs: http://localhost:8000/docs' -ForegroundColor Cyan; Write-Host ''; Write-Host '📝 Check the terminal windows for logs' -ForegroundColor Yellow; Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Cyan; Write-Host '';"
pause
goto MENU

:INSTALL_ALL
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  📦 Installing All Dependencies...                    ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\install-deps.ps1"
pause
goto MENU

REM ============================================================
REM BUILD & TEST SECTION
REM ============================================================

:BUILD_FRONTEND
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🔨 Building Frontend for Production...              ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

if not exist "frontend\package.json" (
    powershell -NoProfile -Command "Write-Host '❌ Frontend directory not found!' -ForegroundColor Red"
    timeout /t 2
    goto MENU
)

cd frontend
powershell -NoProfile -Command "Write-Host '🔨 Running production build...' -ForegroundColor Yellow"
call npm run build
if %errorlevel% equ 0 (
    powershell -NoProfile -Command "Write-Host ''; Write-Host '✅ Frontend built successfully!' -ForegroundColor Green"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host '❌ Build failed! Check errors above.' -ForegroundColor Red"
)
cd ..
pause
goto MENU

:TEST_BACKEND
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🧪 Testing Backend...                                ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

if not exist "backend\server.py" (
    powershell -NoProfile -Command "Write-Host '❌ Backend directory not found!' -ForegroundColor Red"
    timeout /t 2
    goto MENU
)

cd backend
powershell -NoProfile -Command "Write-Host '🧪 Running backend tests...' -ForegroundColor Yellow"
call pytest
if %errorlevel% equ 0 (
    powershell -NoProfile -Command "Write-Host ''; Write-Host '✅ All tests passed!' -ForegroundColor Green"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host '⚠️  Some tests failed. Check output above.' -ForegroundColor Yellow"
)
cd ..
pause
goto MENU

:BUILD_ALL
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🔨 Building and Testing Everything...                ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\build-all.ps1"
pause
goto MENU

REM ============================================================
REM DEPLOYMENT SECTION
REM ============================================================

:DEPLOY_DASHBOARD
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🎯 Opening Deployment Dashboard...                   ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\deployment-dashboard.ps1"
goto MENU

:DEPLOY_FRONTEND
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🚀 SSH Deployment...                                 ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\deploy-ssh.ps1"
pause
goto MENU


:DEPLOY_FULL
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🚀 Full Deployment (Frontend + Backend)...           ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\deploy-full.ps1"
pause
goto MENU

REM ============================================================
REM UTILITIES SECTION
REM ============================================================

:CHECK_ENV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🔐 Environment Variables Check                       ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\check-env.ps1"
pause
goto MENU

:VIEW_LOGS
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  📋 Viewing Deployment Logs...                        ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -Command "Write-Host 'Opening GitHub Actions in browser...' -ForegroundColor Yellow; Start-Process 'https://github.com/grilojr09br/Superando-Limites-Website/actions'; Write-Host ''; Write-Host '📝 For Railway logs:' -ForegroundColor Cyan; Write-Host '  1. Go to https://railway.app/dashboard' -ForegroundColor White; Write-Host '  2. Select your project' -ForegroundColor White; Write-Host '  3. Click View Logs' -ForegroundColor White; Write-Host '';"
pause
goto MENU

:CLEAN
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🧹 Cleaning Build Artifacts...                       ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\clean.ps1"
pause
goto MENU

:OPTIMIZE_IMAGES
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  🖼️  Optimizing Images...                              ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host '';"

if not exist "scripts\optimize-images.js" (
    powershell -NoProfile -Command "Write-Host '❌ Optimization script not found!' -ForegroundColor Red"
    timeout /t 2
    goto MENU
)

powershell -NoProfile -Command "Write-Host '🖼️  Running image optimization...' -ForegroundColor Yellow"
node scripts\optimize-images.js
if %errorlevel% equ 0 (
    powershell -NoProfile -Command "Write-Host ''; Write-Host '✅ Images optimized successfully!' -ForegroundColor Green"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host '⚠️  Optimization completed with warnings.' -ForegroundColor Yellow"
)
pause
goto MENU

:CHECK_REQUIREMENTS
cls
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\check-requirements.ps1"
pause
goto MENU

REM ============================================================
REM EXIT
REM ============================================================

:EXIT
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '╔═══════════════════════════════════════════════════════╗' -ForegroundColor Cyan; Write-Host '║  👋 Thank you for using Dev Manager!                  ║' -ForegroundColor Yellow; Write-Host '╚═══════════════════════════════════════════════════════╝' -ForegroundColor Cyan; Write-Host ''; Write-Host '🚀 Happy coding!' -ForegroundColor Green; Write-Host '';"
timeout /t 2 >nul
exit /b 0
