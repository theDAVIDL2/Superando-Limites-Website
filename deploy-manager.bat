@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

REM ================================================================
REM Development & Deployment Manager v3.0
REM Universal Website Project Manager
REM ================================================================

REM Check for config file
if not exist ".deploy-config.json" (
    cls
    powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Yellow; Write-Host ' First Time Setup' -ForegroundColor Cyan; Write-Host '============================================================' -ForegroundColor Yellow; Write-Host ''; Write-Host 'No configuration found. Creating from example...' -ForegroundColor White; Write-Host '';"
    
    if exist ".deploy-config.json.example" (
        copy ".deploy-config.json.example" ".deploy-config.json" >nul
        powershell -NoProfile -Command "Write-Host 'Created .deploy-config.json' -ForegroundColor Green; Write-Host ''; Write-Host 'Please edit .deploy-config.json with your settings:' -ForegroundColor Yellow; Write-Host '  - Repository URL' -ForegroundColor White; Write-Host '  - Live website URL' -ForegroundColor White; Write-Host '  - SSH settings (if using SSH deploy)' -ForegroundColor White; Write-Host ''; Write-Host 'Press any key to open the config file...' -ForegroundColor Cyan;"
        pause >nul
        notepad ".deploy-config.json"
        powershell -NoProfile -Command "Write-Host ''; Write-Host 'Configuration saved! Restart deploy-manager.bat' -ForegroundColor Green; Write-Host '';"
        pause
        exit /b
    ) else (
        powershell -NoProfile -Command "Write-Host 'ERROR: .deploy-config.json.example not found!' -ForegroundColor Red; Write-Host 'Please ensure the file exists in the project root.' -ForegroundColor Yellow;"
        pause
        exit /b
    )
)

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
if "%choice%"=="9" goto DEPLOY_SSH
if "%choice%"=="10" goto DEPLOY_FULL
if "%choice%"=="11" goto CHECK_ENV
if "%choice%"=="12" goto VIEW_LOGS
if "%choice%"=="13" goto CLEAN
if "%choice%"=="14" goto EDIT_CONFIG
if "%choice%"=="15" goto CHECK_REQUIREMENTS
if "%choice%"=="0" goto EXIT

powershell -NoProfile -Command "Write-Host '❌ Invalid choice! Please try again.' -ForegroundColor Red"
timeout /t 2 >nul
goto MENU

REM ============================================================
REM SHOW MENU FUNCTION
REM ============================================================

:SHOW_MENU
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '         WEBSITE PROJECT - DEV MANAGER v3.0' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ''; Write-Host ' DEV SERVERS' -ForegroundColor Green; Write-Host '  [1] Start Frontend Dev Server' -ForegroundColor White; Write-Host '  [2] Start Backend Dev Server' -ForegroundColor White; Write-Host '  [3] Start Both (Frontend + Backend)' -ForegroundColor White; Write-Host '  [4] Install All Dependencies' -ForegroundColor White; Write-Host ''; Write-Host ' BUILD AND TEST' -ForegroundColor Green; Write-Host '  [5] Build Frontend for Production' -ForegroundColor White; Write-Host '  [6] Test Backend' -ForegroundColor White; Write-Host '  [7] Build and Test Everything' -ForegroundColor White; Write-Host ''; Write-Host ' DEPLOYMENT' -ForegroundColor Green; Write-Host '  [8] Deployment Dashboard (Git Push)' -ForegroundColor White; Write-Host '  [9] Deploy via SSH/SCP' -ForegroundColor White; Write-Host '  [10] Full Deployment (Build + Deploy)' -ForegroundColor White; Write-Host ''; Write-Host ' UTILITIES' -ForegroundColor Green; Write-Host '  [11] Check Environment Variables' -ForegroundColor White; Write-Host '  [12] View Git Logs' -ForegroundColor White; Write-Host '  [13] Clean Build Artifacts' -ForegroundColor White; Write-Host '  [14] Edit Configuration' -ForegroundColor White; Write-Host '  [15] Check System Requirements' -ForegroundColor White; Write-Host ''; Write-Host '  [0] Exit' -ForegroundColor Red; Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
goto :EOF

