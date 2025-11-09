# 📜 Automation Scripts

Helper scripts for the **Deploy Manager** tool. These scripts handle various development, build, and deployment tasks.

---

## 📋 Available Scripts

| Script | Description | Called By |
|--------|-------------|-----------|
| `install-deps.ps1` | Installs frontend (npm) and backend (pip) dependencies | Option 4 |
| `build-all.ps1` | Builds frontend and tests backend | Option 7 |
| `check-env.ps1` | Displays and validates .env files | Option 11 |
| `clean.ps1` | Removes build artifacts and cache | Option 13 |
| `check-requirements.ps1` | Verifies Node.js, Python, Git are installed | Option 15 |
| `deployment-dashboard.ps1` | Interactive Git deployment menu | Option 8 |
| `deploy-ssh.ps1` | Deploys via SSH/SCP | Option 9 |
| `deploy-full.ps1` | Full build + deploy pipeline | Option 10 |

---

## 🚀 Usage

These scripts are designed to be called by `deploy-manager.bat`, but can also be run directly:

```powershell
# From PowerShell
.\scripts\install-deps.ps1

# From deploy-manager
deploy-manager.bat -> [4] Install All Dependencies
```

---

## ⚙️ Configuration

The deployment scripts use `.deploy-config.json` for user-specific settings:

- Repository URL
- Live website URL
- SSH credentials (if using SSH deploy)
- Frontend/Backend directories
- Port numbers

**First-time users:** The deploy manager will create this file from `.deploy-config.json.example` on first run.

---

## 🔒 Security

- ✅ No hardcoded credentials
- ✅ No sensitive data in scripts
- ✅ User config is in `.gitignore`
- ✅ Safe to commit to Git

---

## 📝 Notes

- All scripts use simple ASCII (no Unicode errors on Windows)
- PowerShell execution policy: Scripts use `-ExecutionPolicy Bypass` when called from deploy-manager
- Fallback logic: If a script is missing, deploy-manager provides basic functionality

---

## 🆕 Adding New Scripts

1. Create your `.ps1` file in this directory
2. Add to deploy-manager.bat menu
3. Document it here
4. Test on fresh environment

