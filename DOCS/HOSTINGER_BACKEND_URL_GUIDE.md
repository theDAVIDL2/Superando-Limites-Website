# 🌐 Como Obter a URL do Backend no Hostinger

## 📋 Opções para Backend no Hostinger

O Hostinger oferece diferentes maneiras de hospedar seu backend Python. Aqui estão as opções:

---

## Opção 1: VPS Hostinger (Recomendado para Backend Python)

### Como Funciona
- Você tem um servidor virtual completo
- Pode rodar Python, FastAPI, Flask, etc.
- Controle total sobre o ambiente

### Como Obter a URL

1. **Acesse o painel VPS no Hostinger:**
   - Login em https://hpanel.hostinger.com
   - Vá em "VPS" no menu lateral
   - Selecione seu VPS

2. **Encontre o IP do servidor:**
   - Na página do VPS, você verá o **IP Address**
   - Exemplo: `123.45.67.89`

3. **Sua URL do backend será:**
   ```
   http://123.45.67.89:8000
   ```
   (Se você configurou SSL, use `https://`)

4. **Configure um domínio (Opcional mas Recomendado):**
   - Crie um subdomínio: `api.superandolimites.com.br`
   - Aponte para o IP do VPS
   - Configure SSL com Let's Encrypt
   - URL final: `https://api.superandolimites.com.br`

### Configuração Necessária

**No VPS, você precisa:**

1. Instalar Python e dependências:
```bash
sudo apt update
sudo apt install python3 python3-pip
pip3 install -r requirements.txt
```

2. Rodar o backend em modo produção:
```bash
# Com uvicorn (recomendado para FastAPI)
uvicorn backend.server:app --host 0.0.0.0 --port 8000

# Ou com processo em background
nohup uvicorn backend.server:app --host 0.0.0.0 --port 8000 &
```

3. Configurar firewall para permitir porta 8000:
```bash
sudo ufw allow 8000/tcp
```

---

## Opção 2: Hostinger Cloud com Docker (Avançado)

Se você tem Cloud Hosting, pode usar Docker:

1. **Criar um Dockerfile** para seu backend
2. **Deploy via Docker**
3. URL será: `https://seu-app.cloud.hostinger.com`

---

## Opção 3: Backend Serverless (Alternativa)

Se você não quer gerenciar servidor, considere:

### Railway.app (Grátis para começar)
1. Crie conta em https://railway.app
2. Faça deploy do backend
3. URL automática: `https://seu-backend-production.up.railway.app`

### Render.com (Grátis para começar)
1. Crie conta em https://render.com
2. Faça deploy do backend
3. URL automática: `https://seu-backend.onrender.com`

### Vercel (Para APIs simples)
1. Deploy via Vercel
2. URL: `https://seu-backend.vercel.app/api`

---

## 🎯 Configuração Recomendada para Produção

### Setup Ideal

```
Frontend (Hostinger Web Hosting)
└─> URL: https://superandolimites.com.br

Backend (Hostinger VPS ou Railway)
└─> URL: https://api.superandolimites.com.br
```

### Passos:

1. **Frontend no Hostinger Web Hosting:**
   - Upload do `frontend/build/` via File Manager ou FTP
   - URL: `https://superandolimites.com.br`

2. **Backend no VPS ou Railway:**
   - VPS: `http://IP_DO_VPS:8000`
   - Railway: `https://seu-backend.up.railway.app`

3. **Atualizar .env de Produção:**
   ```env
   REACT_APP_BACKEND_URL=https://api.superandolimites.com.br
   # OU
   REACT_APP_BACKEND_URL=https://seu-backend.up.railway.app
   ```

4. **Rebuild do Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

5. **Upload do novo build**

---

## 🔧 Como Configurar no Hostinger

### Se você escolher VPS Hostinger:

#### 1. Conecte via SSH
```bash
ssh root@SEU_IP_VPS
```

#### 2. Clone o repositório
```bash
git clone SEU_REPOSITORIO
cd Website/backend
```

#### 3. Instale dependências
```bash
pip3 install -r requirements.txt
```

