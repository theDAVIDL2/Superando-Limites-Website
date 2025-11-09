# 🚀 Início Rápido - Testes de Estabilidade

## 📋 Como usar em 30 segundos

### Teste Rápido (Durante Desenvolvimento)
```bash
# Windows
scripts\test_stability.bat --skip-build --skip-server

# Tempo: ~10 segundos
```

### Teste Completo (Antes de Deploy)
```bash
# Windows
scripts\pre_deploy_check.bat

# Tempo: ~2-5 minutos (cria build completo)
```

## 🎯 Comandos Principais

| Comando | Quando Usar | Tempo |
|---------|-------------|-------|
| `test_stability.bat --skip-build --skip-server` | Teste rápido durante dev | ~10s |
| `test_stability.bat --skip-server` | Teste sem build mas verifica tudo | ~30s |
| `test_stability.bat` | Teste completo com build | ~3min |
| `pre_deploy_check.bat` | Antes de fazer deploy | ~5min |

## ✅ O que cada script faz?

### `test_stability.bat`
- ✓ Verifica dependências (Python + Node)
- ✓ Testa sintaxe do código
- ✓ Verifica configurações
- ✓ Testa segurança (secrets expostos)
- ✓ (Opcional) Cria build de teste
- ✓ (Opcional) Testa servidor rodando

### `pre_deploy_check.bat`
- ✓ Tudo que `test_stability.bat` faz
- ✓ Verifica Git (commits, branch)
- ✓ Valida configurações de produção
- ✓ Cria build final para deploy
- ✓ Gera relatório `DEPLOY_REPORT.txt`

## 📊 Exemplo de Output

```
============================================================
              INICIANDO TESTES DE ESTABILIDADE              
============================================================

TESTES DO BACKEND
ℹ Testando dependências do backend...
✓ Todas as dependências do backend estão instaladas
✓ Sintaxe de 1 arquivos verificada

TESTES DO FRONTEND
✓ Dependências do frontend verificadas

TESTES DE SEGURANÇA
✓ Variáveis de ambiente críticas configuradas
✓ Nenhum secret exposto detectado

RESULTADO FINAL
Testes passados: 4/4 (100.0%)
✓ TODOS OS TESTES PASSARAM! Site pronto para deploy.
```

## 🔧 Resolvendo Problemas Comuns

### ❌ "Pacotes faltando: X"

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

### ❌ "Variáveis faltando: X"

Edite `frontend/.env` e adicione as variáveis necessárias:
```env
REACT_APP_OPENROUTER_API_KEY=sua_chave_aqui
REACT_APP_N8N_WEBHOOK_URL=https://seu-webhook.com
```

### ❌ "Build falhou"

1. Verifique se `node_modules` existe
2. Execute `npm install` no frontend
3. Verifique erros no console

### ⚠️ "Servidor não responde"

Normal se você não está rodando o servidor. Use:
```bash
scripts\test_stability.bat --skip-server
```

## 💡 Workflow Recomendado

```
1. Fazendo mudanças no código
   └─> Teste rápido: test_stability.bat --skip-build --skip-server
   
2. Antes de fazer commit
   └─> Teste médio: test_stability.bat --skip-server
   
3. Antes de fazer deploy
   └─> Teste completo: pre_deploy_check.bat
   └─> Revise DEPLOY_REPORT.txt
   └─> Upload de frontend/build/ para servidor
```

## 📁 Arquivos Gerados

- `DEPLOY_REPORT.txt` - Relatório do último pre-deploy check
- `frontend/build/` - Build de produção pronto para upload

## 🆘 Ajuda

Para mais detalhes, veja `STABILITY_TESTING.md`

