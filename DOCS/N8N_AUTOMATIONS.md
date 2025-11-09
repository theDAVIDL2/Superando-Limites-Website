## n8n automations for this website

This project exposes two backend webhooks that you can connect to n8n. Set these environment variables in `backend/.env`:

- `N8N_WEBHOOK_LEAD`: receives lead events from `POST /api/leads`
- `N8N_WEBHOOK_ORDER`: receives order intent events from `POST /api/orders-intent`

Payloads
- Lead: `{ type: "lead", data: { id, email, source, created_at } }`
- Order intent: `{ type: "order_intent", data: { id, price, currency, note, email?, created_at } }`

### Workflow 1: Leads → CRM + Welcome
Steps:
1. Webhook (POST JSON)
   - Test URL atual do seu ambiente: `http://host.docker.internal:5678/webhook-test/80e5fb24-d684-44e8-94a3-0d7349dcafc0`
   - Produção (quando ativar o workflow): troque para `.../webhook/80e5fb24-d684-44e8-94a3-0d7349dcafc0` e atualize `N8N_WEBHOOK_LEAD` no backend
   - O backend lê a URL de `N8N_WEBHOOK_LEAD` no `.env`
2. Set fields: `email = {{$json.data.email}}`, `source = {{$json.data.source}}`
3. Upsert to Google Sheets/Notion/HubSpot
4. Send welcome email (Resend/SendGrid/Brevo)
5. Slack/Telegram notification with one‑click buttons

### Workflow 2: Order intents → Sheet + Checkout link + Reminder
Steps:
1. Webhook (POST JSON) — URL = `N8N_WEBHOOK_ORDER`
2. Append to “Intents” sheet or DB
3. Optionally call Yampi/Stripe to create a checkout link
4. Email/WhatsApp the link to the customer
5. Abandoned‑intent reminder after 2h/24h

### Workflow 3: Analytics & Ops
- Mirror events to PostHog/GA4/Amplitude
- Daily Slack digest: visits, leads, intents, CR%
- Backups to S3/BigQuery

### Workflow 4: Chat insights
- Store conversations; auto‑tag topics/sentiment with OpenAI
- Weekly digest of FAQs to refine site copy

Deployment notes
- Backends forward events without blocking user flow
- Configure `N8N_WEBHOOK_*` env vars and restart backend
- Webhooks should accept `application/json`

Security
- Use n8n webhook secrets or IP allowlists; consider a shared header token

---

### Checklist de Automação (Google Sheets + n8n + Yampi)

- [ ] Criar planilha Google `Pedidos` com colunas chave:
  - `order_id`, `nome`, `email`, `telefone`
  - `end_logradouro`, `end_numero`, `end_complemento`, `bairro`, `cidade`, `estado`, `cep`, `pais`
  - `produto`, `sku`, `quantidade`, `preco`, `frete`, `status_pagamento`
  - `transportadora`, `tracking_code`, `tracking_url`, `tracking_email_enviado`, `rastreamento_enviado_em`
  - `pedido_criado_em`, `pedido_atualizado_em`, `yampi_order_url`, `observacoes`
- [ ] Conectar credenciais do Google Sheets no n8n (OAuth) com acesso à planilha
- [ ] Workflow A — Yampi → Planilha (Upsert por `order_id`)
- [ ] Configurar webhooks na Yampi apontando para o Webhook do n8n (com secret)
- [ ] Workflow B — Planilha atualizada → E-mail de rastreio (quando `tracking_code` for preenchido)
- [ ] Teste ponta a ponta e idempotência (não duplicar e-mail)
- [ ] (Opcional) Workflow C — Monitorar entrega e disparar confirmação

---

### Workflow A — Yampi → Planilha (Template)

Nós e expressões principais:

1) Webhook (POST, Respond Immediately)
- Path: `yampi-orders-<seu-slug>`
- Header secreto recomendado: `x-yampi-secret`

2) (Opcional) IF — Processar apenas se pago
- Ex.: `{{$json.data.order.payment_status}} == "paid"`

