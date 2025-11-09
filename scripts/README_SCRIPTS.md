# 📜 Helper Scripts Documentation

This folder contains PowerShell helper scripts used by the Deploy Manager.

---

## 📋 Available Scripts

### 🔨 Development & Build

#### `install-deps.ps1`
**Purpose:** Installs all project dependencies (frontend and backend)

**What it does:**
- Installs frontend npm packages
- Creates Python virtual environment (if needed)
- Installs backend Python packages
- Shows detailed progress and status

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install-deps.ps1
```

---

#### `build-all.ps1`
**Purpose:** Builds frontend and tests backend

**What it does:**
- Builds frontend for production
- Runs backend tests with pytest
- Shows comprehensive summary

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-all.ps1
```

---

### 🚀 Deployment

#### `deploy-full.ps1`
**Purpose:** Full deployment process for frontend and backend

**What it does:**
- Builds frontend
- Guides through frontend deployment
- Shows backend deployment instructions
- Provides next steps

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-full.ps1
```

---

#### `deploy-frontend.ps1`
**Purpose:** Deploy frontend to hosting (SSH/FTP)

**What it does:**
- Checks for built frontend
- Uploads to server via SSH/FTP
- Validates deployment configuration

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-frontend.ps1
```

---

### 🛠️ Utilities

#### `check-env.ps1`
**Purpose:** Validates environment variables configuration

**What it does:**
- Checks for .env files
- Shows environment variables (hiding sensitive values)
- Provides recommendations
- Warns about missing configurations

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\check-env.ps1
```

**Example Output:**
```
📁 Frontend (.env):
  ✅ frontend\.env exists
  
  REACT_APP_BACKEND_URL=[SET]
  REACT_APP_OPENROUTER_MODEL=[SET]

📁 Backend (.env):
  ✅ backend\.env exists
  
  DB_NAME=SuperandoLimites
  TESTING=[SET]
```

---

#### `clean.ps1`
**Purpose:** Removes build artifacts and caches

**What it does:**
- Cleans frontend build folder
- Removes node_modules cache
- Cleans Python `__pycache__`
- Removes `.pytest_cache`
- Deletes log files

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\clean.ps1
```

---

#### `check-requirements.ps1`
**Purpose:** Validates system has all required tools installed

**What it does:**
- Checks Node.js version
- Checks npm version
- Checks Python version
- Checks pip version
- Checks Git installation
- Shows optional tools (Railway CLI)

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\check-requirements.ps1
```

**Example Output:**
```
✅ Node.js: v18.17.0
✅ npm: v9.6.7
✅ Python: Python 3.11.4
✅ pip: pip 23.2.1
✅ Git: git version 2.41.0
```

---

## 🎨 Features

All scripts include:
- ✅ **Colorful output** - Easy to read status messages
- ✅ **Error handling** - Graceful failure with clear messages
- ✅ **Progress indicators** - Know what's happening
- ✅ **Detailed summaries** - See results at a glance
- ✅ **Smart detection** - Auto-detects project structure

---

## 🚀 Running Scripts

### From Deploy Manager (Recommended)

Run `deploy-manager.bat` and select the appropriate option.

### Directly from PowerShell

```powershell
# Navigate to project root
cd C:\path\to\project

# Run any script
powershell -ExecutionPolicy Bypass -File scripts\<script-name>.ps1
```

### From Command Prompt

```batch
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\<script-name>.ps1
```

---

## 📝 Script Output Colors

- 🟢 **Green** - Success messages
- 🟡 **Yellow** - Warnings and info
- 🔴 **Red** - Errors
- 🔵 **Cyan** - Headers and titles
- ⚪ **White** - Regular text
- ⚫ **Gray** - Secondary info

---

## 🔧 Customization

### Adding New Scripts

1. Create a new `.ps1` file in `scripts/` folder
2. Follow the existing format:
   - Add colorful header
   - Use Write-Host with colors
   - Include error handling
   - Add summary section
3. Update `deploy-manager.bat` to call your script
4. Document it in this README

### Script Template

```powershell
# Script Name
# Description

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🎯 Your Script Title..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Your code here

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🎉 Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
```

---

## 🐛 Troubleshooting

### Execution Policy Error

If you get an execution policy error:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script Not Found

Make sure you're in the project root directory:

```batch
cd C:\Users\davie\OneDrive\Área de Trabalho\AI creations\pai\Website
```

### Permission Denied

Run PowerShell as Administrator or adjust the execution policy.

---

## 📚 Related Documentation

- **Main README**: [`../README.md`](../README.md)
- **Deploy Manager**: [`../deploy-manager.bat`](../deploy-manager.bat)
- **Quick Start**: [`../DOCS/START_HERE.md`](../DOCS/START_HERE.md)

---

**Created:** November 9, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready

