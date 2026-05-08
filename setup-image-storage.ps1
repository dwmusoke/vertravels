# ========================================
# VerTravels Image Storage Setup Script (PowerShell)
# ========================================

Write-Host "🚀 Setting up VerTravels Image Storage System" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "❌ .env.local not found. Please create it first." -ForegroundColor Red
    exit 1
}

# Extract Supabase URL
$envContent = Get-Content .env.local
$supabaseUrl = $envContent | Where-Object { $_ -match "^NEXT_PUBLIC_SUPABASE_URL=" } | ForEach-Object { $_.Split("=", 2)[1] }

Write-Host "📡 Supabase URL: $supabaseUrl" -ForegroundColor Green

if ([string]::IsNullOrEmpty($supabaseUrl)) {
    Write-Host "❌ Could not find NEXT_PUBLIC_SUPABASE_URL in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Migration files to run:" -ForegroundColor Yellow
Write-Host ""

# Migration files in order
$migrations = @(
    "packages/database/migrations/0012-image-storage.sql",
    "packages/database/migrations/0012b-destinations-table.sql",
    "packages/database/migrations/0012c-tour-categories.sql"
)

foreach ($migration in $migrations) {
    if (Test-Path $migration) {
        Write-Host "  ✓ $migration" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $migration (NOT FOUND)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "⚠️  IMPORTANT: Manual Steps Required" -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To apply these migrations, you have two options:" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 1: Using Supabase Dashboard (Recommended)" -ForegroundColor Cyan
Write-Host "  1. Go to your Supabase Dashboard: $supabaseUrl" -ForegroundColor White
Write-Host "  2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "  3. Copy and paste the contents of each migration file in order:" -ForegroundColor White
foreach ($migration in $migrations) {
    Write-Host "     - $migration" -ForegroundColor Gray
}
Write-Host ""
Write-Host "OPTION 2: Using psql command line" -ForegroundColor Cyan
Write-Host "  If you have psql installed, run:" -ForegroundColor White
Write-Host "  psql <connection-string> -f packages/database/migrations/0012-image-storage.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After running migrations:" -ForegroundColor Green
Write-Host "  1. Navigate to Admin Panel: /admin" -ForegroundColor White
Write-Host "  2. Go to Content → Destinations" -ForegroundColor White
Write-Host "  3. Upload images for your destinations" -ForegroundColor White
Write-Host "  4. Go to Content → Tour Categories" -ForegroundColor White
Write-Host "  5. Upload custom icons to replace emojis" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: IMAGE_MANAGEMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