REM ============================================================
REM DEVELOPMENT SECTION
REM ============================================================

:FRONTEND_DEV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Starting Frontend Development Server...' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
cd frontend
start cmd /k "npm start"
powershell -NoProfile -Command "Write-Host 'Frontend server starting in new window...' -ForegroundColor Green; Write-Host 'Access at: http://localhost:3000' -ForegroundColor Cyan; Write-Host '';"
cd ..
pause
goto MENU

:BACKEND_DEV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Starting Backend Development Server...' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
cd backend
if exist ".venv" (
    start cmd /k ".venv\Scripts\activate && uvicorn server:app --reload"
) else (
    start cmd /k "uvicorn server:app --reload"
)
powershell -NoProfile -Command "Write-Host 'Backend server starting in new window...' -ForegroundColor Green; Write-Host 'Access at: http://localhost:8000' -ForegroundColor Cyan; Write-Host 'API Docs: http://localhost:8000/docs' -ForegroundColor Cyan; Write-Host '';"
cd ..
pause
goto MENU

:BOTH_DEV
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Starting Frontend + Backend Servers...' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"

REM Start Frontend
cd frontend
start cmd /k "title Frontend Dev Server && npm start"
cd ..

REM Start Backend
cd backend
if exist ".venv" (
    start cmd /k "title Backend Dev Server && .venv\Scripts\activate && uvicorn server:app --reload"
) else (
    start cmd /k "title Backend Dev Server && uvicorn server:app --reload"
)
cd ..

powershell -NoProfile -Command "Write-Host 'Both servers starting...' -ForegroundColor Green; Write-Host ''; Write-Host 'Frontend: http://localhost:3000' -ForegroundColor Cyan; Write-Host 'Backend:  http://localhost:8000' -ForegroundColor Cyan; Write-Host 'API Docs: http://localhost:8000/docs' -ForegroundColor Cyan; Write-Host '';"
pause
goto MENU

:INSTALL_ALL
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Installing All Dependencies...' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
if exist "scripts\install-deps.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\install-deps.ps1"
) else (
    powershell -NoProfile -Command "Write-Host 'Installing Frontend...' -ForegroundColor Yellow;"
    cd frontend
    call npm install
    cd ..
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Installing Backend...' -ForegroundColor Yellow;"
    cd backend
    if not exist ".venv" (python -m venv .venv)
    call .venv\Scripts\pip install -r requirements.txt
    cd ..
)
powershell -NoProfile -Command "Write-Host ''; Write-Host 'Done!' -ForegroundColor Green;"
pause
goto MENU

REM ============================================================
REM BUILD & TEST SECTION
REM ============================================================

:BUILD_FRONTEND
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Building Frontend for Production...' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
cd frontend
call npm run build
cd ..
powershell -NoProfile -Command "Write-Host ''; Write-Host 'Frontend build complete!' -ForegroundColor Green;"
pause
goto MENU

:TEST_BACKEND
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Testing Backend...' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
cd backend
if exist ".venv\Scripts\pytest.exe" (
    call .venv\Scripts\pytest.exe
) else (
    pytest
)
cd ..
pause
goto MENU

:BUILD_ALL
cls
if exist "scripts\build-all.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\build-all.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Building Frontend...' -ForegroundColor Yellow;"
    cd frontend
    call npm run build
    cd ..
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Testing Backend...' -ForegroundColor Yellow;"
    cd backend
    if exist ".venv\Scripts\pytest.exe" (call .venv\Scripts\pytest.exe) else (pytest)
    cd ..
)
pause
goto MENU

REM ============================================================
REM DEPLOYMENT SECTION
REM ============================================================

:DEPLOY_DASHBOARD
cls
if exist "scripts\deployment-dashboard.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\deployment-dashboard.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'ERROR: deployment-dashboard.ps1 not found!' -ForegroundColor Red; Write-Host 'Please ensure scripts folder exists.' -ForegroundColor Yellow;"
    pause
)
goto MENU