3) Set — Mapeamento de campos (mantendo somente os definidos)
- Use expressões como abaixo:
  - `order_id = {{$json.data.order.id}}`
  - `nome = {{$json.data.order.customer.name}}`
  - `email = {{$json.data.order.customer.email}}`
  - `telefone = {{$json.data.order.customer.phone}}`
  - `end_logradouro = {{$json.data.order.shipping.address.street}}`
  - `end_numero = {{$json.data.order.shipping.address.number}}`
  - `end_complemento = {{$json.data.order.shipping.address.complement}}`
  - `bairro = {{$json.data.order.shipping.address.neighborhood}}`
  - `cidade = {{$json.data.order.shipping.address.city}}`
  - `estado = {{$json.data.order.shipping.address.state}}`
  - `cep = {{$json.data.order.shipping.address.zip}}`
  - `pais = {{$json.data.order.shipping.address.country}}`
  - `produto = {{$json.data.order.items[0].title}}`
  - `sku = {{$json.data.order.items[0].sku}}`
  - `quantidade = {{$json.data.order.items[0].quantity}}`
  - `preco = {{$json.data.order.total}}`
  - `frete = {{$json.data.order.shipping.price}}`
  - `status_pagamento = {{$json.data.order.payment_status}}`
  - `yampi_order_url = {{$json.data.order.url}}`
  - `pedido_criado_em = {{$json.data.order.created_at}}`
  - `pedido_atualizado_em = {{$json.data.order.updated_at}}`

4) Google Sheets — Upsert na sheet `Pedidos` por `order_id`
- Documento: ID da planilha (preencher)
- Operação: Upsert (ou Append + Update via lookup)
- Entrada: colunas mapeadas no Set

5) (Opcional) Notificação Slack/Telegram

---

### Workflow B — Planilha atualizada → E-mail de rastreio (Template)

Nós e expressões principais:

1) Google Sheets Trigger — Watch for updates
- Documento: ID da planilha (preencher)
- Sheet: `Pedidos`
- Polling: 1 min

2) IF — Somente quando há rastreio a enviar
- Condições: `tracking_code` não vazio AND `tracking_email_enviado` vazio/falso

3) Set — Montar e-mail e URL de rastreio
- `tracking_url = https://rastreamento.correios.com.br/app/index.php?objeto={{$json.tracking_code}}`
- `assunto = Seu pedido {{$json.order_id}} foi enviado`
- `html` (exemplo):
```html
<p>Olá {{$json.nome}},</p>
<p>Seu pedido {{$json.order_id}} foi enviado.</p>
<p>Rastreamento: <a href="{{$json.tracking_url}}">{{$json.tracking_code}}</a></p>
<p><strong>Endereço de entrega</strong><br>
{{$json.end_logradouro}}, {{$json.end_numero}} {{$json.end_complemento}}<br>
{{$json.bairro}} – {{$json.cidade}}/{{$json.estado}} – {{$json.cep}}</p>
<p>Qualquer dúvida, responda este e‑mail.</p>
```

4) Send Email — Provedor (preencher credenciais)
- To: `{{$json.email}}`
- Subject: `{{$json.assunto}}`
- HTML: `{{$json.html}}`

5) Google Sheets — Update row (idempotência)
- Atualizar a mesma linha: `tracking_email_enviado = TRUE`, `rastreamento_enviado_em = {{$now}}`, `tracking_url`

---

### Templates de Workflows (JSON para importar no n8n)

Observação: estes templates são esqueletos sem credenciais/dados. Após importar, abra cada nó e preencha: credenciais, ID da planilha, sheet, e ajuste as expressões conforme seu payload da Yampi.

#### Workflow A — Yampi → Planilha (template JSON)

