# Troubleshooting: Admin Updates Not Showing

## Quick Fix Steps

### 1. **Restart Development Server**

The new pages require the dev server to be running:

```bash
# Stop current server (Ctrl+C)

# Install dependencies if needed
npm install

# Start dev server
npm run dev

# Or for web app only
npm run dev:web
```

### 2. **Clear Browser Cache**

The browser might be showing cached versions:

**Chrome/Edge:**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: Open DevTools → Network tab → Check "Disable cache"

**Firefox:**
- Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### 3. **Check You're on Correct Admin URL**

New pages are at:
- `/admin/pnr-ingestion` - PNR upload
- `/admin/manual-postings` - Manual booking entry
- `/admin/queue` - Queue management
- `/admin/ticketing` - Ticketing system

**Full URLs:**
```
http://localhost:3001/admin/pnr-ingestion
http://localhost:3001/admin/manual-postings
http://localhost:3001/admin/queue
http://localhost:3001/admin/ticketing
```

### 4. **Check Admin Sidebar**

The sidebar should show:
- **Operations** section (new)
  - PNR Ingestion
  - Manual Postings
  - Queue Management
  - Ticketing

If sidebar doesn't show these, the layout file wasn't updated.

### 5. **Database Migration Required**

New pages need database tables. Run this in Supabase:

```sql
-- Go to: https://supabase.com/dashboard/project/kjsxtfweybttvqoafptc/sql
-- Copy and run entire file: packages/database/migrations/0014-backoffice-midoffice.sql
```

**Without this migration, pages will show errors!**

### 6. **Check for Build Errors**

If pages show blank or errors:

```bash
# Check console for errors
# Open browser DevTools (F12) → Console tab

# Check for these common errors:
# - "Table does not exist" → Run migration
# - "Component not found" → Restart dev server
# - "404 Not Found" → Wrong URL
```

### 7. **Verify Files Exist**

Check these files exist:

```bash
# In your project folder, verify:
apps/admin/app/pnr-ingestion/page.tsx     ← Should exist
apps/admin/app/manual-postings/page.tsx   ← Should exist
apps/admin/app/queue/page.tsx             ← Should exist
apps/admin/app/ticketing/page.tsx         ← Should exist
apps/admin/components/layout/admin-sidebar.tsx  ← Should be updated
```

### 8. **Check Git Status**

Verify changes were pulled:

```bash
git status
git log --oneline -5
```

You should see recent commits:
- `9dc1129` - Phase 2 Queue & Ticketing
- `22a15ce` - Phase 1 Backoffice
- `1421dec` - Tours images fix

If you don't see these, pull latest:

```bash
git pull origin main
```

---

## Common Issues & Solutions

### Issue 1: "Page Not Found" (404)

**Cause:** Dev server not running or wrong URL

**Solution:**
```bash
npm run dev
# Navigate to: http://localhost:3001/admin
```

### Issue 2: Blank Page / White Screen

**Cause:** Database tables missing

**Solution:**
1. Run migration in Supabase SQL Editor
2. Refresh page

### Issue 3: Sidebar Not Updated

**Cause:** Old build cached

**Solution:**
```bash
# Stop dev server
# Clear .next folder
rm -rf .next
# Restart
npm run dev
```

### Issue 4: "Table does not exist" Error

**Cause:** Migration not run

**Solution:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run migration 0014-backoffice-midoffice.sql

### Issue 5: Changes Not in Production

**Cause:** Only pushed to Git, not deployed

**Solution:**
If using Vercel/Netlify:
1. Go to deployment dashboard
2. Trigger new deployment
3. Wait for build to complete

---

## Step-by-Step Verification

### ✅ Checklist

1. [ ] Pull latest code: `git pull origin main`
2. [ ] Install dependencies: `npm install`
3. [ ] Run database migration (Supabase SQL Editor)
4. [ ] Start dev server: `npm run dev`
5. [ ] Clear browser cache: `Ctrl+Shift+R`
6. [ ] Navigate to: `http://localhost:3001/admin`
7. [ ] Check sidebar for "Operations" section
8. [ ] Click on new pages to test

---

## Expected Result

After following steps, you should see:

**Admin Sidebar:**
```
├── Dashboard
├── Bookings
├── Operations (NEW!)
│   ├── PNR Ingestion
│   ├── Manual Postings
│   ├── Queue Management
│   └── Ticketing
├── Documents
│   ├── Invoices
│   ├── Quotations
│   ├── Receipts
│   └── Statements
├── Reconciliation
└── ... (other menu items)
```

**New Pages:**
- `/admin/pnr-ingestion` - Upload PNR files, see batches
- `/admin/manual-postings` - Create manual bookings
- `/admin/queue` - Queue monitoring dashboard
- `/admin/ticketing` - Issue tickets, see stock levels

---

## Still Not Working?

### Check These:

1. **Node Version**
   ```bash
   node --version
   # Should be v18 or higher
   ```

2. **NPM Version**
   ```bash
   npm --version
   # Should be v9 or higher
   ```

3. **Browser Console Errors**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

4. **Supabase Connection**
   - Check `.env.local` has correct Supabase URL
   - Verify you're logged into Supabase

### Get Help:

Share these details:
1. What URL are you accessing?
2. What do you see? (screenshot)
3. Any errors in browser console?
4. Did you run the database migration?
5. Git commit you're on: `git log --oneline -1`

---

## Production Deployment

If you want these in production:

**Vercel:**
```bash
git push origin main
# Vercel auto-deploys from main branch
```

**Manual Deploy:**
```bash
npm run build
npm run start
```

---

**Last Updated:** Phase 2 deployed (Commit: 9dc1129)
**Status:** Ready for testing after migration
