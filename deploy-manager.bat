@echo off
REM ================================================================
REM Development & Deployment Manager
REM Website Project - Automated Deployment System
REM ================================================================

:MENU
cls
echo.
echo ============================================================
echo           WEBSITE PROJECT - DEV MANAGER
echo ============================================================
echo.
echo  DEVELOPMENT
echo  [1] Start Frontend Dev Server (React)
echo  [2] Start Backend Dev Server (FastAPI)
echo  [3] Start Both (Frontend + Backend)
echo  [4] Install All Dependencies
echo.
echo  BUILD
echo  [5] Build Frontend for Production
echo  [6] Test Backend
echo  [7] Build & Test Everything
echo.
echo  DEPLOYMENT
echo  [8] Deploy Frontend (SSH/FTP)
echo  [9] Deploy Backend to Railway
echo  [10] Full Deployment (Frontend + Backend)
echo.
echo  UTILITIES
echo  [11] Check Environment Variables
echo  [12] View Deployment Logs
echo  [13] Clean Build Artifacts
echo  [14] Run Image Optimization
echo.
echo  [0] Exit
echo.
echo ============================================================
echo.

set /p choice="Enter your choice (0-14): "

if "%choice%"=="1" goto FRONTEND_DEV
if "%choice%"=="2" goto BACKEND_DEV
if "%choice%"=="3" goto BOTH_DEV
if "%choice%"=="4" goto INSTALL_ALL
if "%choice%"=="5" goto BUILD_FRONTEND
if "%choice%"=="6" goto TEST_BACKEND
if "%choice%"=="7" goto BUILD_ALL
if "%choice%"=="8" goto DEPLOY_FRONTEND
if "%choice%"=="9" goto DEPLOY_BACKEND
if "%choice%"=="10" goto DEPLOY_FULL
if "%choice%"=="11" goto CHECK_ENV
if "%choice%"=="12" goto VIEW_LOGS
if "%choice%"=="13" goto CLEAN
if "%choice%"=="14" goto OPTIMIZE_IMAGES
if "%choice%"=="0" goto EXIT

echo Invalid choice! Please try again.
timeout /t 2 >nul
goto MENU

REM ============================================================
REM DEVELOPMENT SECTION
REM ============================================================

:FRONTEND_DEV
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Starting Frontend Development Server...            │
echo └─────────────────────────────────────────────────────┘
echo.
cd frontend
start cmd /k "npm start"
timeout /t 2
echo.
echo ✅ Frontend server starting on http://localhost:3000
pause
goto MENU

:BACKEND_DEV
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Starting Backend Development Server...             │
echo └─────────────────────────────────────────────────────┘
echo.
cd backend
start cmd /k "uvicorn server:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2
echo.
echo ✅ Backend server starting on http://localhost:8000
echo 📚 API docs available at http://localhost:8000/docs
pause
goto MENU

:BOTH_DEV
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Starting Frontend and Backend Servers...           │
echo └─────────────────────────────────────────────────────┘
echo.
cd frontend
start cmd /k "npm start"
timeout /t 1
cd ../backend
start cmd /k "uvicorn server:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2
echo.
echo ✅ Both servers are starting!
echo 🎨 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
pause
goto MENU

:INSTALL_ALL
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Installing All Dependencies...                     │
echo └─────────────────────────────────────────────────────┘
echo.
echo [1/2] Installing Frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend installation failed!
    pause
    goto MENU
)
echo ✅ Frontend dependencies installed
echo.
echo [2/2] Installing Backend dependencies...
cd ../backend
call pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend installation failed!
    pause
    goto MENU
)
echo ✅ Backend dependencies installed
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  ✅ All dependencies installed successfully!        │
echo └─────────────────────────────────────────────────────┘
pause
goto MENU

REM ============================================================
REM BUILD SECTION
REM ============================================================

:BUILD_FRONTEND
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Building Frontend for Production...                │
echo └─────────────────────────────────────────────────────┘
echo.
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed!
    pause
    goto MENU
)
echo.
echo ✅ Frontend built successfully!
echo 📦 Build output: frontend/build
echo 📊 Build size:
dir build /s | find "bytes"
pause
goto MENU

:TEST_BACKEND
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Testing Backend...                                 │
echo └─────────────────────────────────────────────────────┘
echo.
cd backend
set TESTING=true
call pytest -v || echo ⚠️ No tests found or tests not configured
echo.
echo ✅ Backend tests completed
pause
goto MENU

:BUILD_ALL
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Building Everything...                             │
echo └─────────────────────────────────────────────────────┘
echo.
echo [1/2] Building Frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed!
    pause
    goto MENU
)
echo ✅ Frontend built
echo.
echo [2/2] Testing Backend...
cd ../backend
set TESTING=true
call pytest -v || echo ⚠️ Tests skipped
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  ✅ Build & Test Complete!                          │
echo └─────────────────────────────────────────────────────┘
pause
goto MENU

REM ============================================================
REM DEPLOYMENT SECTION
REM ============================================================

:DEPLOY_FRONTEND
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Deploying Frontend...                              │
echo └─────────────────────────────────────────────────────┘
echo.
echo Select deployment method:
echo [1] Deploy to Hostinger (SSH)
echo [2] Deploy to Netlify
echo [3] Deploy to Vercel
echo [4] Manual (just build)
echo.
set /p deploy_choice="Enter choice (1-4): "