```json
{
  "name": "A — Yampi → Planilha (template)",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "yampi-orders-<seu-slug>",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "Webhook_Yampi",
      "name": "Webhook (Yampi)",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [260, 300]
    },
    {
      "parameters": {
        "keepOnlySet": true,
        "values": {
          "string": [
            { "name": "order_id", "value": "={{$json.data.order.id}}" },
            { "name": "nome", "value": "={{$json.data.order.customer.name}}" },
            { "name": "email", "value": "={{$json.data.order.customer.email}}" },
            { "name": "telefone", "value": "={{$json.data.order.customer.phone}}" },
            { "name": "end_logradouro", "value": "={{$json.data.order.shipping.address.street}}" },
            { "name": "end_numero", "value": "={{$json.data.order.shipping.address.number}}" },
            { "name": "end_complemento", "value": "={{$json.data.order.shipping.address.complement}}" },
            { "name": "bairro", "value": "={{$json.data.order.shipping.address.neighborhood}}" },
            { "name": "cidade", "value": "={{$json.data.order.shipping.address.city}}" },
            { "name": "estado", "value": "={{$json.data.order.shipping.address.state}}" },
            { "name": "cep", "value": "={{$json.data.order.shipping.address.zip}}" },
            { "name": "pais", "value": "={{$json.data.order.shipping.address.country}}" },
            { "name": "produto", "value": "={{$json.data.order.items[0].title}}" },
            { "name": "sku", "value": "={{$json.data.order.items[0].sku}}" },
            { "name": "quantidade", "value": "={{$json.data.order.items[0].quantity}}" },
            { "name": "preco", "value": "={{$json.data.order.total}}" },
            { "name": "frete", "value": "={{$json.data.order.shipping.price}}" },
            { "name": "status_pagamento", "value": "={{$json.data.order.payment_status}}" },
            { "name": "yampi_order_url", "value": "={{$json.data.order.url}}" },
            { "name": "pedido_criado_em", "value": "={{$json.data.order.created_at}}" },
            { "name": "pedido_atualizado_em", "value": "={{$json.data.order.updated_at}}" }
          ]
        }
      },
      "id": "Set_MapFields",
      "name": "Set (Mapear campos)",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [560, 300]
    },
    {
      "parameters": {
        "operation": "append"
      },
      "id": "Sheets_Upsert",
      "name": "Google Sheets (Append/Upsert)",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 1,
      "position": [860, 300],
      "credentials": {
        "googleSheetsOAuth2": {
          "id": "",
          "name": "GOOGLE_SHEETS_OAUTH2_PLACEHOLDER"
        }
      }
    }
  ],
  "connections": {
    "Webhook (Yampi)": {
      "main": [
        [
          { "node": "Set (Mapear campos)", "type": "main", "index": 0 }
        ]
      ]
    },
    "Set (Mapear campos)": {
      "main": [
        [
          { "node": "Google Sheets (Append/Upsert)", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "active": false,
  "settings": {}
}
```

---

### Como hospedar o n8n na Hostinger (VPS com Docker + Nginx + SSL)

Pré‑requisitos
- Um VPS na Hostinger (Ubuntu 22.04/24.04) e um domínio/subdomínio, por ex.: `n8n.seudominio.com` apontando (DNS A) para o IP do VPS.

1) Instalar Docker e Compose
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER && newgrp docker
```

2) Preparar diretórios e variáveis
```bash
sudo mkdir -p /opt/n8n && sudo chown -R $USER:$USER /opt/n8n
cd /opt/n8n
openssl rand -base64 48 > .encryption_key # guarde este valor
```

3) Docker Compose para n8n
Crie `docker-compose.yml` em `/opt/n8n` com conteúdo como abaixo (ajuste domínio e timezone):
```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      - N8N_HOST=n8n.seudominio.com
      - WEBHOOK_URL=https://n8n.seudominio.com/
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - TZ=America/Sao_Paulo
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=defina-uma-senha-forte
    env_file:
      - .env
    volumes:
      - ./data:/home/node/.n8n
```

Crie `.env` no mesmo diretório e adicione:
```env
N8N_ENCRYPTION_KEY=<cole-o-conteudo-de-.encryption_key>
```

Suba o serviço:
```bash
docker compose up -d
```

4) Nginx como reverse proxy + SSL
```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/n8n <<'NGINX'
server {
    listen 80;
    server_name n8n.seudominio.com;
    # Habilite HTTPS com certbot abaixo; este bloco permite a emissão do certificado
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off; # importante para SSE
        proxy_pass http://127.0.0.1:5678/;
    }
}
NGINX
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/n8n
sudo nginx -t && sudo systemctl reload nginx
```

Emita SSL com Certbot (automatiza HTTPS e renovações):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d n8n.seudominio.com --redirect --agree-tos -m seu-email@dominio.com
```

