# 🚀 VerTravels Deployment Guide

## Quick Deployment Checklist

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed
- [ ] Supabase account created
- [ ] Vercel account created
- [ ] Git installed

---

## Phase 1: Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** vertravels-production
   - **Database Password:** (save securely!)
   - **Region:** Choose closest to your customers
   - **Pricing Plan:** Free tier to start

4. Wait 2-3 minutes for project creation

### Step 2: Get API Keys

1. In Supabase Dashboard → **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbG...`
   - **service_role key:** `eyJhbG...` (keep secret!)

### Step 3: Run Database Migrations

Open **SQL Editor** in Supabase Dashboard and run these migrations **IN ORDER**:

```sql
-- 1. Core Schema
-- Copy contents of: packages/database/migrations/0001_initial-schema.sql
```

```sql
-- 2. Auth Tables
-- Copy contents of: packages/database/migrations/0002_auth-tables.sql
```

```sql
-- 3. Flights Module
-- Copy contents of: packages/database/migrations/0003_modules-flights.sql
```

```sql
-- 4. Hotels Module
-- Copy contents of: packages/database/migrations/0004_modules-hotels.sql
```

```sql
-- 5. Tours & Cars
-- Copy contents of: packages/database/migrations/0005_modules-tours-cars.sql
```

```sql
-- 6. Payment Gateways
-- Copy contents of: packages/database/migrations/0006_payment-gateways.sql
```

```sql
-- 7. Blog Content
-- Copy contents of: packages/database/migrations/0007_blog-content.sql
```

```sql
-- 8. API Translations
-- Copy contents of: packages/database/migrations/0008_api-translations.sql
```

```sql
-- 9. PNR Fields (NEW - for manual bookings)
-- Copy contents of: packages/database/migrations/0009_booking-pnr-fields.sql
```

```sql
-- 10. Storage Setup (NEW - for document uploads)
-- Copy contents of: packages/database/migrations/0009a-bookings-storage.sql
```

```sql
-- 11. BSP Reconciliation (NEW - for BSP tracking)
-- Copy contents of: packages/database/migrations/0010_bsp_reconciliation.sql
```

✅ **Verify:** All migrations ran without errors

### Step 4: Create Storage Buckets

In Supabase Dashboard → **Storage**:

1. **Create bucket: `bookings`**
   - Public: ✅ Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/*, application/pdf`

2. **Create bucket: `bsp-reports`**
   - Public: ❌ No (private)
   - File size limit: 50MB
   - Allowed MIME types: `text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

3. **Create bucket: `invoices`**
   - Public: ✅ Yes
   - File size limit: 5MB

4. **Create bucket: `profile-photos`**
   - Public: ✅ Yes
   - File size limit: 5MB

✅ **Verify:** All 4 buckets created

### Step 5: Enable Row Level Security (RLS)

Run this in SQL Editor to verify RLS is enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

All tables should show `rowsecurity = true`

---

## Phase 2: Environment Configuration

### Step 6: Create .env.local File

```bash
cd D:\VerTravels
copy .env.example .env.local
```

### Step 7: Fill in Environment Variables

Edit `.env.local` with your values:

```env
# ========================================
# SUPABASE (Required)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase

# ========================================
# APP URLs (Update for production)
# ========================================
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_VERCEL_ENV=production

# ========================================
# PAYMENTS (Add when ready)
# ========================================
# STRIPE
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# FLUTTERWAVE
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE-...
FLUTTERWAVE_SECRET_KEY=FLWSECK_LIVE-...
FLUTTERWAVE_ENCRYPTION_KEY=...

# PAYPAL
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_SECRET=your_live_secret

# ========================================
# THIRD-PARTY APIs (Optional - add as needed)
# ========================================
# Flights
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
AMADEUS_ENVIRONMENT=production

# Hotels
HOTELSTON_API_KEY=your_key
HOTELSTON_API_SECRET=your_secret

# Tours
VIATOR_API_KEY=your_key
VIATOR_PARTNER_ID=your_id

# ========================================
# EMAIL (SendGrid recommended)
# ========================================
SENDGRID_API_KEY=SG.your_key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
SENDGRID_FROM_NAME=VerTravels

# ========================================
# SECURITY (Generate secrets)
# ========================================
NEXTAUTH_SECRET=openssl rand -base64 32
JWT_SECRET=openssl rand -base64 32

# ========================================
# ANALYTICS (Optional)
# ========================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### Step 8: Generate Security Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

Copy the outputs to `.env.local`

---

## Phase 3: Local Testing

### Step 9: Install Dependencies

```bash
cd D:\VerTravels
pnpm install
```

### Step 10: Generate TypeScript Types

```bash
pnpm db:generate-types
```

### Step 11: Start Development Servers

```bash
# Start all apps (web + admin + api)
pnpm dev

# Or start individually:
pnpm dev:web    # http://localhost:3000
pnpm dev:admin  # http://localhost:3001
pnpm dev:api    # Edge functions
```

### Step 12: Test Manual Booking Creation

1. Go to `http://localhost:3001/login`
2. Login (create account if needed)
3. Navigate to **Bookings** → Click **"New Booking"**
4. Fill in test flight booking with IATA details
5. Upload a test PNR document
6. Submit and verify booking created

### Step 13: Test BSP Reconciliation

