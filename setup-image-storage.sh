#!/usr/bin/env bash

# ========================================
# VerTravels Image Storage Setup Script
# ========================================

echo "🚀 Setting up VerTravels Image Storage System"
echo "=============================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Please create it first."
    exit 1
fi

# Extract Supabase credentials
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
echo "📡 Supabase URL: $SUPABASE_URL"

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Could not find NEXT_PUBLIC_SUPABASE_URL in .env.local"
    exit 1
fi

echo ""
echo "📦 Running database migrations..."
echo ""

# Migration files in order
MIGRATIONS=(
    "packages/database/migrations/0012-image-storage.sql"
    "packages/database/migrations/0012b-destinations-table.sql"
    "packages/database/migrations/0012c-tour-categories.sql"
)

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  psql command not found."
    echo ""
    echo "Please run these migrations manually:"
    echo "1. Go to your Supabase Dashboard: ${SUPABASE_URL}"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy and paste the contents of each migration file:"
    for migration in "${MIGRATIONS[@]}"; do
        echo "   - $migration"
    done
    echo ""
    exit 1
fi

# Run migrations
for migration in "${MIGRATIONS[@]}"; do
    if [ -f "$migration" ]; then
        echo "📄 Running: $migration"
        # Note: You'll need to provide your database password
        # Or use connection string from .env
        psql "$SUPABASE_DB_URL" -f "$migration" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "   ✅ Success"
        else
            echo "   ⚠️  Failed - Please run manually in Supabase SQL Editor"
        fi
    else
        echo "   ❌ File not found: $migration"
    fi
    echo ""
done

echo ""
echo "=============================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Navigate to Admin Panel: /admin"
echo "2. Go to Content → Destinations"
echo "3. Upload images for your destinations"
echo "4. Go to Content → Tour Categories"
echo "5. Upload custom icons to replace emojis"
echo ""
echo "For detailed instructions, see: IMAGE_MANAGEMENT_GUIDE.md"
echo "=============================================="
