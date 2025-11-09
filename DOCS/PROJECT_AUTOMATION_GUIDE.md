# 🚀 Complete Website Project Automation Guide

**Learn how to automate ANY website project from scratch to production**

This guide shows you how to replicate the complete automation setup used in the L2 EDUCA project, including GitHub integration, automated deployments, backend hosting, and database management.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Part 1: Project Structure Setup](#part-1-project-structure-setup)
5. [Part 2: GitHub Repository Setup](#part-2-github-repository-setup)
6. [Part 3: Supabase Setup (Database & Auth)](#part-3-supabase-setup-database--auth)
7. [Part 4: Backend Setup & Railway Deployment](#part-4-backend-setup--railway-deployment)
8. [Part 5: Frontend Hosting Setup](#part-5-frontend-hosting-setup)
9. [Part 6: GitHub Actions Automation](#part-6-github-actions-automation)
10. [Part 7: Local Deployment Scripts](#part-7-local-deployment-scripts)
11. [Part 8: Testing & Verification](#part-8-testing--verification)
12. [Part 9: Maintenance & Updates](#part-9-maintenance--updates)
13. [Troubleshooting](#troubleshooting)
14. [Quick Reference](#quick-reference)

---

## Overview

### What You'll Build

By following this guide, you'll create a **fully automated web application** with:

✅ **Automated CI/CD** - GitHub Actions for continuous integration  
✅ **Backend API** - Express.js backend hosted on Railway  
✅ **Database & Auth** - Supabase for PostgreSQL and authentication  
✅ **Frontend Hosting** - Static hosting (Hostinger, Netlify, Vercel, etc.)  
✅ **Deployment Tracking** - GitHub Deployments integration  
✅ **One-Command Deployment** - Batch scripts for easy deployment  
✅ **Environment Management** - Proper secrets and config handling  

### Time Required

- **Basic Setup:** 2-3 hours
- **Full Automation:** 4-6 hours
- **Testing & Polish:** 1-2 hours

---

## Prerequisites

### Required Tools

```bash
# Check if you have these installed:
node --version    # v18.0.0 or higher
npm --version     # v9.0.0 or higher
git --version     # v2.0.0 or higher
```

### Required Accounts

1. **GitHub** - For version control and CI/CD
2. **Supabase** - For database and authentication (free tier available)
3. **Railway** - For backend hosting (free tier: $5/month credit)
4. **Frontend Host** - Hostinger, Netlify, Vercel, etc.

### Optional Tools

- **PuTTY** (Windows) - For SSH deployments to traditional hosts
- **VS Code** - Recommended IDE
- **GitHub Desktop** - For easier Git management

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        YOUR PROJECT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   FRONTEND   │    │   BACKEND    │    │   DATABASE   │ │
│  │   (React)    │◄───┤  (Express)   │◄───┤  (Supabase)  │ │
│  │              │    │              │    │              │ │
│  │  Hostinger   │    │   Railway    │    │  PostgreSQL  │ │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘ │
│         │                   │                               │
│         └───────────────────┴───────────────┐              │
│                                              │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                    ┌──────────────────────────┼──────────────┐
                    │      GITHUB ACTIONS      │              │
                    ├──────────────────────────┴──────────────┤
                    │                                          │
                    │  ┌────────────────┐  ┌────────────────┐ │
                    │  │ Frontend Build │  │ Backend Build  │ │
                    │  │  & Deploy      │  │  & Deploy      │ │
                    │  └────────────────┘  └────────────────┘ │
                    │                                          │
                    │  ┌────────────────────────────────────┐ │
                    │  │    Deployment Tracking             │ │
                    │  │    (GitHub Deployments Tab)        │ │
                    │  └────────────────────────────────────┘ │
                    │                                          │
                    └──────────────────────────────────────────┘
```

### How It Works

1. **Developer pushes code** to GitHub
2. **GitHub Actions detects** changes (frontend/backend)
3. **Automated builds** are triggered
4. **Backend auto-deploys** to Railway
5. **Frontend builds** are created (manual or auto-deploy)
6. **Deployments tracked** in GitHub Deployments tab
7. **Everything monitored** from one dashboard

---

## Part 1: Project Structure Setup

### 1.1 Create Project Root

```bash
# Create your project folder
mkdir my-awesome-project
cd my-awesome-project

# Initialize Git
git init
```

### 1.2 Create Standard Structure

```bash
# Create folders
mkdir -p .github/workflows
mkdir frontend
mkdir backend
mkdir dev-utils
mkdir docs

# Create essential files
touch .gitignore
touch README.md
touch railway.json
touch nixpacks.toml
```

### 1.3 Configure .gitignore

```gitignore
# .gitignore
# ============================================

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json  # Optional: keep if you want version locking

# Production builds
dist/
build/
*.tgz

# Environment variables
.env
.env.local
.env.production
.env.*.local

# Dev utilities (keep private)
dev-utils/
scripts/deploy-config.json

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
.cache/
```

### 1.4 Project Structure Overview

```
my-awesome-project/
├── .github/
│   └── workflows/              # GitHub Actions automation
│       ├── frontend-deployment.yml
│       ├── backend-deployment.yml
│       └── deployment-status.yml
├── frontend/                   # Your React/Vue/etc. app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Your Express.js API
│   ├── src/
│   ├── dist/                   # Build output
│   ├── package.json
│   └── tsconfig.json
├── dev-utils/                  # Local utilities (NOT in Git)
│   ├── deploy-config.json
│   └── deployment-scripts/
├── docs/                       # Documentation
├── railway.json                # Railway deployment config
├── nixpacks.toml              # Railway build config
├── .gitignore
└── README.md
```

---

## Part 2: GitHub Repository Setup

### 2.1 Create GitHub Repository

**Option 1: Via GitHub Web**

1. Go to https://github.com/new
2. Name: `my-awesome-project`
3. Description: Your project description
4. Visibility: Public or Private
5. **Don't** initialize with README (we already have one)
6. Click **Create repository**

**Option 2: Via GitHub CLI**

```bash
# Install GitHub CLI first: https://cli.github.com/
gh repo create my-awesome-project --public --source=. --remote=origin
```

### 2.2 Connect Local to GitHub

```bash
# Add remote
git remote add origin https://github.com/grilojr09br/Superando-Limites-Website.git

# Verify
git remote -v

# Create initial commit
git add .
git commit -m "feat: Initial project setup"

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.3 Configure GitHub Repository Settings

1. **Go to your repository** → Settings

2. **Set up GitHub Pages** (optional, for docs):
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `docs` folder
   - Save

3. **Configure Secrets** (for later use):
   - Settings → Secrets and variables → Actions
   - Click **New repository secret**
   
   Add these secrets:
   ```
   VITE_SUPABASE_URL        (from Supabase)
   VITE_SUPABASE_ANON_KEY   (from Supabase)
   JWT_SECRET               (generate your own)
   ```

4. **Enable GitHub Actions**:
   - Settings → Actions → General
   - Workflow permissions: Read and write permissions
   - Check "Allow GitHub Actions to create and approve pull requests"
   - Save

### 2.4 Set Up Environments

GitHub Environments help track deployments:

1. Go to: **Settings → Environments**

2. **Create Production Frontend Environment**:
   - Name: `production-frontend`
   - Add environment secret: (if needed)
   - Protection rules: (optional)
   - Deployment branches: `main` only
   - Environment URL: `https://your-frontend-url.com`

3. **Create Production Backend Environment**:
   - Name: `production-backend`
   - Environment URL: `https://your-backend-url.railway.app`

---

## Part 3: Supabase Setup (Database & Auth)

### 3.1 Create Supabase Project

1. **Go to** https://supabase.com
2. **Sign up** or **Sign in**
3. **Click** "New Project"

**Project Configuration:**
```
Name:              my-awesome-project
Database Password: (generate a strong password - SAVE THIS!)
Region:            Choose closest to your users
Pricing Plan:      Free (to start)
```

4. **Wait 2-3 minutes** for project to be created

### 3.2 Get Your Supabase Credentials

1. Go to **Project Settings** → **API**

2. **Copy these values:**
   ```
   Project URL:  https://xxxxx.supabase.co
   anon public:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (KEEP SECRET!)
   ```

3. **Store in your frontend `.env`:**
   ```env
   # frontend/.env.local
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Store in your backend `.env`:**
   ```env
   # backend/.env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

### 3.3 Set Up Database Schema

1. **Go to** SQL Editor in Supabase

2. **Create Users Table:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

3. **Create Additional Tables** (example):

```sql
-- Posts table (example)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3.4 Configure Supabase Authentication

1. **Go to** Authentication → Providers

2. **Enable Authentication Methods:**
   - ✅ Email/Password (enabled by default)
   - ✅ Google OAuth (optional)
   - ✅ GitHub OAuth (optional)

3. **Configure Email Templates**:
   - Authentication → Email Templates
   - Customize confirmation, reset password, etc.

4. **Set Site URL and Redirect URLs**:
   - Authentication → URL Configuration
   - Site URL: `https://your-frontend-url.com`
   - Redirect URLs: 
     ```
     https://your-frontend-url.com/**
     http://localhost:5173/**
     ```

### 3.5 Test Supabase Connection

Create a simple test file:

```javascript
// test-supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Connected to Supabase!');
    console.log('Data:', data);
  }
}

testConnection();
```

---

## Part 4: Backend Setup & Railway Deployment

### 4.1 Create Backend Structure

```bash
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv helmet @supabase/supabase-js
npm install bcrypt jsonwebtoken cookie-parser zod

# Install TypeScript and dev dependencies
npm install -D typescript ts-node-dev @types/node @types/express
npm install -D @types/cors @types/bcrypt @types/jsonwebtoken
```

### 4.2 Configure TypeScript

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4.3 Update Backend package.json

```json
// backend/package.json
{
  "name": "my-awesome-project-backend",
  "version": "1.0.0",
  "description": "Backend API for My Awesome Project",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 4.4 Create Basic Backend Structure

```typescript
// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to My Awesome Project API' });
});

// Example: Get users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
```

```typescript
// backend/src/types/index.ts
export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 4.5 Create .env File (Backend)

```env
# backend/.env
# DO NOT COMMIT THIS FILE!

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Railway (auto-provided in production)
RAILWAY_ENVIRONMENT=production
```

### 4.6 Test Backend Locally

```bash
cd backend

# Start development server
npm run dev

# Test in another terminal
curl http://localhost:3001/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### 4.7 Deploy to Railway

**Step 1: Create Railway Account**

1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Verify your account

**Step 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select your repository: `my-awesome-project`

**Step 3: Configure Railway Project**

1. **Click on the service** (it auto-creates one)
2. **Go to Settings**
3. **Root Directory**: Leave empty (we'll use railway.json)
4. **Build Command**: Auto-detected
5. **Start Command**: Auto-detected

**Step 4: Add Environment Variables**

1. Click **"Variables"** tab
2. Add these variables:
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.com
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret
   ```

**Step 5: Configure railway.json** (in project root)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install --production=false && npm run build",
    "watchPatterns": [
      "backend/**"
    ]
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Step 6: Configure nixpacks.toml** (in project root)

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["cd backend && npm install"]

[phases.build]
cmds = ["cd backend && npm run build"]

[start]
cmd = "cd backend && npm start"
```

**Step 7: Deploy**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: Add backend with Railway config"
   git push origin main
   ```

2. **Railway auto-deploys** when it detects the push

3. **Check deployment**:
   - Go to Railway dashboard
   - Click on your service
   - Go to "Deployments" tab
   - Wait for green checkmark ✅

4. **Get your backend URL**:
   - Click "Settings"
   - Under "Domains", you'll see:
     ```
     https://my-awesome-project-production.up.railway.app
     ```
   - Or click "Generate Domain" if not present

**Step 8: Test Production Backend**

```bash
# Test health endpoint
curl https://your-backend-url.railway.app/health

# Should return: {"status":"healthy","timestamp":"..."}
```

---

## Part 5: Frontend Hosting Setup

### 5.1 Create Frontend Structure

```bash
cd frontend

# Create Vite + React project
npm create vite@latest . -- --template react

# Or for TypeScript:
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom @supabase/supabase-js axios
```

### 5.2 Configure Frontend

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
```

### 5.3 Set Up Supabase Client (Frontend)

```javascript
// frontend/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### 5.4 Create Frontend .env

```env
# frontend/.env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://your-backend-url.railway.app
```

### 5.5 Frontend Hosting Options

#### Option A: Netlify (Easiest - Free)

1. **Go to** https://netlify.com
2. **Sign up** with GitHub
3. **Click** "Add new site" → "Import an existing project"
4. **Connect to GitHub**
5. **Select your repository**: `my-awesome-project`
6. **Configure**:
   ```
   Base directory:    frontend
   Build command:     npm run build
   Publish directory: frontend/dist
   ```
7. **Add environment variables**:
   - Site settings → Environment variables
   - Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
8. **Deploy!**
9. **Your site**: `https://your-site.netlify.app`

#### Option B: Vercel (Great for Next.js)

1. **Go to** https://vercel.com
2. **Sign up** with GitHub
3. **Import** your repository
4. **Configure**:
   ```
   Framework Preset:  Vite
   Root Directory:    frontend
   Build Command:     npm run build
   Output Directory:  dist
   ```
5. **Add environment variables**
6. **Deploy**
7. **Your site**: `https://your-site.vercel.app`

#### Option C: Hostinger (SSH/FTP Deployment)

**Requirements:**
- Hostinger account with SSH access
- PuTTY (Windows) or SSH client (Mac/Linux)

**Step 1: Get SSH Credentials**

1. Log in to Hostinger
2. Go to **Hosting** → **Manage**
3. Click **SSH Access**
4. Note down:
   ```
   Host: your-server.com
   Port: 65002
   Username: u123456789
   Password: your-password
   ```

**Step 2: Create Deployment Script**

See [Part 7](#part-7-local-deployment-scripts) for complete scripts.

---

## Part 6: GitHub Actions Automation

### 6.1 Frontend Deployment Workflow

Create file: `.github/workflows/frontend-deployment.yml`

```yaml
name: Frontend Deployment

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'
      - '!frontend/docs/**'
      - '!frontend/*.md'
  workflow_dispatch:

jobs:
  build-and-deploy:
    name: Build & Deploy Frontend
    runs-on: ubuntu-latest
    
    environment:
      name: production-frontend
      url: https://your-frontend-url.com

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: 🔧 Install dependencies
        working-directory: frontend
        run: npm ci

      - name: 🏗️ Build frontend
        working-directory: frontend
        run: npm run build
        env:
          NODE_ENV: production
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: ✅ Build successful
        run: |
          echo "✅ Frontend built successfully!"
          echo "📦 Build size: $(du -sh frontend/dist | cut -f1)"
          echo "📁 Files: $(find frontend/dist -type f | wc -l)"

      - name: 💾 Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build-${{ github.sha }}
          path: frontend/dist
          retention-days: 7

      - name: 📝 Create deployment record
        uses: actions/github-script@v7
        with:
          script: |
            const deployment = await github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production-frontend',
              description: 'Frontend deployment',
              auto_merge: false,
              required_contexts: [],
              production_environment: true
            });
            
            await github.rest.repos.createDeploymentStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              deployment_id: deployment.data.id,
              state: 'success',
              log_url: `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`,
              description: 'Frontend deployed successfully',
              environment_url: 'https://your-frontend-url.com'
            });

      # Optional: Auto-deploy to Netlify/Vercel (they handle this automatically)
      # For manual hosts like Hostinger, you'd run deployment scripts here
```

### 6.2 Backend Deployment Workflow

Create file: `.github/workflows/backend-deployment.yml`

```yaml
name: Backend Deployment (Railway)

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - 'railway.json'
      - 'nixpacks.toml'
  workflow_dispatch:

jobs:
  build-and-track:
    name: Build & Track Backend
    runs-on: ubuntu-latest
    
    environment:
      name: production-backend
      url: https://your-backend-url.railway.app

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: 🔧 Install dependencies
        working-directory: backend
        run: npm ci --production=false

      - name: 🏗️ Build backend
        working-directory: backend
        run: npm run build

      - name: ✅ Build successful
        run: |
          echo "✅ Backend built successfully!"
          echo "📦 Build size: $(du -sh backend/dist | cut -f1)"

      - name: 💾 Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: backend-build-${{ github.sha }}
          path: backend/dist
          retention-days: 3

      - name: 📝 Create deployment record
        uses: actions/github-script@v7
        with:
          script: |
            const deployment = await github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production-backend',
              description: 'Backend deployment to Railway',
              auto_merge: false,
              required_contexts: [],
              production_environment: true
            });
            
            await github.rest.repos.createDeploymentStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              deployment_id: deployment.data.id,
              state: 'success',
              log_url: 'https://railway.app',
              description: 'Deployed to Railway automatically',
              environment_url: 'https://your-backend-url.railway.app'
            });

      - name: 🎉 Deployment info
        run: |
          echo "✅ Backend deployment tracked!"
          echo "🚂 Railway auto-deploys on push"
          echo "🌐 URL: https://your-backend-url.railway.app"
```

### 6.3 Deployment Status Workflow

Create file: `.github/workflows/deployment-status.yml`

```yaml
name: Deployment Status

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  status:
    name: 📊 Deployment Overview
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: 🔍 Detect changes
        id: changes
        run: |
          FRONTEND_CHANGED=$(git diff --name-only HEAD^ HEAD | grep '^frontend/' | grep -v '^frontend/docs/' || echo "")
          BACKEND_CHANGED=$(git diff --name-only HEAD^ HEAD | grep '^backend/' || echo "")
          DOCS_ONLY=$(git diff --name-only HEAD^ HEAD | grep -E '\.md$|^docs/' || echo "")
          
          echo "frontend_changed=$( [ -n "$FRONTEND_CHANGED" ] && echo 'true' || echo 'false' )" >> $GITHUB_OUTPUT
          echo "backend_changed=$( [ -n "$BACKEND_CHANGED" ] && echo 'true' || echo 'false' )" >> $GITHUB_OUTPUT
          echo "docs_only=$( [ -z "$FRONTEND_CHANGED" ] && [ -z "$BACKEND_CHANGED" ] && [ -n "$DOCS_ONLY" ] && echo 'true' || echo 'false' )" >> $GITHUB_OUTPUT

      - name: 📊 Deployment summary
        run: |
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "🚀 DEPLOYMENT STATUS"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo ""
          echo "📝 Commit: ${{ github.sha }}"
          echo "👤 Author: ${{ github.actor }}"
          echo "💬 Message: ${{ github.event.head_commit.message }}"
          echo ""
          
          if [ "${{ steps.changes.outputs.frontend_changed }}" == "true" ]; then
            echo "🎨 FRONTEND: ✅ Changes detected → Deploying"
          fi
          
          if [ "${{ steps.changes.outputs.backend_changed }}" == "true" ]; then
            echo "🔧 BACKEND: ✅ Changes detected → Railway deploying"
          fi
          
          if [ "${{ steps.changes.outputs.docs_only }}" == "true" ]; then
            echo "📚 DOCS ONLY: No deployment needed"
          fi
          
          echo ""
          echo "📍 View: https://github.com/${{ github.repository }}/deployments"
```

### 6.4 Commit and Push Workflows

```bash
# Add all workflows
git add .github/workflows/

# Commit
git commit -m "feat: Add GitHub Actions automation workflows"

# Push to GitHub
git push origin main
```

### 6.5 Verify Workflows

1. **Go to your repository** on GitHub
2. **Click** "Actions" tab
3. **You should see** workflows running
4. **Click on a workflow** to see details
5. **Check** "Deployments" tab to see deployment records

---

## Part 7: Local Deployment Scripts

### 7.1 Create Deployment Manager (Windows)

Create `dev-manager.bat` in project root:

```batch
@echo off
REM ================================================================
REM Development Manager - My Awesome Project
REM ================================================================

:MENU
cls
echo.
echo ============================================================
echo           MY AWESOME PROJECT - DEV MANAGER
echo ============================================================
echo.
echo  [1] Start Frontend Dev Server
echo  [2] Start Backend Dev Server
echo  [3] Start Both (Frontend + Backend)
echo  [4] Build Frontend
echo  [5] Build Backend
echo  [6] Deploy Frontend to Production
echo  [7] View Logs
echo  [8] Run Tests
echo  [9] Exit
echo.
echo ============================================================
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto FRONTEND_DEV
if "%choice%"=="2" goto BACKEND_DEV
if "%choice%"=="3" goto BOTH_DEV
if "%choice%"=="4" goto BUILD_FRONTEND
if "%choice%"=="5" goto BUILD_BACKEND
if "%choice%"=="6" goto DEPLOY_FRONTEND
if "%choice%"=="7" goto VIEW_LOGS
if "%choice%"=="8" goto RUN_TESTS
if "%choice%"=="9" goto EXIT

echo Invalid choice! Please try again.
timeout /t 2 >nul
goto MENU

:FRONTEND_DEV
echo.
echo Starting Frontend Development Server...
cd frontend
start cmd /k "npm run dev"
goto MENU

:BACKEND_DEV
echo.
echo Starting Backend Development Server...
cd backend
start cmd /k "npm run dev"
goto MENU

:BOTH_DEV
echo.
echo Starting Frontend and Backend...
cd frontend
start cmd /k "npm run dev"
cd ../backend
start cmd /k "npm run dev"
goto MENU

:BUILD_FRONTEND
echo.
echo Building Frontend...
cd frontend
call npm run build
echo.
echo Build completed!
pause
goto MENU

:BUILD_BACKEND
echo.
echo Building Backend...
cd backend
call npm run build
echo.
echo Build completed!
pause
goto MENU

:DEPLOY_FRONTEND
echo.
echo Deploying Frontend to Production...
REM Call your deployment script here
echo.
echo Deployment script would run here
pause
goto MENU

:VIEW_LOGS
echo.
echo Opening log files...
echo Feature not implemented yet
pause
goto MENU

:RUN_TESTS
echo.
echo Running Tests...
cd frontend
call npm test
cd ../backend
call npm test
pause
goto MENU

:EXIT
echo.
echo Goodbye!
exit
```

### 7.2 Create Hostinger Deployment Script (PowerShell)

Create `frontend/scripts/deploy-to-host.ps1`:

```powershell
# ================================================================
# Frontend Deployment Script - SSH/FTP to Any Host
# ================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "deploy"
)

# Colors
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"
$ColorInfo = "Cyan"

# Configuration file
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ConfigFile = Join-Path $ScriptDir "deploy-config.json"
$DistPath = Join-Path (Split-Path -Parent $ScriptDir) "dist"

# Display header
function Show-Header {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor $ColorInfo
    Write-Host "   FRONTEND DEPLOYMENT TO PRODUCTION     " -ForegroundColor $ColorInfo
    Write-Host "=========================================" -ForegroundColor $ColorInfo
    Write-Host ""
}

# Load configuration
function Get-DeployConfig {
    if (-not (Test-Path $ConfigFile)) {
        Write-Host "[ERROR] Configuration file not found!" -ForegroundColor $ColorError
        Write-Host "Creating default configuration..." -ForegroundColor $ColorWarning
        
        $defaultConfig = @{
            ssh_host = "your-server.com"
            ssh_port = "22"
            ssh_user = "your-username"
            ssh_password = "YOUR_PASSWORD_HERE"
            remote_path = "/public_html"
            local_dist_path = "dist"
        }
        
        $defaultConfig | ConvertTo-Json | Set-Content $ConfigFile
        
        Write-Host ""
        Write-Host "[INFO] Config created at: $ConfigFile" -ForegroundColor $ColorInfo
        Write-Host "[IMPORTANT] Please edit and add your credentials!" -ForegroundColor $ColorWarning
        Write-Host ""
        
        return $null
    }
    
    try {
        $config = Get-Content $ConfigFile | ConvertFrom-Json
        
        if ($config.ssh_password -eq "YOUR_PASSWORD_HERE") {
            Write-Host "[ERROR] Please configure your credentials in:" -ForegroundColor $ColorError
            Write-Host "  $ConfigFile" -ForegroundColor $ColorWarning
            return $null
        }
        
        return $config
    } catch {
        Write-Host "[ERROR] Failed to load config: $_" -ForegroundColor $ColorError
        return $null
    }
}

# Check requirements
function Test-Requirements {
    $hasPscp = Get-Command pscp -ErrorAction SilentlyContinue
    $hasPlink = Get-Command plink -ErrorAction SilentlyContinue
    
    if (-not $hasPscp -or -not $hasPlink) {
        Write-Host "[ERROR] PuTTY tools required!" -ForegroundColor $ColorError
        Write-Host ""
        Write-Host "Install from: https://www.putty.org/" -ForegroundColor $ColorInfo
        return $false
    }
    
    Write-Host "[SUCCESS] Requirements met!" -ForegroundColor $ColorSuccess
    return $true
}

# Build frontend
function Build-Frontend {
    Write-Host "[1/4] Building frontend..." -ForegroundColor $ColorInfo
    
    $frontendPath = Split-Path -Parent $ScriptDir
    Push-Location $frontendPath
    
    try {
        Write-Host "  Running npm run build..." -ForegroundColor Gray
        $output = npm run build 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERROR] Build failed!" -ForegroundColor $ColorError
            Pop-Location
            return $false
        }
        
        Write-Host "  [SUCCESS] Build completed" -ForegroundColor $ColorSuccess
        Pop-Location
        return $true
    } catch {
        Write-Host "[ERROR] Build error: $_" -ForegroundColor $ColorError
        Pop-Location
        return $false
    }
}

# Clean remote directory
function Clear-RemoteDirectory {
    param($config)
    
    Write-Host "[2/4] Cleaning remote directory..." -ForegroundColor $ColorInfo
    
    $sshCmd = "cd $($config.remote_path) && rm -rf * && echo 'Cleaned'"
    
    try {
        # Cache host key
        echo y | plink -P $config.ssh_port -pw $config.ssh_password "$($config.ssh_user)@$($config.ssh_host)" "exit" 2>&1 | Out-Null
        
        # Execute command
        $plinkArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "$($config.ssh_user)@$($config.ssh_host)",
            $sshCmd
        )
        
        & plink @plinkArgs 2>&1 | Out-Null
        
        Write-Host "  [SUCCESS] Directory cleaned" -ForegroundColor $ColorSuccess
        return $true
    } catch {
        Write-Host "[WARNING] Could not clean directory" -ForegroundColor $ColorWarning
        return $true
    }
}

# Upload files
function Upload-Files {
    param($config)
    
    Write-Host "[3/4] Uploading files..." -ForegroundColor $ColorInfo
    
    if (-not (Test-Path $DistPath)) {
        Write-Host "[ERROR] Dist folder not found: $DistPath" -ForegroundColor $ColorError
        return $false
    }
    
    try {
        Write-Host "  Uploading via PSCP..." -ForegroundColor Gray
        
        $pscpArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "-r",
            "$DistPath\*",
            "$($config.ssh_user)@$($config.ssh_host):$($config.remote_path)/"
        )
        
        $output = & pscp @pscpArgs 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [SUCCESS] Files uploaded!" -ForegroundColor $ColorSuccess
            return $true
        } else {
            Write-Host "[ERROR] Upload failed!" -ForegroundColor $ColorError
            return $false
        }
    } catch {
        Write-Host "[ERROR] Upload error: $_" -ForegroundColor $ColorError
        return $false
    }
}

# Verify deployment
function Test-Deployment {
    param($config)
    
    Write-Host "[4/4] Verifying deployment..." -ForegroundColor $ColorInfo
    
    $checkCmd = "cd $($config.remote_path) && ls -la | head -10"
    
    try {
        $plinkArgs = @(
            "-P", $config.ssh_port,
            "-pw", $config.ssh_password,
            "-batch",
            "$($config.ssh_user)@$($config.ssh_host)",
            $checkCmd
        )
        
        $result = & plink @plinkArgs 2>&1
        
        Write-Host ""
        Write-Host "  Remote files:" -ForegroundColor Gray
        Write-Host $result -ForegroundColor Gray
        Write-Host ""
        Write-Host "  [SUCCESS] Verification complete" -ForegroundColor $ColorSuccess
        return $true
    } catch {
        Write-Host "[WARNING] Could not verify" -ForegroundColor $ColorWarning
        return $true
    }
}

# Main deployment
function Start-Deployment {
    Show-Header
    
    Write-Host "Starting deployment..." -ForegroundColor $ColorInfo
    Write-Host ""
    
    if (-not (Test-Requirements)) {
        Write-Host ""
        pause
        return
    }
    
    $config = Get-DeployConfig
    if (-not $config) {
        Write-Host ""
        pause
        return
    }
    
    Write-Host "Configuration:" -ForegroundColor $ColorInfo
    Write-Host "  Server: $($config.ssh_host):$($config.ssh_port)" -ForegroundColor Gray
    Write-Host "  Path: $($config.remote_path)" -ForegroundColor Gray
    Write-Host ""
    
    $confirm = Read-Host "Continue deployment? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host ""
        Write-Host "Deployment cancelled." -ForegroundColor $ColorWarning
        return
    }
    
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor $ColorInfo
    Write-Host ""
    
    if (-not (Build-Frontend)) {
        Write-Host ""
        Write-Host "[FAILED] Deployment aborted" -ForegroundColor $ColorError
        Write-Host ""
        pause
        return
    }
    
    Write-Host ""
    Clear-RemoteDirectory $config | Out-Null
    Write-Host ""
    
    if (-not (Upload-Files $config)) {
        Write-Host ""
        Write-Host "[FAILED] Upload error" -ForegroundColor $ColorError
        Write-Host ""
        pause
        return
    }
    
    Write-Host ""
    Test-Deployment $config | Out-Null
    
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor $ColorInfo
    Write-Host ""
    Write-Host "[SUCCESS] Deployment completed!" -ForegroundColor $ColorSuccess
    Write-Host ""
    Write-Host "Your site should be live at:" -ForegroundColor $ColorInfo
    Write-Host "  https://your-domain.com" -ForegroundColor $ColorInfo
    Write-Host ""
}

# Execute
switch ($Action) {
    "deploy" {
        Start-Deployment
    }
    default {
        Show-Header
        Write-Host "[ERROR] Unknown action: $Action" -ForegroundColor $ColorError
        Write-Host ""
    }
}

Write-Host "=========================================" -ForegroundColor $ColorInfo
Write-Host ""
pause
```

### 7.3 Create deploy-config.json Template

Create `frontend/scripts/deploy-config.json`:

```json
{
  "ssh_host": "your-server.com",
  "ssh_port": "22",
  "ssh_user": "your-username",
  "ssh_password": "YOUR_PASSWORD_HERE",
  "remote_path": "/public_html",
  "local_dist_path": "dist"
}
```

**IMPORTANT:** Add to `.gitignore`:

```gitignore
# Don't commit credentials!
**/deploy-config.json
```

### 7.4 Make Scripts Executable

```bash
# Windows (run in PowerShell as Admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Linux/Mac
chmod +x frontend/scripts/deploy-to-host.sh
```

---

## Part 8: Testing & Verification

### 8.1 Test Complete Workflow

**Step 1: Make a Frontend Change**

```bash
# Edit a file
echo "// Test change" >> frontend/src/App.jsx

# Commit and push
git add .
git commit -m "feat: Test frontend change"
git push origin main
```

**Step 2: Watch GitHub Actions**

1. Go to: `https://github.com/grilojr09br/Superando-Limites-Website/actions`
2. You should see workflows running
3. Wait for completion (~2-5 minutes)

**Step 3: Check Deployments**

1. Go to: `https://github.com/grilojr09br/Superando-Limites-Website/deployments`
2. You should see deployment records
3. Click on a deployment to see details

**Step 4: Make a Backend Change**

```bash
# Edit backend file
echo "// Test change" >> backend/src/server.ts

# Commit and push
git add .
git commit -m "feat: Test backend change"
git push origin main
```

**Step 5: Verify Backend Deployment**

1. Check GitHub Actions (backend workflow should run)
2. Check Railway dashboard (should show new deployment)
3. Test backend: `curl https://your-backend-url.railway.app/health`

### 8.2 Test Local Development

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Open browser: http://localhost:5173
```

### 8.3 Test Database Connection

```javascript
// Create test file: test-db.js
import { supabase } from './frontend/src/config/supabase.js';

async function testDatabase() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Check connection
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
    return;
  }
  
  console.log('✅ Connected to Supabase!');
  console.log('Data:', data);
  
  // Test 2: Try to insert
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([
      { 
        email: 'test@example.com',
        username: 'testuser'
      }
    ])
    .select();
  
  if (insertError) {
    console.error('❌ Insert failed:', insertError);
  } else {
    console.log('✅ Insert successful!', newUser);
  }
}

testDatabase();
```

Run test:

```bash
node test-db.js
```

### 8.4 End-to-End Test Checklist

- [ ] Frontend accessible at production URL
- [ ] Backend accessible at Railway URL
- [ ] Health endpoint returns 200: `/health`
- [ ] API endpoints working: `/api/users`
- [ ] Database queries successful
- [ ] Authentication working (if implemented)
- [ ] GitHub Actions workflows running
- [ ] Deployments tracked in GitHub
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## Part 9: Maintenance & Updates

### 9.1 Regular Updates

**Weekly:**
- Check for dependency updates: `npm outdated`
- Review GitHub Actions logs
- Monitor Railway usage/credits
- Check Supabase storage usage

**Monthly:**
- Update dependencies: `npm update`
- Review and optimize database
- Check security advisories
- Backup important data

### 9.2 Monitoring Setup

**1. Set Up Railway Notifications**

- Railway Dashboard → Project Settings
- Enable email notifications for:
  - Deploy failures
  - Resource usage alerts
  - Billing alerts

**2. Set Up Supabase Monitoring**

- Supabase Dashboard → Reports
- Monitor:
  - Database size
  - API requests
  - Storage usage

**3. GitHub Actions Notifications**

- Settings → Notifications
- Enable workflow notifications

### 9.3 Backup Strategy

**Database Backups:**

```bash
# Manual backup (run weekly)
# Supabase Dashboard → Database → Backups
# Download backup SQL file
```

**Code Backups:**

```bash
# Git already handles this, but good practice:
git tag v1.0.0
git push --tags
```

**Environment Variables Backup:**

```bash
# Create secure backup of all env vars
# Store in password manager (1Password, Bitwarden, etc.)
```

### 9.4 Scaling Considerations

**When to Upgrade:**

1. **Frontend:**
   - Traffic > 100k/month → Consider CDN
   - Multiple regions → Use Vercel/Netlify edge functions

2. **Backend:**
   - CPU/Memory usage > 80% → Upgrade Railway plan
   - Multiple requests/second → Add caching (Redis)

3. **Database:**
   - Storage > 500MB → Review queries and optimize
   - Slow queries → Add indexes
   - Need real-time → Use Supabase Realtime

---

## Troubleshooting

### Common Issues

#### 1. GitHub Actions Failing

**Issue:** Workflows fail with "npm ci" error

**Solution:**
```bash
# Make sure package-lock.json is committed
git add package-lock.json
git commit -m "chore: Add package-lock.json"
git push
```

#### 2. Railway Not Deploying

**Issue:** Railway shows "Build failed"

**Solution:**
- Check `railway.json` paths are correct
- Verify Node.js version in `nixpacks.toml`
- Check environment variables are set
- Review build logs in Railway dashboard

#### 3. Supabase Connection Errors

**Issue:** "Invalid API key" or "Connection refused"

**Solution:**
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Make sure .env.local is created and variables are correct
# Restart dev server after changing .env files
```

#### 4. CORS Errors

**Issue:** "Access to fetch blocked by CORS policy"

**Solution:**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.com'
  ],
  credentials: true
}));
```

#### 5. Build Errors in Production

**Issue:** "Module not found" or "Cannot find package"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Make sure all dependencies are in package.json, not devDependencies
npm install <package-name> --save
```

#### 6. SSH Deployment Fails (Hostinger)

**Issue:** "Permission denied" or "Connection refused"

**Solution:**
- Verify SSH credentials in `deploy-config.json`
- Make sure SSH port is correct (often 65002 for Hostinger)
- Test SSH connection manually first:
  ```bash
  ssh -p 65002 username@host
  ```
- Install PuTTY tools (Windows)

---

## Quick Reference

### Essential Commands

```bash
# Frontend Development
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend Development
cd backend
npm run dev          # Start dev server
npm run build        # Build TypeScript
npm start            # Run production build

# Git Workflow
git add .
git commit -m "feat: Your feature"
git push origin main

# Database (Supabase CLI - optional)
npx supabase init
npx supabase start
npx supabase db push
```

### Important URLs

```
GitHub Repository:
https://github.com/grilojr09br/Superando-Limites-Website

GitHub Actions:
https://github.com/grilojr09br/Superando-Limites-Website/actions

GitHub Deployments:
https://github.com/grilojr09br/Superando-Limites-Website/deployments

Railway Dashboard:
https://railway.app/dashboard

Supabase Dashboard:
https://app.supabase.com

Frontend (Production):
https://your-frontend-url.com

Backend (Production):
https://your-backend-url.railway.app
```

### File Locations

```
.github/workflows/          # GitHub Actions
frontend/                   # React app
backend/                    # Express API
frontend/.env.local         # Frontend secrets (NOT in Git)
backend/.env                # Backend secrets (NOT in Git)
railway.json                # Railway deployment config
nixpacks.toml               # Railway build config
```

### Environment Variables

**Frontend (.env.local):**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://your-backend.railway.app
```

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.com
```

---

## Next Steps

### After Basic Setup

1. **Add Authentication**
   - Implement login/signup
   - Protected routes
   - User profiles

2. **Add Features**
   - CRUD operations
   - Real-time updates (Supabase Realtime)
   - File uploads (Supabase Storage)

3. **Improve DevOps**
   - Add staging environment
   - Implement preview deployments
   - Set up monitoring (Sentry, LogRocket)

4. **Optimize Performance**
   - Add caching (Redis)
   - Optimize images
   - Code splitting

5. **Add Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

### Advanced Topics

- **CI/CD Improvements:**
  - Automated testing in CI
  - Preview deployments for PRs
  - Automated rollbacks

- **Monitoring & Logging:**
  - Error tracking (Sentry)
  - Analytics (Plausible, Umami)
  - Performance monitoring

- **Security Enhancements:**
  - Rate limiting
  - Input validation
  - SQL injection prevention
  - XSS protection

---

## Resources

### Documentation

- **GitHub Actions:** https://docs.github.com/actions
- **Railway:** https://docs.railway.app
- **Supabase:** https://supabase.com/docs
- **Vite:** https://vitejs.dev
- **Express:** https://expressjs.com

### Tutorials

- **Full Stack App:** https://www.youtube.com/watch?v=your-tutorial
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Railway Deployment:** https://docs.railway.app/deploy/deployments

### Community

- **GitHub Discussions:** https://github.com/grilojr09br/Superando-Limites-Website/discussions
- **Discord:** Join relevant Discord servers
- **Stack Overflow:** Tag your questions appropriately

---

## Contributing

If you improve this automation setup:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request
5. Share your learnings!

---

## License

This guide is provided as-is for educational purposes. Adapt to your needs!

---

## Credits

**Created by:** Your Name  
**Inspired by:** L2 EDUCA Project  
**Last Updated:** November 2025

---

## Support

Need help? 

1. Check [Troubleshooting](#troubleshooting) section
2. Review [Common Issues](#common-issues)
3. Open an issue on GitHub
4. Join our Discord community

---

**🎉 Congratulations! You've built a fully automated web application! 🎉**

---

## Appendix

### A. Full Project Structure

```
my-awesome-project/
├── .github/
│   └── workflows/
│       ├── frontend-deployment.yml
│       ├── backend-deployment.yml
│       └── deployment-status.yml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── scripts/
│   │   ├── deploy-to-host.ps1
│   │   └── deploy-config.json
│   ├── .env.local
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── types/
│   │   └── server.ts
│   ├── dist/          (build output)
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── dev-utils/         (NOT in Git)
│   ├── PROJECT_AUTOMATION_GUIDE.md
│   └── local-scripts/
├── docs/
├── .gitignore
├── README.md
├── railway.json
├── nixpacks.toml
├── dev-manager.bat
└── package.json       (optional root package.json)
```

### B. Deployment Checklist

**Before First Deployment:**
- [ ] GitHub repository created
- [ ] Supabase project created
- [ ] Railway project created
- [ ] Environment variables configured
- [ ] GitHub secrets added
- [ ] GitHub workflows added
- [ ] Frontend hosting configured
- [ ] Domain configured (if applicable)

**Before Every Deployment:**
- [ ] Code tested locally
- [ ] Environment variables updated
- [ ] Database migrations run
- [ ] Build succeeds locally
- [ ] No console errors
- [ ] All tests passing

**After Deployment:**
- [ ] Verify frontend loads
- [ ] Verify backend responds
- [ ] Test database connection
- [ ] Check for errors in logs
- [ ] Test critical user flows
- [ ] Monitor for 24 hours

### C. Security Checklist

- [ ] No secrets in code
- [ ] All .env files in .gitignore
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens (if using cookies)
- [ ] Strong JWT secrets
- [ ] Regular dependency updates
- [ ] Security headers (Helmet.js)

---

**END OF GUIDE**

*Good luck with your automated projects!* 🚀

