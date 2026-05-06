#!/bin/bash

# ========================================
# VERTRAVELS DEPLOYMENT SCRIPT
# Automated setup and deployment
# ========================================

set -e  # Exit on error

echo "🚀 VerTravels Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm is not installed${NC}"
    echo "Installing pnpm..."
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm $(pnpm -v)${NC}"

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI is not installed${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi
echo -e "${GREEN}✅ Vercel CLI $(vercel -v)${NC}"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔧 Generating TypeScript types from Supabase..."
read -p "Have you run database migrations in Supabase? (y/n): " migrated
if [ "$migrated" = "y" ]; then
    pnpm db:generate-types
    echo -e "${GREEN}✅ Types generated${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping type generation. Run 'pnpm db:generate-types' after migrations${NC}"
fi

echo ""
echo "📝 Environment setup..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local from .env.example${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env.local with your Supabase credentials${NC}"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi

echo ""
echo "🔗 Linking to Vercel..."
read -p "Is this project already linked to Vercel? (y/n): " linked
if [ "$linked" != "y" ]; then
    vercel link
    echo -e "${GREEN}✅ Project linked${NC}"
else
    echo -e "${GREEN}✅ Already linked${NC}"
fi

echo ""
echo "🌍 Setting up environment variables on Vercel..."
read -p "Do you want to sync environment variables to Vercel? (y/n): " sync_env
if [ "$sync_env" = "y" ]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
        if [[ ! "$line" =~ ^# ]] && [[ -n "$line" ]]; then
            var_name=$(echo "$line" | cut -d'=' -f1)
            var_value=$(echo "$line" | cut -d'=' -f2-)
            
            if [ -n "$var_name" ] && [ -n "$var_value" ]; then
                echo "Setting $var_name..."
                echo "$var_value" | vercel env add "$var_name" production --yes 2>/dev/null || true
            fi
        fi
    done < .env.local
    echo -e "${GREEN}✅ Environment variables synced${NC}"
fi

echo ""
echo "🚀 Deploying to Vercel..."
read -p "Deploy to production now? (y/n): " deploy
if [ "$deploy" = "y" ]; then
    echo "Building and deploying..."
    vercel --prod
    echo -e "${GREEN}✅ Deployment complete!${NC}"
else
    echo "Deploying to preview..."
    vercel
    echo -e "${GREEN}✅ Preview deployment complete!${NC}"
    echo ""
    echo "To deploy to production later, run: ${YELLOW}vercel --prod${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Update Supabase Auth URLs (Site URL & Redirect URLs)"
echo "2. Setup custom domain (optional) in Vercel Dashboard"
echo "3. Test the application thoroughly"
echo "4. Switch payment gateways to LIVE mode when ready"
echo "5. See docs/DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "📚 Documentation:"
echo "   - Deployment Guide: docs/DEPLOYMENT_GUIDE.md"
echo "   - BSP Reconciliation: docs/BSP_RECONCILIATION.md"
echo "   - Manual Bookings: docs/MANUAL_BOOKINGS_BSP_SUMMARY.md"
echo ""
echo "🔗 Important URLs:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - Supabase Dashboard: https://app.supabase.com"
echo ""
