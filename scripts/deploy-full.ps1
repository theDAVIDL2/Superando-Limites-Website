# Full Deployment Script
# Deploys both frontend and backend

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 Full Deployment (Frontend + Backend)" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Frontend
Write-Host "🔨 Step 1: Building Frontend..." -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor DarkGray

if (Test-Path "frontend\package.json") {
    Push-Location frontend
    npm run build
    $frontendBuildSuccess = ($LASTEXITCODE -eq 0)
    Pop-Location
    
    if ($frontendBuildSuccess) {
        Write-Host ""
        Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Frontend build failed!" -ForegroundColor Red
        Write-Host "Stopping deployment..." -ForegroundColor Red
        return
    }
} else {
    Write-Host "⚠️  Frontend not found!" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Deploy Frontend
Write-Host "🚀 Step 2: Deploying Frontend..." -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor DarkGray

if (Test-Path "scripts\deploy-frontend.ps1") {
    & "scripts\deploy-frontend.ps1"
} else {
    Write-Host "⚠️  Frontend deployment script not found!" -ForegroundColor Yellow
    Write-Host "Skipping frontend deployment..." -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Deploy Backend
Write-Host "🚀 Step 3: Deploying Backend..." -ForegroundColor Yellow
Write-Host "───────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
Write-Host "📝 Backend deployment options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Push to GitHub (Railway auto-deploys):" -ForegroundColor White
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Check deployment status:" -ForegroundColor White
Write-Host "     https://railway.app/dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. View logs:" -ForegroundColor White
Write-Host "     https://github.com/grilojr09br/Superando-Limites-Website/actions" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🎉 Deployment Process Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Commit and push your changes" -ForegroundColor White
Write-Host "  2. Monitor deployment on Railway/Netlify" -ForegroundColor White
Write-Host "  3. Test your production site" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
