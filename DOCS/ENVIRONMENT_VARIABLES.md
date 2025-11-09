# 🔐 Environment Variables Guide

Complete guide for setting up environment variables for your project.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Frontend Variables](#frontend-variables)
3. [Backend Variables](#backend-variables)
4. [GitHub Secrets](#github-secrets)
5. [Railway/Render Variables](#railwayrender-variables)
6. [Local Development Setup](#local-development-setup)
7. [Production Setup](#production-setup)
8. [Security Best Practices](#security-best-practices)

---

## Overview

This project requires environment variables for:
- ✅ API configuration
- ✅ Database connection
- ✅ Third-party integrations
- ✅ Feature flags
- ✅ Deployment configuration

**⚠️ NEVER commit `.env` files to Git!**

---

## Frontend Variables

### Location
Create file: `frontend/.env`

### Required Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Environment
REACT_APP_ENV=development
```

### Optional Variables

```env
# Analytics (Google Analytics)
REACT_APP_GA_ID=G-XXXXXXXXXX

# Feature Flags
REACT_APP_FEATURE_CHAT=true
REACT_APP_FEATURE_NEWSLETTER=true
REACT_APP_FEATURE_BUYBAR=true

# Debugging
REACT_APP_DEBUG=false
```

### Production Values

```env
# Production API URL
REACT_APP_API_URL=https://your-backend-url.railway.app

# Environment
REACT_APP_ENV=production
```

---

## Backend Variables

### Location
Create file: `backend/.env`

### Required Variables

```env
# Supabase Database Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# ⚠️ WARNING: SUPABASE_SERVICE_KEY is SECRET!
# This key has full database access - never expose it in frontend or commit to Git

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.com

# Admin API Key (for protected endpoints)
ADMIN_API_KEY=your-secure-admin-key-change-this
```

### How to Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose free tier)
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

### Optional Variables

```env
# AI Chat (OpenRouter)
OPENROUTER_MODEL=openai/gpt-3.5-turbo
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Multiple API Keys (comma or semicolon separated)
# OPENROUTER_API_KEYS=key1,key2,key3

# Checkout Integration (Yampi)
CHECKOUT_PUBLIC_URL=https://secure.yampi.com.br/checkout/your-store-id
CHECKOUT_PROVIDER=yampi

# LLM Configuration (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_API_KEYS=key1,key2,key3
OPENROUTER_MODEL=openai/gpt-4o-mini

# Testing
TESTING=false
```

### Production Values

```env
# Use MongoDB Atlas or hosted MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Allow production origins
ALLOWED_ORIGINS=https://your-production-frontend.com,https://www.your-domain.com

# Strong admin key
ADMIN_API_KEY=use-a-very-strong-random-key-here
```

---

## GitHub Secrets

### How to Add Secrets

1. **Go to your repository** on GitHub
2. **Click** Settings → Secrets and variables → Actions
3. **Click** "New repository secret"
4. **Add** each secret below

### Required Secrets

```
REACT_APP_API_URL
└─ Value: https://your-backend-url.railway.app
└─ Used by: Frontend deployment workflow

MONGO_URL
└─ Value: mongodb+srv://...
└─ Used by: Backend tests (optional)

ADMIN_API_KEY
└─ Value: your-secure-key
└─ Used by: Backend deployment
```

### Optional Secrets (for Netlify deployment)

```
NETLIFY_AUTH_TOKEN
└─ Get from: https://app.netlify.com/user/applications
└─ Used by: Automatic Netlify deployment

NETLIFY_SITE_ID
└─ Get from: Netlify site settings
└─ Used by: Automatic Netlify deployment
```

---

## Railway/Render Variables

### Railway Setup

1. **Go to** https://railway.app/dashboard
2. **Select** your project
3. **Click** "Variables" tab
4. **Add** these variables:

```
PORT (auto-provided by Railway)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
ALLOWED_ORIGINS=https://your-frontend.com
ADMIN_API_KEY=your-secure-key
CHECKOUT_PUBLIC_URL=https://secure.yampi.com.br/checkout/your-store
CHECKOUT_PROVIDER=yampi
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

### Render Setup

1. **Go to** https://dashboard.render.com
2. **Select** your web service
3. **Click** "Environment" tab
4. **Add** same variables as Railway above

---

## Local Development Setup

### Step 1: Create Frontend .env

```bash
# Navigate to frontend
cd frontend

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
REACT_APP_FEATURE_CHAT=true
REACT_APP_FEATURE_NEWSLETTER=true
EOF
```

### Step 2: Create Backend .env

```bash
# Navigate to backend
cd backend

# Create .env file
cat > .env << 'EOF'
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/localdb
DB_NAME=localdb
ADMIN_API_KEY=local-dev-key
TESTING=false
EOF
```

### Step 3: Verify

```bash
# Check frontend
cat frontend/.env

# Check backend
cat backend/.env
```

### Step 4: Test Locally

```bash
# Terminal 1: Start backend
cd backend
uvicorn server:app --reload

# Terminal 2: Start frontend
cd frontend
npm start
```

---

## Production Setup

### MongoDB Atlas Setup

1. **Go to** https://cloud.mongodb.com
2. **Create** free cluster (if you don't have one)
3. **Create** database user
4. **Get** connection string
5. **Copy** connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

### Frontend Hosting Setup

#### Option A: Netlify

1. **Go to** https://app.netlify.com
2. **New site** from Git
3. **Connect** GitHub repo
4. **Configure**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```
5. **Add** environment variables:
   - `REACT_APP_API_URL`
   - `REACT_APP_ENV=production`

#### Option B: Vercel

1. **Go to** https://vercel.com
2. **Import** project
3. **Configure**:
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   ```
4. **Add** environment variables

#### Option C: Hostinger (Manual)

1. **Build** locally: `npm run build`
2. **Use** deployment script: `.\scripts\deploy-frontend.ps1`
3. **Or** upload via FTP/SSH

### Backend Hosting Setup

#### Railway

1. **Go to** https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select** repository
4. **Add** environment variables (see above)
5. **Deploy** automatically

#### Render

1. **Go to** https://render.com
2. **New** → Web Service
3. **Connect** repository
4. **Configure**:
   ```
   Build Command: cd backend && pip install -r requirements.txt
   Start Command: cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
5. **Add** environment variables

---

## Security Best Practices

### ✅ DO

- ✅ **Use strong random keys** for `ADMIN_API_KEY`
- ✅ **Add `.env` to `.gitignore`**
- ✅ **Use environment-specific values** (dev vs prod)
- ✅ **Rotate keys** regularly
- ✅ **Use secrets management** in CI/CD
- ✅ **Restrict CORS origins** in production
- ✅ **Use HTTPS** in production URLs

### ❌ DON'T

- ❌ **Don't commit** `.env` files
- ❌ **Don't hardcode** secrets in code
- ❌ **Don't use weak** admin keys
- ❌ **Don't expose** sensitive data in logs
- ❌ **Don't share** production credentials
- ❌ **Don't use** development keys in production

---

## Quick Setup Commands

### Create Frontend .env (Windows)

```powershell
# PowerShell
@"
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
"@ | Out-File -FilePath frontend\.env -Encoding UTF8
```

### Create Backend .env (Windows)

```powershell
# PowerShell
@"
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/localdb
DB_NAME=localdb
ADMIN_API_KEY=local-dev-key
"@ | Out-File -FilePath backend\.env -Encoding UTF8
```

### Create Both (Linux/Mac)

```bash
# Frontend
echo "REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development" > frontend/.env

# Backend
echo "PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/localdb
DB_NAME=localdb
ADMIN_API_KEY=local-dev-key" > backend/.env
```

---

## Troubleshooting

### Issue: "Environment variable not defined"

**Solution:**
```bash
# Restart development server after changing .env
# Frontend: Ctrl+C then npm start
# Backend: Ctrl+C then uvicorn server:app --reload
```

### Issue: "CORS error in production"

**Solution:**
```env
# backend/.env
ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

### Issue: "MongoDB connection failed"

**Solution:**
```env
# Check connection string format
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# For MongoDB Atlas:
# 1. Check username/password
# 2. Whitelist IP address (0.0.0.0/0 for testing)
# 3. Check database name
```

### Issue: "Frontend can't reach backend"

**Solution:**
```env
# Make sure REACT_APP_API_URL is correct
REACT_APP_API_URL=https://your-backend-url.railway.app

# Check backend ALLOWED_ORIGINS
ALLOWED_ORIGINS=https://your-frontend-url.com
```

---

## Verification Checklist

### Local Development

- [ ] `frontend/.env` exists and has `REACT_APP_API_URL`
- [ ] `backend/.env` exists and has `MONGO_URL`
- [ ] Frontend starts without errors (`npm start`)
- [ ] Backend starts without errors (`uvicorn server:app --reload`)
- [ ] Can make API calls from frontend to backend

### Production

- [ ] GitHub secrets added for CI/CD
- [ ] Railway/Render variables configured
- [ ] MongoDB Atlas connection string is correct
- [ ] Frontend can reach backend API
- [ ] CORS is properly configured
- [ ] No secrets exposed in frontend code
- [ ] All APIs return expected responses

---

## Templates

### Minimal Local Setup

**frontend/.env:**
```env
REACT_APP_API_URL=http://localhost:8000
```

**backend/.env:**
```env
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/localdb
DB_NAME=localdb
```

### Full Production Setup

**frontend/.env (Netlify/Vercel):**
```env
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_ENV=production
REACT_APP_GA_ID=G-XXXXXXXXXX
```

**backend/.env (Railway/Render):**
```env
PORT=8000
ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
ADMIN_API_KEY=very-secure-random-key-here-64-chars-min
CHECKOUT_PUBLIC_URL=https://secure.yampi.com.br/checkout/your-store
CHECKOUT_PROVIDER=yampi
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

---

## Generate Secure Keys

### PowerShell (Windows)

```powershell
# Generate random admin key
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### Bash (Linux/Mac)

```bash
# Generate random admin key
openssl rand -base64 48
```

### Online

- https://www.random.org/strings/
- https://passwordsgenerator.net/

---

## Additional Resources

- **MongoDB Atlas:** https://cloud.mongodb.com
- **Railway Docs:** https://docs.railway.app/develop/variables
- **Render Docs:** https://render.com/docs/environment-variables
- **Netlify Docs:** https://docs.netlify.com/environment-variables/overview/
- **React Env Vars:** https://create-react-app.dev/docs/adding-custom-environment-variables/

---

**Last Updated:** November 9, 2025  
**Version:** 1.0

---

**🔐 Remember: Security is paramount! Never commit secrets to version control! 🔐**

