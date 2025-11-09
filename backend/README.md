# Backend API - Superando Limites

Node.js backend with Fastify, Supabase, and OpenRouter integration.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# OpenRouter (AI Chat)
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# Security
ADMIN_API_KEY=your_admin_key_for_protected_endpoints

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://silviosuperandolimites.com.br

# Checkout (Optional)
CHECKOUT_PUBLIC_URL=https://checkout.example.com
CHECKOUT_PROVIDER=yampi

# Server
PORT=8000
```

### Run Locally

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

Server will start at `http://localhost:8000`

## 📋 API Endpoints

### Health Check
- `GET /api/` - Server status

### Leads
- `POST /api/leads` - Create lead
- `GET /api/leads` - List leads (requires admin key)

### Order Intents
- `POST /api/orders-intent` - Create order intent
- `GET /api/orders-intent` - List orders (requires admin key)

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - List subscriptions (requires admin key)

### Checkout
- `GET /api/checkout/config` - Get checkout configuration
- `POST /api/checkout/start` - Start checkout process

### AI Chat
- `POST /api/chat/complete` - Stream AI chat completion (OpenRouter proxy)

## 🔐 Authentication

Protected endpoints require `x-admin-key` header:

```bash
curl -H "x-admin-key: your_admin_key" http://localhost:8000/api/leads
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:8000/api/

# Create lead
curl -X POST http://localhost:8000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "source": "website"}'

# AI Chat
curl -X POST http://localhost:8000/api/chat/complete \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Olá!"}], "stream": true}'
```

## 🚢 Deployment

### Railway

1. Connect GitHub repository
2. Railway auto-detects Node.js from `package.json`
3. Set environment variables in Railway dashboard
4. Deploy!

### Environment Variables (Railway)

Set these in Railway dashboard:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `OPENROUTER_API_KEY`
- `ADMIN_API_KEY`
- `ALLOWED_ORIGINS`

Railway automatically sets `PORT`.

## 📦 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Fastify (fast & lightweight)
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenRouter (GPT models)
- **Deployment:** Railway

## 🔄 Migration from Python

This backend was migrated from Python/FastAPI to Node.js/Fastify for:
- ✅ Unified JavaScript stack (frontend + backend)
- ✅ Simpler deployment (no pip/Nix issues)
- ✅ Better Railway compatibility
- ✅ Excellent Supabase-js SDK

All API endpoints remain **100% compatible** with the frontend!

---

**Made with ❤️ for Superando Limites**

