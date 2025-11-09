@echo off
REM Script Windows para testar estabilidade do site
REM Uso: test_stability.bat [--skip-build] [--skip-server]

echo ========================================
echo    TESTE DE ESTABILIDADE DO SITE
echo ========================================
echo.

cd /d "%~dp0\.."

REM Verifica se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado. Instale Python 3.7+ primeiro.
    exit /b 1
)

REM Executa o script Python
python scripts\test_stability.py %*

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    TESTES CONCLUIDOS COM SUCESSO
    echo ========================================
) else (
    echo.
    echo ========================================
    echo    ALGUNS TESTES FALHARAM
    echo ========================================
)

exit /b %errorlevel%

