# Guia de Testes de Estabilidade

Este guia explica como usar os scripts de teste de estabilidade criados para garantir que o site está funcionando corretamente antes de fazer deploy.

## 📋 Scripts Disponíveis

### 1. `test_stability.py` / `test_stability.bat`
**Objetivo:** Testar todos os componentes do site (backend, frontend, segurança, integrações)

**Uso:**
```bash
# Windows
scripts\test_stability.bat

# Linux/Mac
python scripts/test_stability.py
```

**Opções:**
- `--skip-build`: Pula o teste de build (mais rápido, útil para testes rápidos)
- `--skip-server`: Pula testes que requerem servidor rodando

**Exemplos:**
```bash
# Teste rápido (sem build)
scripts\test_stability.bat --skip-build

# Teste sem servidor (útil quando servidor não está rodando)
scripts\test_stability.bat --skip-server

# Teste completo
scripts\test_stability.bat
```

### 2. `pre_deploy_check.py` / `pre_deploy_check.bat`
**Objetivo:** Verificação completa antes de fazer deploy em produção

**Uso:**
```bash
# Windows
scripts\pre_deploy_check.bat

# Linux/Mac
python scripts/pre_deploy_check.py
```

**O que verifica:**
1. ✅ Status do Git (commits pendentes)
2. ✅ Branch correta (main/master)
3. ✅ Configurações de produção
4. ✅ Testes de estabilidade
5. ✅ Build de produção
6. ✅ Gera relatório de deploy

## 🧪 Testes Realizados

### Backend
- ✅ Dependências instaladas (requirements.txt)
- ✅ Sintaxe Python válida
- ✅ Servidor respondendo (se rodando)
- ✅ Endpoints da API

### Frontend
- ✅ Dependências instaladas (node_modules)
- ✅ Build funciona sem erros
- ✅ Linting passa (se configurado)

### Segurança
- ✅ Variáveis de ambiente configuradas
- ✅ Secrets não expostos no código
- ✅ Configurações de produção corretas

### Integração
- ✅ Endpoints da API respondem
- ✅ CORS configurado corretamente

## 🚀 Workflow Recomendado

### Durante Desenvolvimento
Execute testes rápidos frequentemente:
```bash
# Teste rápido sem build
scripts\test_stability.bat --skip-build --skip-server
```

### Antes de Commit
Execute testes completos:
```bash
scripts\test_stability.bat --skip-server
```

### Antes de Deploy
Execute verificação completa de pré-deploy:
```bash
scripts\pre_deploy_check.bat
```

Isso irá:
1. Verificar seu Git status
2. Executar todos os testes
3. Criar o build de produção
4. Gerar relatório (`DEPLOY_REPORT.txt`)

## 📊 Interpretando Resultados

### Símbolos
- ✓ (verde): Teste passou
- ✗ (vermelho): Teste falhou
- ⚠ (amarelo): Aviso (não crítico)
- ℹ (azul): Informação

### Taxa de Sucesso
- **100%**: Site pronto para deploy ✅
- **80-99%**: Maioria dos testes passou, revise erros ⚠️
- **<80%**: Muitos problemas, corrija antes de deploy ❌

## 🔧 Troubleshooting

### "Dependências faltando"
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### "Erros de sintaxe Python"
Revise os arquivos `.py` indicados no erro.

### "Build falhou"
1. Verifique erros no console
2. Certifique-se de que `node_modules` está instalado
3. Verifique variáveis de ambiente no `.env`

### "Servidor não responde"
Os testes de servidor são opcionais. Use `--skip-server` se o servidor não estiver rodando:
```bash
scripts\test_stability.bat --skip-server
```

### "Secrets expostos"
Revise o relatório do `check_secrets.py` e remova qualquer API key ou senha do código.

## 📝 Exemplos de Output

### Teste Completo com Sucesso
```
========================================
        TESTE DE ESTABILIDADE
========================================

✓ Dependências do Backend: Todas instaladas
✓ Sintaxe Python: 3 arquivos OK
✓ Dependências do Frontend: Instaladas
✓ Build do Frontend: Build criado com sucesso
✓ Variáveis de Ambiente: Configuradas
✓ Exposição de Secrets: Nenhum secret exposto

RESULTADO FINAL
Testes passados: 6/6 (100.0%)
✓ TODOS OS TESTES PASSARAM! Site pronto para deploy.
```

### Teste com Problemas
```
========================================
        TESTE DE ESTABILIDADE
========================================

✗ Dependências do Backend: Pacotes faltando: flask, flask-cors
✓ Sintaxe Python: 3 arquivos OK
⚠ Servidor Backend: Servidor não está rodando
✓ Dependências do Frontend: Instaladas

RESULTADO FINAL
Testes passados: 2/4 (50.0%)
✗ MUITOS TESTES FALHARAM. Corrija os problemas antes do deploy.
```

## 🔄 Integração com CI/CD

Você pode integrar esses scripts em um pipeline de CI/CD:

```yaml
# Exemplo para GitHub Actions
- name: Run stability tests
  run: python scripts/test_stability.py --skip-server

- name: Pre-deploy check
  run: python scripts/pre_deploy_check.py
```

## 💡 Dicas

1. **Execute testes antes de cada commit importante**
2. **Sempre execute pré-deploy antes de subir para produção**
3. **Mantenha um histórico dos relatórios de deploy**
4. **Configure alertas se testes falharem**
5. **Revise warnings mesmo quando testes passam**

## 📚 Arquivos Relacionados

- `scripts/test_stability.py`: Script principal de testes
- `scripts/pre_deploy_check.py`: Verificação pré-deploy
- `scripts/check_secrets.py`: Verificação de secrets
- `backend/requirements.txt`: Dependências Python
- `frontend/package.json`: Dependências Node.js

## 🆘 Suporte

Se encontrar problemas:
1. Leia a mensagem de erro completa
2. Verifique a seção de Troubleshooting
3. Execute com `--skip-build --skip-server` para testes mais rápidos
4. Revise o `DEPLOY_REPORT.txt` gerado

