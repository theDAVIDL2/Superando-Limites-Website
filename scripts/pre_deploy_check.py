#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de verificação pré-deploy
Executa todos os testes críticos antes de fazer deploy para produção
"""

import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime

# Configura encoding UTF-8 para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    """Imprime cabeçalho"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(70)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.RESET}\n")

def print_success(text: str):
    """Imprime mensagem de sucesso"""
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")

def print_error(text: str):
    """Imprime mensagem de erro"""
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")

def print_warning(text: str):
    """Imprime mensagem de aviso"""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.RESET}")

def print_info(text: str):
    """Imprime mensagem informativa"""
    print(f"{Colors.BLUE}ℹ {text}{Colors.RESET}")

def run_command(cmd: str, cwd: Path = None) -> tuple[bool, str]:
    """Executa comando e retorna sucesso e output"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=300,
            encoding='utf-8',
            errors='replace'  # Substitui caracteres inválidos ao invés de falhar
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)

def check_git_status(root_dir: Path) -> bool:
    """Verifica se há mudanças não commitadas"""
    print_info("Verificando status do Git...")
    
    success, output = run_command("git status --porcelain", cwd=root_dir)
    
    if not success:
        print_warning("Não foi possível verificar o Git")
        return True  # Continua mesmo assim
    
    if output.strip():
        print_warning("Há mudanças não commitadas:")
        print(output)
        response = input("\nDeseja continuar mesmo assim? (s/N): ")
        return response.lower() == 's'
    else:
        print_success("Repositório limpo")
        return True

def check_branch(root_dir: Path) -> bool:
    """Verifica se está na branch correta"""
    print_info("Verificando branch atual...")
    
    success, output = run_command("git branch --show-current", cwd=root_dir)
    
    if not success:
        print_warning("Não foi possível verificar a branch")
        return True
    
    branch = output.strip()
    print_info(f"Branch atual: {branch}")
    
    if branch != "main" and branch != "master":
        print_warning(f"Você está na branch '{branch}', não na main/master")
        response = input("Deseja continuar? (s/N): ")
        return response.lower() == 's'
    
    print_success(f"Branch correta: {branch}")
    return True

def check_env_production(root_dir: Path) -> bool:
    """Verifica se variáveis de ambiente estão em modo produção"""
    print_info("Verificando configurações de produção...")
    
    env_file = root_dir / "frontend" / ".env"
    
    if not env_file.exists():
        print_error(".env não encontrado")
        return False
    
    with open(env_file) as f:
        content = f.read()
    
    warnings = []
    
    # Verifica se não está usando URLs de desenvolvimento
    if "localhost" in content.lower():
        warnings.append("URLs localhost encontradas no .env")
    
    if "127.0.0.1" in content:
        warnings.append("IPs locais (127.0.0.1) encontrados no .env")
    
    # Verifica se tem as variáveis de produção
    required_vars = [
        "REACT_APP_OPENROUTER_API_KEY",
        "REACT_APP_N8N_WEBHOOK_URL"
    ]
    
    missing = [var for var in required_vars if var not in content]
    
    if missing:
        print_error(f"Variáveis faltando: {', '.join(missing)}")
        return False
    
    if warnings:
        print_warning("Avisos encontrados:")
        for warning in warnings:
            print_warning(f"  - {warning}")
        response = input("\nDeseja continuar? (s/N): ")
        return response.lower() == 's'
    
    print_success("Configurações de produção OK")
    return True

def run_stability_tests(root_dir: Path) -> bool:
    """Executa testes de estabilidade"""
    print_info("Executando testes de estabilidade...")
    
    test_script = root_dir / "scripts" / "test_stability.py"
    
    if not test_script.exists():
        print_error("Script de teste não encontrado")
        return False
    
    # Executa testes pulando build e servidor para ser mais rápido
    success, output = run_command(
        f"python {test_script} --skip-build --skip-server",
        cwd=root_dir
    )
    
    print(output)
    
    if success:
        print_success("Testes de estabilidade passaram")
        return True
    else:
        print_error("Testes de estabilidade falharam")
        return False

def create_build(root_dir: Path) -> bool:
    """Cria build de produção"""
    print_info("Criando build de produção...")
    
    frontend_dir = root_dir / "frontend"
    
    success, output = run_command("npm run build", cwd=frontend_dir)
    
    if success:
        print_success("Build criado com sucesso")
        
        # Verifica tamanho do build
        build_dir = frontend_dir / "build"
        if build_dir.exists():
            size = sum(f.stat().st_size for f in build_dir.rglob('*') if f.is_file())
            size_mb = size / (1024 * 1024)
            print_info(f"Tamanho do build: {size_mb:.2f} MB")
        
        return True
    else:
        print_error("Erro ao criar build")
        print(output[-1000:])  # Últimos 1000 chars
        return False

def generate_deploy_report(root_dir: Path, all_checks_passed: bool):
    """Gera relatório de deploy"""
    report_file = root_dir / "DEPLOY_REPORT.txt"
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("="*70 + "\n")
        f.write("RELATÓRIO DE PRÉ-DEPLOY\n")
        f.write("="*70 + "\n\n")
        f.write(f"Data/Hora: {timestamp}\n")
        f.write(f"Status: {'✓ APROVADO' if all_checks_passed else '✗ REPROVADO'}\n\n")
        
        # Git info
        success, branch = run_command("git branch --show-current", cwd=root_dir)
        if success:
            f.write(f"Branch: {branch.strip()}\n")
        
        success, commit = run_command("git rev-parse HEAD", cwd=root_dir)
        if success:
            f.write(f"Commit: {commit.strip()}\n")
        
        success, message = run_command("git log -1 --pretty=%B", cwd=root_dir)
        if success:
            f.write(f"Última mensagem: {message.strip()}\n")
        
        f.write("\n" + "="*70 + "\n")
        
        if all_checks_passed:
            f.write("\n✓ Todos os testes passaram. Site pronto para deploy.\n")
            f.write("\nPróximos passos:\n")
            f.write("1. Faça upload do diretório frontend/build/ para o servidor\n")
            f.write("2. Configure variáveis de ambiente no servidor\n")
            f.write("3. Reinicie o servidor backend se necessário\n")
            f.write("4. Teste o site em produção\n")
        else:
            f.write("\n✗ Alguns testes falharam. Corrija os problemas antes do deploy.\n")
    
    print_info(f"Relatório salvo em: {report_file}")

def main():
    """Função principal"""
    root_dir = Path(__file__).parent.parent
    
    print_header("VERIFICAÇÃO PRÉ-DEPLOY")
    print_info(f"Diretório do projeto: {root_dir}\n")
    
    checks = [
        ("Status do Git", lambda: check_git_status(root_dir)),
        ("Branch", lambda: check_branch(root_dir)),
        ("Configurações de Produção", lambda: check_env_production(root_dir)),
        ("Testes de Estabilidade", lambda: run_stability_tests(root_dir)),
        ("Build de Produção", lambda: create_build(root_dir)),
    ]
    
    results = []
    
    for name, check_func in checks:
        print_header(f"Verificando: {name}")
        try:
            passed = check_func()
            results.append((name, passed))
            
            if not passed:
                print_error(f"{name}: FALHOU")
                response = input("\nDeseja continuar com as próximas verificações? (s/N): ")
                if response.lower() != 's':
                    break
            else:
                print_success(f"{name}: OK")
        except Exception as e:
            print_error(f"Erro em {name}: {str(e)}")
            results.append((name, False))
            break
    
    # Resumo final
    print_header("RESUMO FINAL")
    
    all_passed = all(passed for _, passed in results)
    
    for name, passed in results:
        if passed:
            print_success(f"{name}: PASSOU")
        else:
            print_error(f"{name}: FALHOU")
    
    print()
    
    if all_passed:
        print_success("✓ TODAS AS VERIFICAÇÕES PASSARAM!")
        print_success("✓ Site pronto para deploy em produção")
        print_info("\nArquivos para upload estão em: frontend/build/")
    else:
        print_error("✗ ALGUMAS VERIFICAÇÕES FALHARAM")
        print_error("✗ Corrija os problemas antes de fazer deploy")
    
    # Gera relatório
    generate_deploy_report(root_dir, all_passed)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())

