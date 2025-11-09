@echo off
REM Script de verificação pré-deploy para Windows
REM Executa todos os testes antes de fazer deploy

echo ========================================
echo   VERIFICACAO PRE-DEPLOY
echo ========================================
echo.

cd /d "%~dp0\.."

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado. Instale Python 3.7+ primeiro.
    exit /b 1
)

python scripts\pre_deploy_check.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SITE PRONTO PARA DEPLOY
    echo ========================================
    echo.
    echo Arquivos para upload: frontend\build\
    echo.
) else (
    echo.
    echo ========================================
    echo   CORRIJA OS PROBLEMAS ANTES DO DEPLOY
    echo ========================================
    echo.
)

pause
exit /b %errorlevel%

