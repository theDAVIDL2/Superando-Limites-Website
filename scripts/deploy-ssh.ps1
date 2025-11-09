# SSH Deployment Script
# Deploy frontend build to server via SSH/SCP

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 SSH Deployment" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configuration (update these values)
$SSH_HOST = "silviosuperandolimites.com.br"
$SSH_USER = "your-username"
$SSH_PORT = 22
$REMOTE_PATH = "/home/your-username/public_html"
$SSH_KEY_FINGERPRINT = "SHA256:aokCERS9ylt1D36boROla4ScEIqzbazJlL2ZABbgGHI"

# Check if configured
if ($SSH_USER -eq "your-username") {
    Write-Host "⚠️  SSH deployment not configured!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 To configure, edit: scripts\deploy-ssh.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Update these values:" -ForegroundColor White
    Write-Host "  SSH_USER = your hosting username" -ForegroundColor Gray
    Write-Host "  REMOTE_PATH = path to your website folder" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Example:" -ForegroundColor White
    Write-Host '  $SSH_USER = "u12345678"' -ForegroundColor Gray
    Write-Host '  $REMOTE_PATH = "/home/u12345678/domains/silviosuperandolimites.com.br/public_html"' -ForegroundColor Gray
    Write-Host ""
    return
}

# Check if build exists
if (!(Test-Path "frontend\build")) {
    Write-Host "❌ Build folder not found!" -ForegroundColor Red
    Write-Host "💡 Run: npm run build in frontend folder first" -ForegroundColor Yellow
    Write-Host ""
    return
}

Write-Host "📦 Configuration:" -ForegroundColor Cyan
Write-Host "  Host: $SSH_HOST" -ForegroundColor White
Write-Host "  User: $SSH_USER" -ForegroundColor White
Write-Host "  Port: $SSH_PORT" -ForegroundColor White
Write-Host "  Remote: $REMOTE_PATH" -ForegroundColor White
Write-Host ""

# Confirm
Write-Host "⚠️  This will upload to the production server!" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (y/n)"

if ($confirm -ne "y") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    return
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 Starting Upload..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Use SCP to upload
Write-Host "📤 Uploading files via SCP..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

$source = "frontend\build\*"
$destination = "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

# SCP command
scp -r -P $SSH_PORT $source $destination

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host " ✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Your site is now live at:" -ForegroundColor Cyan
    Write-Host "   https://silviosuperandolimites.com.br/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check your SSH key is set up" -ForegroundColor White
    Write-Host "  2. Verify SSH_USER and REMOTE_PATH in script" -ForegroundColor White
    Write-Host "  3. Test SSH connection: ssh $SSH_USER@$SSH_HOST" -ForegroundColor White
    Write-Host ""
}

