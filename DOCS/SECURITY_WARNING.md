# ⚠️ AVISO DE SEGURANÇA IMPORTANTE

## 🔐 Suas API Keys Foram Expostas

Detectamos que suas chaves de API da OpenRouter foram compartilhadas em texto plano. Isso é um **risco de segurança**.

### ⚠️ Previous Exposure Warning:
```
[API KEYS REMOVED FOR SECURITY]
If you previously had API keys exposed, revoke them immediately at:
https://openrouter.ai/keys
```

---

## ⚡ Ação Imediata Necessária

### 1. Revogue as Chaves Antigas

1. Acesse https://openrouter.ai/keys
2. Encontre essas duas chaves
3. Clique em "Revoke" ou "Delete"
4. Elas não poderão mais ser usadas

### 2. Gere Novas Chaves

1. No mesmo painel, clique em "Create New Key"
2. Gere 2 novas chaves
3. Copie-as para um local seguro (gerenciador de senhas)

### 3. Atualize o .env

```env
REACT_APP_OPENROUTER_API_KEY=["sk-or-v1-NOVA_CHAVE_1","sk-or-v1-NOVA_CHAVE_2"]
```

---

## 🛡️ Melhores Práticas de Segurança

### ✅ O Que Fazer:

1. **Sempre use .env para secrets:**
   ```env
   REACT_APP_OPENROUTER_API_KEY=["chave1","chave2"]
   ```

2. **Nunca commite .env no Git:**
   - `.env` deve estar no `.gitignore` ✅ (já configurado)
   - Apenas `.env.example` vai pro Git

3. **Use variáveis de ambiente no servidor:**
   - Hostinger: Configure no painel
   - Vercel: Settings → Environment Variables
   - Railway: Settings → Variables

4. **Rotacione chaves regularmente:**
   - A cada 3-6 meses
   - Imediatamente se houver exposição

### ❌ O Que NÃO Fazer:

1. ❌ Nunca coloque chaves diretamente no código
2. ❌ Nunca compartilhe chaves em chat, email, etc
3. ❌ Nunca commite chaves no Git
4. ❌ Nunca reutilize chaves entre projetos

---

## 📝 Checklist de Segurança

- [ ] Revoguei as chaves antigas expostas
- [ ] Gerei novas chaves no OpenRouter
- [ ] Atualizei `.env` com as novas chaves
- [ ] Verifiquei que `.env` está no `.gitignore`
- [ ] Nunca mais vou compartilhar chaves em texto plano
- [ ] Vou usar gerenciador de senhas para guardar chaves

---

## 🔄 Verificar se .env está Protegido

Execute este comando para garantir que `.env` não será commitado:

```bash
git status
```

Se `.env` aparecer, adicione ao `.gitignore`:

```bash
echo ".env" >> frontend/.gitignore
```

---

## 💰 Monitore Uso das Chaves

1. Acesse https://openrouter.ai/activity
2. Monitore gastos e uso
3. Configure limites de gasto se disponível
4. Configure alertas de uso anormal

---

## 🆘 Se Detectar Uso Não Autorizado

1. **Revogue a chave imediatamente**
2. **Gere nova chave**
3. **Contate suporte da OpenRouter**
4. **Revise logs de acesso**

---

## ✅ Configuração Segura Final

### Desenvolvimento (.env):
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_OPENROUTER_API_KEY=["NOVA_CHAVE_1","NOVA_CHAVE_2"]
REACT_APP_OPENROUTER_MODEL=openai/gpt-oss-20b:free
REACT_APP_N8N_WEBHOOK_URL=
```

### Produção (Painel Hostinger):
Configure as mesmas variáveis no painel de controle do Hostinger, **nunca** no código.

---

## 📚 Recursos Adicionais

- [OpenRouter Security Best Practices](https://openrouter.ai/docs/security)
- [Git Secrets Prevention](https://git-secret.io/)
- [Environment Variables Guide](https://12factor.net/config)

---

**⚠️ LEMBRE-SE: Chaves de API são como senhas. Nunca compartilhe em público!**

