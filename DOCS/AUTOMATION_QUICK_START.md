# ⚡ Project Automation - Quick Start

**Fast-track guide to automate your web project in 30 minutes**

For the complete guide, see [PROJECT_AUTOMATION_GUIDE.md](PROJECT_AUTOMATION_GUIDE.md)

---

## 🎯 What You'll Get

- ✅ Automated builds on every push
- ✅ Backend hosting on Railway (auto-deploys)
- ✅ Database & Auth on Supabase
- ✅ GitHub Deployments tracking
- ✅ One-command local deployment

---

## 📋 Prerequisites

**Required:**
- Node.js 18+
- Git
- GitHub account
- Supabase account (free)
- Railway account (free $5/month credit)

**Time:** ~30-45 minutes

---

## 🚀 Quick Setup (6 Steps)

### Step 1: Create Project (5 min)

```bash
# Create folders
mkdir my-project
cd my-project
mkdir -p .github/workflows frontend backend

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
gh repo create my-project --public --source=. --remote=origin
git push -u origin main
```

### Step 2: Supabase Setup (5 min)

1. Go to https://supabase.com → New Project
2. Name it, set password, wait 2 minutes
3. Get credentials: **Settings → API**
4. Copy:
   - Project URL
   - anon public key

### Step 3: Backend Setup (10 min)

```bash
cd backend

# Initialize
npm init -y

# Install dependencies
npm install express cors dotenv helmet @supabase/supabase-js
npm install -D typescript ts-node-dev @types/node @types/express

# Add scripts to package.json
# "dev": "ts-node-dev --respawn src/server.ts"
# "build": "tsc"
# "start": "node dist/server.js"

# Create minimal server
# (See full guide for code)
```

Create `.env`:
```env
PORT=3001
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-secret-minimum-32-chars
```

### Step 4: Railway Deploy (5 min)

1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub → Select your repo
4. Add environment variables (from .env)
5. Copy your Railway URL

### Step 5: Frontend Setup (5 min)

```bash
cd frontend

# Create Vite app
npm create vite@latest . -- --template react

# Install dependencies
npm install
npm install react-router-dom @supabase/supabase-js axios

# Create .env.local
echo "VITE_SUPABASE_URL=https://xxx.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env.local
echo "VITE_API_URL=https://your-app.railway.app" >> .env.local
```

### Step 6: GitHub Actions (10 min)

Create `.github/workflows/frontend-deployment.yml`:

```yaml
name: Frontend Deployment
on:
  push:
    branches: [main]
    paths: ['frontend/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend && npm ci && npm run build
```

Create `.github/workflows/backend-deployment.yml`:

```yaml
name: Backend Deployment
on:
  push:
    branches: [main]
    paths: ['backend/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd backend && npm ci && npm run build
```

Create `railway.json` in project root:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npm run build",
    "watchPatterns": ["backend/**"]
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## ✅ Test Everything

```bash
# Push to GitHub
git add .
git commit -m "feat: Setup automation"
git push origin main

# Watch the magic happen:
# 1. GitHub Actions builds your code
# 2. Railway deploys backend automatically
# 3. Check: github.com/YOUR_USERNAME/my-project/actions
```

---

## 🎉 You're Done!

Your project now has:
- ✅ Automated builds
- ✅ Backend deployed on Railway
- ✅ Database on Supabase
- ✅ GitHub Actions CI/CD

### Next Steps

1. **Deploy frontend** (Netlify/Vercel/Hostinger)
   - See full guide for instructions

2. **Add deployment tracking**
   - See full guide for GitHub Deployments setup

3. **Create deployment scripts**
   - See full guide for PowerShell scripts

---

## 📚 Full Guides

- **Complete Guide:** [PROJECT_AUTOMATION_GUIDE.md](PROJECT_AUTOMATION_GUIDE.md)
- **SSH Setup:** [SSH_KEY_SETUP.md](SSH_KEY_SETUP.md)
- **GitHub Config:** [README.md](README.md)

---

## 🐛 Quick Troubleshooting

**GitHub Actions failing?**
```bash
# Make sure package-lock.json is committed
git add package-lock.json
git commit -m "Add lockfile"
git push
```

**Railway not deploying?**
- Check environment variables in Railway dashboard
- Verify `railway.json` paths are correct
- Check build logs in Railway

**Supabase connection failing?**
```bash
# Verify .env.local file exists
cat frontend/.env.local

# Restart dev server
npm run dev
```

**CORS errors?**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.com'],
  credentials: true
}));
```

---

## 📞 Need Help?

1. Read the [Full Guide](PROJECT_AUTOMATION_GUIDE.md)
2. Check [Troubleshooting section](PROJECT_AUTOMATION_GUIDE.md#troubleshooting)
3. Open an issue on GitHub

---

**Created:** November 2025  
**Updated:** Auto-updates with main guide  
**Version:** 1.0