#### 4. Crie arquivo .env no backend
```bash
nano .env
```

Adicione variáveis necessárias:
```env
# Variáveis do backend se necessário
DATABASE_URL=...
SECRET_KEY=...
```

#### 5. Rode o servidor
```bash
# Teste primeiro
uvicorn server:app --host 0.0.0.0 --port 8000

# Se funcionar, rode em background
nohup uvicorn server:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
```

#### 6. Configure domínio (Opcional)

No painel Hostinger:
1. Vá em "Domains"
2. Clique em "DNS / Name Servers"
3. Adicione registro A:
   - Type: A
   - Name: api
   - Points to: IP_DO_VPS
   - TTL: 3600

Agora você terá: `api.superandolimites.com.br` → seu VPS

#### 7. Configure SSL (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.superandolimites.com.br
```

---

## 📝 Atualizar .env do Frontend

### Para Desenvolvimento:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Para Produção (VPS):
```env
REACT_APP_BACKEND_URL=https://api.superandolimites.com.br
```

### Para Produção (Railway/Render):
```env
REACT_APP_BACKEND_URL=https://seu-backend.up.railway.app
```

---

## ⚡ Deploy Rápido - Railway (Recomendado se não quer gerenciar VPS)

### Passo a Passo:

1. **Crie conta no Railway:**
   - https://railway.app
   - Login com GitHub

2. **Novo Projeto:**
   - "New Project" → "Deploy from GitHub repo"
   - Selecione seu repositório
   - Selecione a pasta `backend`

3. **Configure variáveis de ambiente:**
   - Settings → Variables
   - Adicione as variáveis necessárias

4. **Deploy automático:**
   - Railway detecta Python
   - Instala requirements.txt
   - Inicia o servidor

5. **Copie a URL:**
   - Settings → Domains
   - Copie a URL: `https://seu-backend-production.up.railway.app`

6. **Use essa URL no frontend:**
   ```env
   REACT_APP_BACKEND_URL=https://seu-backend-production.up.railway.app
   ```

---

## 🔍 Verificar se Backend está Funcionando

### Teste Local:
```bash
curl http://localhost:8000/health
# OU
curl http://localhost:8000/api/
```

### Teste Produção:
```bash
curl https://api.superandolimites.com.br/health
# OU
curl https://seu-backend.up.railway.app/health
```

Deve retornar algo como:
```json
{"status": "ok"}
```

---

## ✅ Checklist Final

- [ ] Backend rodando e acessível
- [ ] URL do backend anotada
- [ ] `.env` do frontend atualizado com URL correta
- [ ] Frontend rebuilded: `npm run build`
- [ ] Novo build testado localmente
- [ ] CORS configurado no backend para permitir domínio do frontend
- [ ] SSL configurado (HTTPS)
- [ ] Deploy feito e testado

---

## 🆘 Problemas Comuns

### CORS Error
**Problema:** Frontend não consegue acessar backend

**Solução:** No backend, configure CORS:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://superandolimites.com.br",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Backend não responde
**Verifique:**
1. Firewall: `sudo ufw status`
2. Processo rodando: `ps aux | grep uvicorn`
3. Logs: `tail -f backend.log`

### SSL não funciona
**Use certbot:**
```bash
sudo certbot --nginx -d api.superandolimites.com.br
```

---

## 💡 Recomendação Final

Para sua aplicação, recomendo:

**Opção 1 (Mais Simples):**
- Frontend: Hostinger Web Hosting
- Backend: Railway.app (grátis para começar)
- Custo: ~R$ 0-30/mês

**Opção 2 (Mais Controle):**
- Frontend: Hostinger Web Hosting
- Backend: Hostinger VPS
- Custo: ~R$ 50-100/mês

---

## 📞 Próximos Passos

1. Decida onde hospedar o backend (VPS ou Railway)
2. Configure e faça deploy do backend
3. Anote a URL do backend
4. Atualize `.env` do frontend
5. Rebuild e deploy do frontend
6. Teste tudo funcionando

**Precisa de ajuda com alguma dessas etapas? É só avisar!**