1. Go to `http://localhost:3001/reconciliation`
2. Click "Upload BSP Report"
3. Upload a test CSV file
4. Click "Run Reconciliation"
5. Verify matching works

✅ **Verify:** Both features work locally

---

## Phase 4: Vercel Deployment

### Step 14: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 15: Login to Vercel

```bash
vercel login
```

Choose your authentication method (email/GitHub)

### Step 16: Link to Vercel Project

```bash
cd D:\VerTravels
vercel link
```

- **Create new project:** Yes
- **Project name:** vertravels
- **Directory:** D:\VerTravels

### Step 17: Add Environment Variables to Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... add all required env vars
```

Or add via Vercel Dashboard:

1. Go to project settings → **Environment Variables**
2. Add each variable from `.env.local`
3. Set for **Production** and **Preview**

### Step 18: Deploy to Preview

```bash
vercel
```

- Review build settings
- Confirm deployment
- Wait for build to complete (~3-5 minutes)
- Note the preview URL

### Step 19: Test Preview Deployment

1. Open preview URL in browser
2. Test all critical flows:
   - User registration/login
   - Flight search
   - Manual booking creation
   - Payment flow (test mode)
   - Admin dashboard access
   - BSP reconciliation

### Step 20: Deploy to Production

```bash
vercel --prod
```

✅ **Verify:** Production deployment successful

---

## Phase 5: Post-Deployment

### Step 21: Update Supabase Auth URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

1. **Site URL:** `https://your-domain.com`
2. **Redirect URLs:**
   - `https://your-domain.com/auth/callback`
   - `https://admin.your-domain.com/auth/callback`
   - `https://your-domain.com/**`

### Step 22: Setup Custom Domain (Optional)

In Vercel Dashboard → **Settings** → **Domains**:

1. Add your domain: `your-domain.com`
2. Add admin subdomain: `admin.your-domain.com`
3. Update DNS records as instructed:

   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

4. Wait for DNS propagation (5-30 minutes)
5. Enable HTTPS automatically

### Step 23: Setup Cron Jobs

Vercel cron jobs are configured in `vercel.json`:

- **Currency update:** Daily at midnight
- **Session cleanup:** Daily at 3 AM

Verify in Vercel Dashboard → **Cron**

### Step 24: Setup Monitoring

#### Sentry (Error Tracking)

1. Create account at [sentry.io](https://sentry.io)
2. Create new project
3. Add DSN to Vercel env vars
4. Deploy update

#### Google Analytics

1. Add GA4 tracking ID to `.env.local`
2. Deploy update
3. Verify in GA Dashboard

### Step 25: Create Admin User

```sql
-- Run in Supabase SQL Editor
INSERT INTO auth.users (email, role, created_at)
VALUES ('admin@your-domain.com', 'admin', NOW());

-- Or use Supabase Dashboard → Authentication → Add User
```

---

## Phase 6: Go Live Checklist

### Before Going Live

- [ ] All migrations run successfully
- [ ] Storage buckets created
- [ ] RLS policies enabled
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Test booking flow end-to-end
- [ ] Test payment gateway (test mode)
- [ ] Test email sending
- [ ] Test admin dashboard
- [ ] Test manual booking creation
- [ ] Test BSP reconciliation
- [ ] Setup production payment keys
- [ ] Setup production email service
- [ ] Enable error monitoring (Sentry)
- [ ] Enable analytics (GA4)
- [ ] Create admin user account
- [ ] Setup backup strategy
- [ ] Document credentials securely

### Go Live

1. Switch payment gateways to **LIVE** mode
2. Update `NEXT_PUBLIC_VERCEL_ENV=production`
3. Deploy final version
4. Monitor logs for errors
5. Send launch announcement

### After Launch

- [ ] Monitor error logs (first 24 hours)
- [ ] Check analytics tracking
- [ ] Verify all bookings are saving
- [ ] Test customer support email
- [ ] Backup database
- [ ] Document any issues
- [ ] Train staff on admin panel
- [ ] Train staff on BSP reconciliation

---

## Troubleshooting

### Build Fails

```bash
# Check Node version
node -v  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

### Database Errors

```bash
# Check migrations ran
# Supabase Dashboard → SQL Editor → Run:
SELECT * FROM bookings LIMIT 1;

# If table doesn't exist, re-run migrations
```

### Environment Variable Issues

```bash
# List all Vercel env vars
vercel env ls

# Remove and re-add problematic var
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production
```

### Storage Upload Fails

1. Check bucket exists in Supabase Storage
2. Verify RLS policies allow uploads
3. Check file size limits
4. Verify MIME type is allowed

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **VerTravels Docs:** `/docs/` folder

### Emergency Contacts

- **Vercel Status:** https://vercel.com/status
- **Supabase Status:** https://status.supabase.com

---

## Next Steps After Deployment

1. **Import Existing Data** (if migrating from another system)
2. **Setup Email Templates** (admin → email templates)
3. **Configure Payment Gateways** (admin → payments)
4. **Add Third-Party Integrations** (flights, hotels, tours APIs)
5. **Customize Branding** (logo, colors, emails)
6. **Setup Multi-Language** (if needed)
7. **Train Your Team** on:
   - Manual booking creation
   - BSP reconciliation
   - Commission tracking
   - Customer support

---

**🎉 Congratulations! Your VerTravels platform is now live!**

For BSP reconciliation setup, see `/docs/BSP_RECONCILIATION.md`