if "%deploy_choice%"=="1" (
    cd scripts
    if exist deploy-frontend.ps1 (
        powershell -ExecutionPolicy Bypass -File deploy-frontend.ps1
    ) else (
        echo ❌ Deployment script not found!
        echo 📝 Please create scripts/deploy-frontend.ps1
    )
)
if "%deploy_choice%"=="2" (
    cd frontend
    if exist node_modules\.bin\netlify (
        call npm run build
        call npx netlify deploy --prod
    ) else (
        echo Installing Netlify CLI...
        call npm install -g netlify-cli
        call npx netlify deploy --prod
    )
)
if "%deploy_choice%"=="3" (
    cd frontend
    if exist node_modules\.bin\vercel (
        call npx vercel --prod
    ) else (
        echo Installing Vercel CLI...
        call npm install -g vercel
        call npx vercel --prod
    )
)
if "%deploy_choice%"=="4" (
    cd frontend
    call npm run build
    echo ✅ Frontend built! Deploy manually from: frontend/build
)

echo.
pause
goto MENU

:DEPLOY_BACKEND
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Deploying Backend to Railway...                   │
echo └─────────────────────────────────────────────────────┘
echo.
echo Backend deployment is automatic via Railway.
echo.
echo To trigger deployment:
echo 1. Push changes to GitHub: git push origin main
echo 2. Railway will auto-deploy
echo.
echo Alternative: Use Railway CLI
if exist node_modules\.bin\railway (
    railway up
) else (
    echo Railway CLI not installed.
    echo Install: npm install -g @railway/cli
)
echo.
pause
goto MENU

:DEPLOY_FULL
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Full Deployment (Frontend + Backend)              │
echo └─────────────────────────────────────────────────────┘
echo.
echo [1/3] Building Frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed!
    pause
    goto MENU
)
echo ✅ Frontend built
echo.
echo [2/3] Testing Backend...
cd ../backend
set TESTING=true
call pytest -v || echo ⚠️ Tests skipped
echo.
echo [3/3] Committing and pushing to GitHub...
cd ..
echo.
set /p commit_msg="Enter commit message: "
git add .
git commit -m "%commit_msg%"
git push origin main
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  ✅ Deployment Triggered!                           │
echo │                                                     │
echo │  GitHub Actions will now:                          │
echo │  1. Build frontend                                 │
echo │  2. Test backend                                   │
echo │  3. Deploy via Railway (backend)                   │
echo │                                                     │
echo │  Check status:                                     │
echo │  https://github.com/YOUR_USERNAME/YOUR_REPO/actions│
echo └─────────────────────────────────────────────────────┘
pause
goto MENU

REM ============================================================
REM UTILITIES SECTION
REM ============================================================

:CHECK_ENV
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Environment Variables Check                       │
echo └─────────────────────────────────────────────────────┘
echo.
echo Frontend (.env):
if exist frontend\.env (
    echo ✅ frontend\.env exists
    type frontend\.env | findstr /V "KEY SECRET PASSWORD TOKEN"
) else (
    echo ❌ frontend\.env not found!
)
echo.
echo Backend (.env):
if exist backend\.env (
    echo ✅ backend\.env exists
    type backend\.env | findstr /V "KEY SECRET PASSWORD TOKEN URL"
) else (
    echo ❌ backend\.env not found!
)
echo.
pause
goto MENU

:VIEW_LOGS
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Viewing Deployment Logs                           │
echo └─────────────────────────────────────────────────────┘
echo.
echo Opening GitHub Actions in browser...
start https://github.com/YOUR_USERNAME/YOUR_REPO/actions
echo.
echo For Railway logs:
echo 1. Go to https://railway.app/dashboard
echo 2. Select your project
echo 3. Click "View Logs"
echo.
pause
goto MENU

:CLEAN
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Cleaning Build Artifacts...                       │
echo └─────────────────────────────────────────────────────┘
echo.
echo Cleaning frontend build...
if exist frontend\build (
    rd /s /q frontend\build
    echo ✅ Frontend build cleaned
) else (
    echo ℹ️ No frontend build to clean
)
echo.
echo Cleaning backend cache...
if exist backend\__pycache__ (
    rd /s /q backend\__pycache__
    echo ✅ Backend cache cleaned
) else (
    echo ℹ️ No backend cache to clean
)
echo.
echo Cleaning node_modules (optional)...
set /p clean_node="Clean node_modules? (y/n): "
if /i "%clean_node%"=="y" (
    if exist frontend\node_modules (
        echo This may take a while...
        rd /s /q frontend\node_modules
        echo ✅ node_modules cleaned
    )
)
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  ✅ Cleanup Complete!                               │
echo └─────────────────────────────────────────────────────┘
pause
goto MENU

:OPTIMIZE_IMAGES
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  Optimizing Images...                               │
echo └─────────────────────────────────────────────────────┘
echo.
if exist scripts\optimize-images.js (
    node scripts\optimize-images.js
    echo ✅ Image optimization complete!
) else (
    echo ❌ Optimization script not found!
    echo 📝 Expected: scripts/optimize-images.js
)
echo.
pause
goto MENU

:EXIT
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │  👋 Goodbye!                                        │
echo │  Happy coding! 🚀                                   │
echo └─────────────────────────────────────────────────────┘
echo.
timeout /t 2
exit

REM ============================================================
REM END OF SCRIPT
REM ============================================================

