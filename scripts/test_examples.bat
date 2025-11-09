@echo off
REM Exemplos de uso dos scripts de teste
REM Execute este arquivo para ver todas as opções disponíveis

echo.
echo ================================================================================
echo                        SCRIPTS DE TESTE - EXEMPLOS
echo ================================================================================
echo.
echo Escolha uma opcao:
echo.
echo 1. Teste RAPIDO (10s) - Durante desenvolvimento
echo    Comando: scripts\test_stability.bat --skip-build --skip-server
echo.
echo 2. Teste MEDIO (30s) - Antes de commit
echo    Comando: scripts\test_stability.bat --skip-server
echo.
echo 3. Teste COMPLETO (3-5min) - Com build e servidor
echo    Comando: scripts\test_stability.bat
echo.
echo 4. PRE-DEPLOY CHECK (5min) - Antes de fazer deploy
echo    Comando: scripts\pre_deploy_check.bat
echo.
echo 5. Ver documentacao completa
echo.
echo 0. Sair
echo.
echo ================================================================================
echo.

set /p choice="Digite o numero da opcao: "

if "%choice%"=="1" (
    echo.
    echo Executando TESTE RAPIDO...
    echo.
    scripts\test_stability.bat --skip-build --skip-server
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Executando TESTE MEDIO...
    echo.
    scripts\test_stability.bat --skip-server
    goto end
)

if "%choice%"=="3" (
    echo.
    echo ========================================
    echo ATENCAO: Certifique-se de que o servidor backend esta rodando!
    echo Para iniciar: cd backend ^&^& python server.py
    echo ========================================
    echo.
    pause
    echo.
    echo Executando TESTE COMPLETO...
    echo.
    scripts\test_stability.bat
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Executando PRE-DEPLOY CHECK...
    echo.
    scripts\pre_deploy_check.bat
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Abrindo documentacao...
    start notepad scripts\README_TESTS.md
    goto end
)

if "%choice%"=="0" (
    exit /b 0
)

echo.
echo Opcao invalida!
echo.

:end
pause