:DEPLOY_SSH
cls
if exist "scripts\deploy-ssh.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\deploy-ssh.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'ERROR: deploy-ssh.ps1 not found!' -ForegroundColor Red; Write-Host 'Please ensure scripts folder exists.' -ForegroundColor Yellow;"
    pause
)
goto MENU

:DEPLOY_FULL
cls
if exist "scripts\deploy-full.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\deploy-full.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Building and deploying...' -ForegroundColor Yellow;"
    cd frontend
    call npm run build
    cd ..
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Committing changes...' -ForegroundColor Yellow;"
    git add .
    git commit -m "deploy: update"
    git push origin main
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Deployed!' -ForegroundColor Green;"
    pause
)
goto MENU

REM ============================================================
REM UTILITIES SECTION
REM ============================================================

:CHECK_ENV
cls
if exist "scripts\check-env.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\check-env.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Checking environment files...' -ForegroundColor Yellow; Write-Host ''; if (Test-Path 'frontend\.env') { Write-Host 'OK: frontend\.env exists' -ForegroundColor Green } else { Write-Host 'WARNING: frontend\.env not found' -ForegroundColor Yellow }; if (Test-Path 'backend\.env') { Write-Host 'OK: backend\.env exists' -ForegroundColor Green } else { Write-Host 'WARNING: backend\.env not found' -ForegroundColor Yellow }; Write-Host '';"
    pause
)
goto MENU

:VIEW_LOGS
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Recent Git Commits' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host '';"
git log --oneline -10
powershell -NoProfile -Command "Write-Host '';"
pause
goto MENU

:CLEAN
cls
if exist "scripts\clean.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\clean.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Cleaning build artifacts...' -ForegroundColor Yellow; if (Test-Path 'frontend\build') { Remove-Item 'frontend\build' -Recurse -Force; Write-Host 'Removed frontend\build' -ForegroundColor Green }; if (Test-Path 'backend\__pycache__') { Remove-Item 'backend\__pycache__' -Recurse -Force; Write-Host 'Removed backend\__pycache__' -ForegroundColor Green }; Write-Host 'Done!' -ForegroundColor Green;"
    pause
)
goto MENU

:EDIT_CONFIG
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ' Edit Configuration' -ForegroundColor Yellow; Write-Host '============================================================' -ForegroundColor Cyan; Write-Host ''; Write-Host 'Opening .deploy-config.json...' -ForegroundColor White; Write-Host '';"
if exist ".deploy-config.json" (
    notepad ".deploy-config.json"
) else (
    powershell -NoProfile -Command "Write-Host 'ERROR: .deploy-config.json not found!' -ForegroundColor Red; Write-Host 'Creating from example...' -ForegroundColor Yellow;"
    copy ".deploy-config.json.example" ".deploy-config.json" >nul
    notepad ".deploy-config.json"
)
powershell -NoProfile -Command "Write-Host ''; Write-Host 'Configuration updated!' -ForegroundColor Green;"
pause
goto MENU

:CHECK_REQUIREMENTS
cls
if exist "scripts\check-requirements.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "scripts\check-requirements.ps1"
) else (
    powershell -NoProfile -Command "Write-Host ''; Write-Host 'Checking system requirements...' -ForegroundColor Yellow; Write-Host ''; try { node -v | Out-Null; Write-Host 'OK: Node.js installed' -ForegroundColor Green } catch { Write-Host 'ERROR: Node.js not found' -ForegroundColor Red }; try { python -V | Out-Null; Write-Host 'OK: Python installed' -ForegroundColor Green } catch { Write-Host 'ERROR: Python not found' -ForegroundColor Red }; try { git --version | Out-Null; Write-Host 'OK: Git installed' -ForegroundColor Green } catch { Write-Host 'ERROR: Git not found' -ForegroundColor Red }; Write-Host '';"
    pause
)
goto MENU

:EXIT
cls
powershell -NoProfile -Command "Write-Host ''; Write-Host 'Goodbye! 👋' -ForegroundColor Cyan; Write-Host '';"
timeout /t 1 >nul
exit

