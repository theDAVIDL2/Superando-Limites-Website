## Backend + n8n — Guia de Inicialização e Integração de Leads

Este guia explica como iniciar o backend localmente, configurar o arquivo `.env`, integrar o Webhook de leads no n8n e testar o fluxo ponta‑a‑ponta.

### Pré‑requisitos
- Python 3.10+ instalado
- Windows PowerShell (ou terminal equivalente)
- n8n acessível (local ou em servidor)

### 1) Iniciar o backend (Windows)
1. Abra o PowerShell na raiz do projeto e entre na pasta do backend:
```powershell
cd "C:\path\to\your\Website\backend"
```
2. Crie e ative um ambiente virtual:
```powershell
python -m venv .venv
 .\.venv\Scripts\Activate.ps1
```
3. Instale as dependências:
```powershell
pip install -r requirements.txt
```
4. Crie o arquivo `backend/.env` (veja a seção “Variáveis de ambiente” abaixo para detalhes) e então rode o servidor:
```powershell
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```
5. A API ficará disponível em `http://localhost:8000/api`.

#### Teste rápido do endpoint de lead
Com o servidor rodando, execute:
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/leads `
  -ContentType 'application/json' `
  -Body '{"email":"teste@example.com","source":"landing_form"}'
```

Se tudo estiver correto, você receberá HTTP 201 com o JSON do lead.

### 2) Passos no n8n (Webhook de Leads)
1. Crie um novo Workflow no n8n.
2. Adicione um nó “Webhook”. Configure:
   - HTTP Method: `POST`
   - Path: um slug aleatório, ex.: `lead-intent-<seu-slug>`
   - Respond: `Immediately`
   - Authentication: `None` (para teste). Em produção, considere ativar autenticação.
3. Clique em “Listen for test event” para capturar eventos usando a URL de teste, ou copie a URL de Produção para uso fixo.
4. Copie a URL do Webhook:
   - Test: `.../webhook-test/lead-intent-<seu-slug>`
   - Production: `.../webhook/lead-intent-<seu-slug>`
5. Cole essa URL na variável `N8N_WEBHOOK_LEAD` do `backend/.env` (veja abaixo) e reinicie o backend.

#### Mapeando os dados recebidos
O backend envia para o n8n um POST com JSON no formato:
```json
{ "type": "lead", "data": { "id": "...", "email": "...", "source": "landing_form", "created_at": "..." } }
```
No seu workflow, após o Webhook, use um nó “Set” (ou Function) para mapear:
- `email = {{$json.data.email}}`
- `source = {{$json.data.source}}`
- `created_at = {{$json.data.created_at}}`

A partir daí, conecte Google Sheets/Notion/CRM e dispare e‑mail/Slack/WhatsApp conforme desejar.

### 3) Variáveis de ambiente do backend (`backend/.env`)
Você pode operar em modo de teste (sem MongoDB) ou produção (com MongoDB). Exemplos:

#### Modo de teste (sem MongoDB)
```env
TESTING=true
DB_NAME=website

# Webhook do n8n que receberá os leads
# Ambiente atual (fixado por você): Test URL do n8n
N8N_WEBHOOK_LEAD=http://host.docker.internal:5678/webhook-test/80e5fb24-d684-44e8-94a3-0d7349dcafc0

# (Opcional) Webhook para intenções de compra, caso queira registrar também
# N8N_WEBHOOK_ORDER=https://SEU-N8N/webhook/order-intent-<seu-slug>
```
Explicação:
- `TESTING=true`: o backend usa um MongoDB em memória (mongomock). Não requer `MONGO_URL`.
- `DB_NAME`: nome lógico do banco em memória.
- `N8N_WEBHOOK_LEAD`: URL do Webhook do n8n que receberá o evento de lead. No seu ambiente atual está configurada para a Test URL acima. Lembre que, para ela funcionar, o nó Webhook precisa estar com “Listen for test event” ativo. Quando quiser tornar permanente, ative o workflow e troque para a Production URL (`/webhook/...`).
- `N8N_WEBHOOK_ORDER`: URL (opcional) para eventos de intenção de compra.

#### Modo de produção (com MongoDB real)
```env
MONGO_URL=mongodb://usuario:senha@host:27017
DB_NAME=website

N8N_WEBHOOK_LEAD=https://SEU-N8N/webhook/lead-intent-<seu-slug>
# N8N_WEBHOOK_ORDER=https://SEU-N8N/webhook/order-intent-<seu-slug>
```
Explicação adicional:
- `MONGO_URL`: string de conexão do seu MongoDB (Atlas ou self‑hosted).
- `DB_NAME`: nome do banco no Mongo.

### 4) Teste ponta‑a‑ponta com o n8n
1. Se usar a URL de teste do Webhook, clique em “Listen for test event”.
2. Envie um lead a partir do frontend (formulário de e‑mail) ou via comando de teste do passo 1.
3. Verifique se o nó Webhook do n8n recebeu o payload e se os nós seguintes executaram.

### 5) Boas práticas de segurança
- Prefira a URL de Produção do Webhook em ambiente real.
- Use um path longo e aleatório como slug (`lead-intent-<seu-slug>`).
- Ative autenticação no nó Webhook do n8n quando possível.
- Publique o n8n em HTTPS.

### 6) Solução de problemas comuns
- PowerShell bloqueou o venv:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
- Porta 8000 ocupada: troque `--port` no comando do uvicorn.
- n8n não recebe: confirme a URL certa (Test vs Production), se o backend consegue alcançar o host/porta do n8n e se o workflow está ativo/ouvindo.

### 7) Endpoints relevantes
- `POST /api/leads` — cadastra lead e encaminha ao n8n (`N8N_WEBHOOK_LEAD`).
- `POST /api/orders-intent` — registra intenção de compra e encaminha ao n8n (`N8N_WEBHOOK_ORDER`).


