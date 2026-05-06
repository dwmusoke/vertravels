# ⚡ Quick Start - Deploy in 15 Minutes

## Prerequisites (2 minutes)

- [ ] Node.js 18+ installed (`node -v`)
- [ ] pnpm installed (`pnpm -v`)
- [ ] Supabase account (free at supabase.com)
- [ ] Vercel account (free at vercel.com)

---

## Step-by-Step Deployment

### 1️⃣ Setup Supabase Database (5 minutes)

```
✅ Go to supabase.com → New Project
✅ Wait for project creation (2-3 min)
✅ Copy Project URL and API keys
```

**Run Migrations** (SQL Editor → New Query):

Copy and run each file from `packages/database/migrations/`:

- 0001_initial-schema.sql
- 0002_auth-tables.sql
- 0003_modules-flights.sql
- 0004_modules-hotels.sql
- 0005_modules-tours-cars.sql
- 0006_payment-gateways.sql
- 0007_blog-content.sql
- 0008_api-translations.sql
- **0009_booking-pnr-fields.sql** ← NEW
- **0009a-bookings-storage.sql** ← NEW
- **0010_bsp_reconciliation.sql** ← NEW

**Create Storage Buckets** (Storage → Create bucket):

- `bookings` (Public)
- `bsp-reports` (Private)
- `invoices` (Public)
- `profile-photos` (Public)

---

### 2️⃣ Configure Environment (2 minutes)

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

### 3️⃣ Install & Test Locally (3 minutes)

```bash
# Install dependencies
pnpm install

# Generate types
pnpm db:generate-types

# Start dev server
pnpm dev
```

**Test at:**

- Web App: http://localhost:3000
- Admin: http://localhost:3001

**Quick Test:**

1. Login to admin panel
2. Go to Bookings → New Booking
3. Create a test flight booking
4. Upload a PNR document
5. Verify it saves

---

### 4️⃣ Deploy to Vercel (3 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Add Environment Variables** (Vercel Dashboard → Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Redeploy** after adding env vars.

---

### 5️⃣ Post-Deployment (2 minutes)

**Update Supabase Auth:**

```
Supabase Dashboard → Authentication → URL Configuration

Site URL: https://your-domain.vercel.app
Redirect URLs:
  - https://your-domain.vercel.app/auth/callback
  - https://your-domain.vercel.app/**
```

**Test Production:**

1. Open your Vercel URL
2. Create test booking
3. Check admin dashboard
4. Test BSP reconciliation page

---

## ✅ You're Live!

### What's Available Now:

**Customer Features:**

- ✈️ Flight booking
- 🏨 Hotel booking
- 🎯 Tours & activities
- 🚗 Car rentals
- 🛂 Visa applications
- 💳 Multiple payment gateways

**Admin Features:**

- 📊 Dashboard analytics
- 👥 User management
- 📅 Booking management
- ➕ **Manual booking creation** (NEW!)
- 🔄 **BSP reconciliation** (NEW!)
- 💰 **Commission tracking** (NEW!)
- 📧 Email templates
- 🌍 Multi-language support

---

## 🎯 First Tasks After Launch

### 1. Create Your First Manual Booking

```
Admin → Bookings → New Booking
- Select "Flights"
- Fill customer details
- Enter flight info + PNR
- Enable IATA tracking
- Upload PNR document
- Submit
```

### 2. Test BSP Reconciliation

```
Admin → Reconciliation
- Upload a test BSP report (CSV)
- Click "Run Reconciliation"
- Review matched/mismatched items
```

### 3. Setup Payment Gateway

```
Admin → Payments
- Add Stripe/Flutterwave/PayPal keys
- Enable test mode first
- Test a payment
- Switch to live when ready
```

### 4. Add Your IATA Accreditation

```
Admin → IATA Tracking
- Add IATA Profile
- Enter IATA code, number
- Set commission rates
- Configure monthly targets
```

---

## 🆘 Need Help?

### Common Issues:

**Build fails:**

```bash
pnpm clean
pnpm install
pnpm build
```

**Database errors:**

- Check migrations ran in correct order
- Verify Supabase URL/keys in .env.local

**Upload fails:**

- Check storage bucket exists
- Verify bucket is public (for bookings/invoices)
- Check file size limits

**Can't login:**

- Update Supabase Auth URLs
- Check redirect URLs include your domain

### Documentation:

- 📖 Full Deployment: `docs/DEPLOYMENT_GUIDE.md`
- 📊 BSP Guide: `docs/BSP_RECONCILIATION.md`
- 📝 Manual Bookings: `docs/MANUAL_BOOKINGS_BSP_SUMMARY.md`

---

## 🎉 Success Checklist

- [ ] Database migrations complete
- [ ] Storage buckets created
- [ ] Environment variables set
- [ ] Local testing passed
- [ ] Vercel deployment successful
- [ ] Can create manual bookings
- [ ] Can upload PNR documents
- [ ] BSP reconciliation page accessible
- [ ] Admin dashboard working
- [ ] Customer booking flow working

---

**🚀 You're ready to start booking!**

For detailed BSP setup, see `docs/BSP_RECONCILIATION.md`
