# 📚 Guia dos Scripts de Teste

## 🎯 Scripts Criados

Foram criados **4 scripts** para ajudar você a manter a estabilidade do site:

### 1. `test_stability.py` (Principal)
Script Python completo que testa todos os aspectos do site.

**Uso direto:**
```bash
python scripts/test_stability.py [opções]
```

**Opções:**
- `--skip-build` - Pula criação de build (mais rápido)
- `--skip-server` - Pula testes que precisam do servidor rodando

### 2. `test_stability.bat` (Windows)
Wrapper para Windows que facilita a execução.

**Uso:**
```bash
scripts\test_stability.bat [opções]
```

### 3. `pre_deploy_check.py` (Pré-Deploy)
Script completo de verificação antes de fazer deploy.

**Uso direto:**
```bash
python scripts/pre_deploy_check.py
```

### 4. `pre_deploy_check.bat` (Windows)
Wrapper Windows para verificação pré-deploy.

**Uso:**
```bash
scripts\pre_deploy_check.bat
```

## 📋 Categorias de Testes

### 🔧 Backend
- ✅ Dependências instaladas (`requirements.txt`)
- ✅ Sintaxe Python válida
- ✅ Servidor respondendo (opcional)
- ✅ Endpoints da API funcionando

### 🎨 Frontend
- ✅ Dependências instaladas (`node_modules`)
- ✅ Build funciona sem erros
- ✅ Linting (se configurado)

### 🔒 Segurança
- ✅ Variáveis de ambiente configuradas
- ✅ Sem secrets expostos no código
- ✅ Configurações de produção corretas

### 🔗 Integração
- ✅ APIs respondendo
- ✅ CORS configurado

## 🚀 Exemplos Práticos

### Cenário 1: Teste Rápido Durante Desenvolvimento
Você está codificando e quer verificar rapidamente se não quebrou nada:

```bash
scripts\test_stability.bat --skip-build --skip-server
```

⏱️ **Tempo:** ~10 segundos

### Cenário 2: Antes de Fazer Commit
Você terminou uma feature e quer ter certeza que está tudo OK:

```bash
scripts\test_stability.bat --skip-server
```

⏱️ **Tempo:** ~30 segundos

### Cenário 3: Teste Completo
Você quer testar absolutamente tudo, incluindo build e servidor:

```bash
# Primeiro, inicie o servidor em outro terminal
cd backend
python server.py

# Depois, em outro terminal
scripts\test_stability.bat
```

⏱️ **Tempo:** ~3-5 minutos

### Cenário 4: Antes de Deploy em Produção
Você vai fazer deploy e quer garantir que está tudo perfeito:

```bash
scripts\pre_deploy_check.bat
```

⏱️ **Tempo:** ~5 minutos

Isso vai:
1. Verificar Git status
2. Confirmar branch correta
3. Validar configurações de produção
4. Executar todos os testes
5. Criar build final
6. Gerar relatório `DEPLOY_REPORT.txt`

## 📊 Interpretando Resultados

### ✅ Sucesso (100%)
```
Testes passados: 6/6 (100.0%)
✓ TODOS OS TESTES PASSARAM! Site pronto para deploy.
```
👍 **Ação:** Pode fazer deploy com confiança!

### ⚠️ Parcial (80-99%)
```
Testes passados: 5/6 (83.3%)
⚠ MAIORIA DOS TESTES PASSOU. Revise os erros antes do deploy.
```
🔍 **Ação:** Revise os avisos, mas provavelmente é seguro continuar.

### ❌ Falha (<80%)
```
Testes passados: 2/6 (33.3%)
✗ MUITOS TESTES FALHARAM. Corrija os problemas antes do deploy.
```
🛑 **Ação:** Corrija os erros antes de fazer deploy!

## 🔧 Solucionando Problemas Detectados

### Erro: "Pacotes faltando: X"

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### Erro: "Variáveis faltando: X"

Edite `frontend/.env`:
```env
REACT_APP_OPENROUTER_API_KEY=sua_chave
REACT_APP_OPENROUTER_API_KEYS=["chave1","chave2"]
REACT_APP_N8N_WEBHOOK_URL=https://seu-webhook
```

### Erro: "Erros de sintaxe Python"

O script mostra qual arquivo tem erro. Abra e corrija.

### Erro: "Build falhou"

1. Verifique se há erros de import
2. Verifique variáveis de ambiente
3. Execute: `cd frontend && npm install`

### Warning: "Script de lint não configurado"

Isso é apenas um aviso. Para configurar lint:

1. Adicione em `frontend/package.json`:
```json
{
  "scripts": {
    "lint": "eslint src/"
  }
}
```

2. Instale ESLint:
```bash
cd frontend
npm install --save-dev eslint
```

### Erro: "Possíveis secrets expostos"

Execute o check detalhado:
```bash
python scripts/check_secrets.py
```

Remova qualquer API key ou senha do código.

## 📁 Arquivos Gerados

### `DEPLOY_REPORT.txt`
Relatório detalhado do último check de pré-deploy:
- Data/hora do teste
- Branch e commit Git
- Status de todos os testes
- Próximos passos recomendados

**Localização:** Raiz do projeto

### `frontend/build/`
Build de produção pronto para upload:
- HTML, CSS, JS minificados
- Imagens otimizadas
- Todos os assets

**Localização:** `frontend/build/`

## 🔄 Integração com Workflow

### Git Hooks (Opcional)

Você pode adicionar um hook para rodar testes antes de commit:

Crie `.git/hooks/pre-commit`:
```bash
#!/bin/sh
python scripts/test_stability.py --skip-build --skip-server
```

### CI/CD (Opcional)

Para GitHub Actions, adicione em `.github/workflows/test.yml`:
```yaml
name: Stability Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
      - name: Install dependencies
        run: |
          cd backend && pip install -r requirements.txt
          cd ../frontend && npm install
      - name: Run stability tests
        run: python scripts/test_stability.py --skip-server
```

## 💡 Dicas e Melhores Práticas

1. **Execute testes frequentemente**
   - Durante dev: teste rápido (`--skip-build --skip-server`)
   - Antes de commit: teste médio (`--skip-server`)
   - Antes de deploy: teste completo

2. **Mantenha dependências atualizadas**
   - Backend: `pip list --outdated`
   - Frontend: `npm outdated`

3. **Revise warnings**
   - Nem todo warning é crítico, mas todos merecem atenção

4. **Guarde relatórios de deploy**
   - Mantenha histórico dos `DEPLOY_REPORT.txt`
   - Adicione à tag Git: `git tag -a v1.0 -m "Deploy report attached"`

5. **Automatize quando possível**
   - Use Git hooks
   - Configure CI/CD
   - Agende testes noturnos

## 📖 Documentação Adicional

- `STABILITY_TESTING.md` - Guia completo e detalhado
- `QUICK_START_TESTING.md` - Início rápido em 30 segundos
- `scripts/check_secrets.py` - Verificação de segurança

## 🆘 Precisa de Ajuda?

1. Leia as mensagens de erro completas
2. Consulte a seção "Solucionando Problemas"
3. Revise os arquivos de documentação
4. Execute com `--skip-build --skip-server` para debug mais rápido

## 📝 Changelog

### v1.0.0 (2025-10-21)
- ✅ Script principal de testes (`test_stability.py`)
- ✅ Script de pré-deploy (`pre_deploy_check.py`)
- ✅ Wrappers para Windows (`.bat`)
- ✅ Suporte completo UTF-8 para Windows
- ✅ Testes de backend, frontend, segurança e integração
- ✅ Geração de relatórios de deploy
- ✅ Documentação completa

