# ========================================
# VERTRAVELS DEPLOYMENT SCRIPT (PowerShell)
# Automated setup and deployment for Windows
# ========================================

Write-Host "🚀 VerTravels Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node -v
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($versionNumber -lt 18) {
        Write-Host "❌ Node.js version must be 18 or higher (current: $nodeVersion)" -ForegroundColor Red
        Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check pnpm
try {
    $pnpmVersion = pnpm -v
    Write-Host "✅ pnpm $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  pnpm is not installed" -ForegroundColor Yellow
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Check Vercel CLI
try {
    $vercelVersion = vercel -v
    Write-Host "✅ Vercel CLI $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vercel CLI is not installed" -ForegroundColor Yellow
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host ""
Write-Host "🔧 Generating TypeScript types from Supabase..." -ForegroundColor Yellow
$migrated = Read-Host "Have you run database migrations in Supabase? (y/n)"
if ($migrated -eq "y") {
    pnpm db:generate-types
    Write-Host "✅ Types generated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipping type generation. Run 'pnpm db:generate-types' after migrations" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Environment setup..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Created .env.local from .env.example" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env.local with your Supabase credentials" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after you've updated .env.local"
} else {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔗 Linking to Vercel..." -ForegroundColor Yellow
$linked = Read-Host "Is this project already linked to Vercel? (y/n)"
if ($linked -ne "y") {
    vercel link
    Write-Host "✅ Project linked" -ForegroundColor Green
} else {
    Write-Host "✅ Already linked" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌍 Setting up environment variables on Vercel..." -ForegroundColor Yellow
$syncEnv = Read-Host "Do you want to sync environment variables to Vercel? (y/n)"
if ($syncEnv -eq "y") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -notmatch "^#" -and $_ -match "=") {
            $parts = $_ -split "=", 2
            $varName = $parts[0].Trim()
            $varValue = $parts[1].Trim()
            
            if ($varName -and $varValue) {
                Write-Host "Setting $varName..." -ForegroundColor Gray
                try {
                    echo "$varValue" | vercel env add "$varName" production --yes 2>$null | Out-Null
                } catch {
                    Write-Host "  (Already exists or skipped)" -ForegroundColor Gray
                }
            }
        }
    }
    Write-Host "✅ Environment variables synced" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
$deploy = Read-Host "Deploy to production now? (y/n)"
if ($deploy -eq "y") {
    Write-Host "Building and deploying..." -ForegroundColor Yellow
    vercel --prod
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
} else {
    Write-Host "Deploying to preview..." -ForegroundColor Yellow
    vercel
    Write-Host "✅ Preview deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy to production later, run: vercel --prod" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor White
Write-Host "1. Update Supabase Auth URLs (Site URL & Redirect URLs)" -ForegroundColor White
Write-Host "2. Setup custom domain (optional) in Vercel Dashboard" -ForegroundColor White
Write-Host "3. Test the application thoroughly" -ForegroundColor White
Write-Host "4. Switch payment gateways to LIVE mode when ready" -ForegroundColor White
Write-Host "5. See docs/DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor White
Write-Host "   - Deployment Guide: docs/DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "   - BSP Reconciliation: docs/BSP_RECONCILIATION.md" -ForegroundColor Cyan
Write-Host "   - Manual Bookings: docs/MANUAL_BOOKINGS_BSP_SUMMARY.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Important URLs:" -ForegroundColor White
Write-Host "   - Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "   - Supabase Dashboard: https://app.supabase.com" -ForegroundColor Cyan
Write-Host ""