5) Pós‑configuração n8n
- Acesse `https://n8n.seudominio.com` e crie a conta inicial.
- Em Settings → Security: confirme que Basic Auth está ativo (ou mantenha por env).
- Em Settings → URL: confira `WEBHOOK_URL`.
- Faça backup periódico de `/opt/n8n/data` (workflows/credenciais).

6) Atualizações
```bash
cd /opt/n8n
docker compose pull
docker compose up -d
```

Notas de produção
- Use um subdomínio dedicado para o n8n, separado do backend e do site.
- Proteja credenciais (Basic Auth + senha forte + SSL + firewall da VPS).
- Em workflows que recebem webhooks externos (Yampi), use um header secreto e valide no primeiro nó.
- Para alto volume, considere banco externo (Postgres) e workers adicionais (consultar docs n8n).

#### Workflow B — Planilha → E-mail de rastreio (template JSON)

```json
{
  "name": "B — Planilha → E-mail de rastreio (template)",
  "nodes": [
    {
      "parameters": {
        "triggerOn": "update"
      },
      "id": "Sheets_Trigger",
      "name": "Google Sheets Trigger",
      "type": "n8n-nodes-base.googleSheetsTrigger",
      "typeVersion": 1,
      "position": [240, 300],
      "credentials": {
        "googleSheetsOAuth2": {
          "id": "",
          "name": "GOOGLE_SHEETS_OAUTH2_PLACEHOLDER"
        }
      }
    },
    {
      "parameters": {
        "conditions": {}
      },
      "id": "If_ShouldSend",
      "name": "IF: tem rastreio e não enviado",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [520, 300]
    },
    {
      "parameters": {
        "keepOnlySet": true,
        "values": {
          "string": [
            { "name": "tracking_url", "value": "=https://rastreamento.correios.com.br/app/index.php?objeto={{$json.tracking_code}}" },
            { "name": "assunto", "value": "=Seu pedido {{$json.order_id}} foi enviado" },
            { "name": "html", "value": "=<p>Olá {{$json.nome}},</p><p>Seu pedido {{$json.order_id}} foi enviado.</p><p>Rastreamento: <a href=\"{{$json.tracking_url}}\">{{$json.tracking_code}}</a></p>" }
          ]
        }
      },
      "id": "Set_Email",
      "name": "Set (Montar e-mail)",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [820, 240]
    },
    {
      "parameters": {
        "fromEmail": "no-reply@seu-dominio.com",
        "toEmail": "={{$json.email}}",
        "subject": "={{$json.assunto}}",
        "text": "",
        "html": "={{$json.html}}"
      },
      "id": "Email_Send",
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [1080, 240]
    },
    {
      "parameters": {
        "operation": "update"
      },
      "id": "Sheets_Update",
      "name": "Google Sheets (Update)",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 1,
      "position": [1320, 240],
      "credentials": {
        "googleSheetsOAuth2": {
          "id": "",
          "name": "GOOGLE_SHEETS_OAUTH2_PLACEHOLDER"
        }
      }
    }
  ],
  "connections": {
    "Google Sheets Trigger": {
      "main": [
        [
          { "node": "IF: tem rastreio e não enviado", "type": "main", "index": 0 }
        ]
      ]
    },
    "IF: tem rastreio e não enviado": {
      "main": [
        [
          { "node": "Set (Montar e-mail)", "type": "main", "index": 0 }
        ],
        []
      ]
    },
    "Set (Montar e-mail)": {
      "main": [
        [
          { "node": "Send Email", "type": "main", "index": 0 }
        ]
      ]
    },
    "Send Email": {
      "main": [
        [
          { "node": "Google Sheets (Update)", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "active": false,
  "settings": {}
}
```