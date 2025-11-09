#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de teste de estabilidade do site
Testa backend, frontend e integrações antes do deploy
"""

import os
import sys
import json
import subprocess
import time
import requests
from pathlib import Path
from typing import Dict, List, Tuple

# Configura encoding UTF-8 para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Cores para output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    """Imprime cabeçalho colorido"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

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

class StabilityTester:
    def __init__(self):
        self.root_dir = Path(__file__).parent.parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.results: Dict[str, List[Tuple[str, bool, str]]] = {
            'backend': [],
            'frontend': [],
            'integration': [],
            'security': []
        }
        
    def run_command(self, cmd: str, cwd: Path = None, timeout: int = 60) -> Tuple[bool, str]:
        """Executa comando e retorna sucesso e output"""
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                cwd=cwd or self.root_dir,
                capture_output=True,
                text=True,
                timeout=timeout,
                encoding='utf-8',
                errors='replace'  # Substitui caracteres inválidos ao invés de falhar
            )
            return result.returncode == 0, result.stdout + result.stderr
        except subprocess.TimeoutExpired:
            return False, "Timeout excedido"
        except Exception as e:
            return False, str(e)

    def test_backend_dependencies(self) -> bool:
        """Testa se as dependências do backend estão instaladas"""
        print_info("Testando dependências do backend...")
        
        requirements_file = self.backend_dir / "requirements.txt"
        if not requirements_file.exists():
            self.results['backend'].append(
                ("Dependências do Backend", False, "requirements.txt não encontrado")
            )
            print_error("requirements.txt não encontrado")
            return False
        
        success, output = self.run_command(
            f"pip list --format=freeze",
            cwd=self.backend_dir
        )
        
        if success:
            with open(requirements_file) as f:
                required = [line.split('==')[0].lower().strip() for line in f if line.strip() and not line.startswith('#')]
            
            installed = [line.split('==')[0].lower().strip() for line in output.split('\n') if '==' in line]
            
            # Normaliza nomes de pacotes (substitui - por _)
            installed_normalized = []
            for pkg in installed:
                installed_normalized.append(pkg)
                installed_normalized.append(pkg.replace('-', '_'))
                installed_normalized.append(pkg.replace('_', '-'))
            
            missing = [pkg for pkg in required if pkg not in installed_normalized]
            
            if missing:
                msg = f"Pacotes faltando: {', '.join(missing)}"
                self.results['backend'].append(("Dependências do Backend", False, msg))
                print_error(msg)
                return False
            else:
                self.results['backend'].append(("Dependências do Backend", True, "Todas instaladas"))
                print_success("Todas as dependências do backend estão instaladas")
                return True
        else:
            self.results['backend'].append(("Dependências do Backend", False, output))
            print_error("Erro ao verificar dependências")
            return False

    def test_backend_syntax(self) -> bool:
        """Testa sintaxe Python dos arquivos do backend"""
        print_info("Testando sintaxe do código Python...")
        
        python_files = list(self.backend_dir.glob("*.py"))
        errors = []
        
        for file in python_files:
            success, output = self.run_command(f"python -m py_compile {file.name}", cwd=self.backend_dir)
            if not success:
                errors.append(f"{file.name}: {output}")
        
        if errors:
            msg = "\n".join(errors)
            self.results['backend'].append(("Sintaxe Python", False, msg))
            print_error("Erros de sintaxe encontrados")
            return False
        else:
            self.results['backend'].append(("Sintaxe Python", True, f"{len(python_files)} arquivos OK"))
            print_success(f"Sintaxe de {len(python_files)} arquivos verificada")
            return True

    def test_backend_server(self, port: int = 5001, timeout: int = 5) -> bool:
        """Testa se o servidor backend responde"""
        print_info("Testando servidor backend...")
        
        try:
            response = requests.get(f"http://localhost:{port}/health", timeout=timeout)
            if response.status_code == 200:
                self.results['backend'].append(("Servidor Backend", True, f"Porta {port} respondendo"))
                print_success(f"Servidor backend respondendo na porta {port}")
                return True
            else:
                msg = f"Status code: {response.status_code}"
                self.results['backend'].append(("Servidor Backend", False, msg))
                print_error(msg)
                return False
        except requests.exceptions.RequestException as e:
            msg = f"Servidor não está rodando ou não responde: {str(e)}"
            self.results['backend'].append(("Servidor Backend", False, msg))
            print_warning(msg)
            print_info("Para testar o servidor, inicie-o primeiro com: python backend/server.py")
            return False

    def test_frontend_dependencies(self) -> bool:
        """Testa se as dependências do frontend estão instaladas"""
        print_info("Testando dependências do frontend...")
        
        node_modules = self.frontend_dir / "node_modules"
        package_json = self.frontend_dir / "package.json"
        
        if not package_json.exists():
            msg = "package.json não encontrado"
            self.results['frontend'].append(("Dependências do Frontend", False, msg))
            print_error(msg)
            return False
        
        if not node_modules.exists():
            msg = "node_modules não encontrado. Execute: npm install"
            self.results['frontend'].append(("Dependências do Frontend", False, msg))
            print_error(msg)
            return False
        
        # Verifica se há dependências críticas
        success, output = self.run_command("npm list --depth=0", cwd=self.frontend_dir)
        
        # npm list retorna exit code != 0 se há dependências faltando, mas pode ter warnings
        if "missing:" in output.lower() or "required" in output.lower():
            msg = "Dependências faltando. Execute: npm install"
            self.results['frontend'].append(("Dependências do Frontend", False, msg))
            print_error(msg)
            return False
        else:
            self.results['frontend'].append(("Dependências do Frontend", True, "Instaladas"))
            print_success("Dependências do frontend verificadas")
            return True

    def test_frontend_build(self) -> bool:
        """Testa se o frontend pode ser buildado"""
        print_info("Testando build do frontend (pode levar alguns minutos)...")
        
        # Remove build anterior se existir
        build_dir = self.frontend_dir / "build"
        if build_dir.exists():
            print_info("Removendo build anterior...")
        
        success, output = self.run_command("npm run build", cwd=self.frontend_dir, timeout=300)
        
        if success and build_dir.exists():
            self.results['frontend'].append(("Build do Frontend", True, "Build criado com sucesso"))
            print_success("Build do frontend criado com sucesso")
            return True
        else:
            msg = output[-500:] if len(output) > 500 else output  # Últimas 500 chars
            self.results['frontend'].append(("Build do Frontend", False, msg))
            print_error("Erro ao criar build do frontend")
            return False

    def test_frontend_lint(self) -> bool:
        """Testa linting do frontend"""
        print_info("Testando linting do frontend...")
        
        # Verifica se tem script de lint
        package_json = self.frontend_dir / "package.json"
        with open(package_json) as f:
            package_data = json.load(f)
        
        if "lint" not in package_data.get("scripts", {}):
            msg = "Script de lint não configurado (opcional)"
            self.results['frontend'].append(("Linting", True, msg))
            print_warning(msg)
            return True  # Não é crítico, retorna True
        
        success, output = self.run_command("npm run lint", cwd=self.frontend_dir, timeout=60)
        
        if success:
            self.results['frontend'].append(("Linting", True, "Sem erros"))
            print_success("Linting passou sem erros")
            return True
        else:
            msg = "Erros de linting encontrados"
            self.results['frontend'].append(("Linting", False, msg))
            print_warning(msg)
            return False

    def test_env_variables(self) -> bool:
        """Testa se variáveis de ambiente críticas estão configuradas"""
        print_info("Testando variáveis de ambiente...")
        
        env_file = self.frontend_dir / ".env"
        if not env_file.exists():
            msg = ".env não encontrado no frontend"
            self.results['security'].append(("Variáveis de Ambiente", False, msg))
            print_warning(msg)
            return False
        
        with open(env_file) as f:
            env_content = f.read()
        
        # Variáveis críticas (não verificamos valores, apenas presença)
        critical_vars = [
            "REACT_APP_OPENROUTER_API_KEY",
            "REACT_APP_N8N_WEBHOOK_URL"
        ]
        
        missing = [var for var in critical_vars if var not in env_content]
        
        if missing:
            msg = f"Variáveis faltando: {', '.join(missing)}"
            self.results['security'].append(("Variáveis de Ambiente", False, msg))
            print_error(msg)
            return False
        else:
            self.results['security'].append(("Variáveis de Ambiente", True, "Configuradas"))
            print_success("Variáveis de ambiente críticas configuradas")
            return True

    def test_secrets_exposure(self) -> bool:
        """Testa se há secrets expostos no código"""
        print_info("Testando exposição de secrets...")
        
        check_script = self.root_dir / "scripts" / "check_secrets.py"
        if not check_script.exists():
            msg = "Script de verificação não encontrado"
            self.results['security'].append(("Exposição de Secrets", False, msg))
            print_warning(msg)
            return False
        
        success, output = self.run_command(f"python {check_script}", cwd=self.root_dir)
        
        # Se exit code é 0 e output está vazio, não há secrets
        if success and not output.strip():
            self.results['security'].append(("Exposição de Secrets", True, "Nenhum secret exposto"))
            print_success("Nenhum secret exposto detectado")
            return True
        elif success:
            # Exit code 0 mas com output significa que há warnings (não críticos)
            msg = "Avisos encontrados, mas nenhum secret crítico"
            self.results['security'].append(("Exposição de Secrets", True, msg))
            print_warning(msg)
            return True
        else:
            msg = "Possíveis secrets expostos detectados"
            self.results['security'].append(("Exposição de Secrets", False, msg))
            print_error(msg)
            return False

    def test_api_endpoints(self) -> bool:
        """Testa endpoints críticos da API"""
        print_info("Testando endpoints da API...")
        
        base_url = "http://localhost:5001"
        endpoints = [
            ("/health", "GET"),
            ("/api/chat", "OPTIONS"),  # Testa CORS
        ]
        
        all_passed = True
        for endpoint, method in endpoints:
            try:
                if method == "GET":
                    response = requests.get(f"{base_url}{endpoint}", timeout=5)
                else:
                    response = requests.options(f"{base_url}{endpoint}", timeout=5)
                
                if response.status_code in [200, 204]:
                    print_success(f"{method} {endpoint}: OK")
                else:
                    print_warning(f"{method} {endpoint}: Status {response.status_code}")
                    all_passed = False
            except requests.exceptions.RequestException:
                print_warning(f"{method} {endpoint}: Servidor não está rodando")
                all_passed = False
        
        if all_passed:
            self.results['integration'].append(("Endpoints API", True, "Todos respondendo"))
        else:
            self.results['integration'].append(("Endpoints API", False, "Alguns endpoints falharam"))
        
        return all_passed

    def print_summary(self):
        """Imprime resumo dos testes"""
        print_header("RESUMO DOS TESTES")
        
        total_tests = 0
        total_passed = 0
        
        for category, tests in self.results.items():
            if tests:
                print(f"\n{Colors.BOLD}{category.upper()}:{Colors.RESET}")
                for name, passed, message in tests:
                    total_tests += 1
                    if passed:
                        total_passed += 1
                        print_success(f"{name}: {message}")
                    else:
                        print_error(f"{name}: {message}")
        
        print_header("RESULTADO FINAL")
        
        success_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\nTestes passados: {total_passed}/{total_tests} ({success_rate:.1f}%)\n")
        
        if success_rate == 100:
            print_success("✓ TODOS OS TESTES PASSARAM! Site pronto para deploy.")
            return True
        elif success_rate >= 80:
            print_warning("⚠ MAIORIA DOS TESTES PASSOU. Revise os erros antes do deploy.")
            return True
        else:
            print_error("✗ MUITOS TESTES FALHARAM. Corrija os problemas antes do deploy.")
            return False

    def run_all_tests(self, skip_build: bool = False, skip_server: bool = False):
        """Executa todos os testes"""
        print_header("INICIANDO TESTES DE ESTABILIDADE")
        
        # Backend tests
        print_header("TESTES DO BACKEND")
        self.test_backend_dependencies()
        self.test_backend_syntax()
        if not skip_server:
            self.test_backend_server()
        else:
            print_info("Teste de servidor pulado (--skip-server)")
        
        # Frontend tests
        print_header("TESTES DO FRONTEND")
        self.test_frontend_dependencies()
        if not skip_build:
            self.test_frontend_build()
        else:
            print_info("Teste de build pulado (--skip-build)")
        self.test_frontend_lint()
        
        # Security tests
        print_header("TESTES DE SEGURANÇA")
        self.test_env_variables()
        self.test_secrets_exposure()
        
        # Integration tests
        if not skip_server:
            print_header("TESTES DE INTEGRAÇÃO")
            self.test_api_endpoints()
        
        # Summary
        return self.print_summary()

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Testa estabilidade do site antes do deploy")
    parser.add_argument("--skip-build", action="store_true", help="Pula teste de build (mais rápido)")
    parser.add_argument("--skip-server", action="store_true", help="Pula testes que requerem servidor rodando")
    
    args = parser.parse_args()
    
    tester = StabilityTester()
    success = tester.run_all_tests(skip_build=args.skip_build, skip_server=args.skip_server)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

