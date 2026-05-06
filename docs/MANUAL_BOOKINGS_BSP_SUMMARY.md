# Manual Bookings with BSP Reconciliation - Implementation Summary

## ✅ What Was Implemented

### 1. Manual Booking Creation

**Location:** `/admin/bookings/new`

**Features:**

- Create bookings for all modules (Flights, Hotels, Tours, Cars, Visa)
- Customer information capture
- Module-specific booking forms
- Payment information (amount, currency, method, status)
- PNR document upload (for flights)
- **IATA/BSP tracking fields** (for flights):
  - IATA booking toggle
  - PNR and ticket number
  - Airline code
  - Base fare and taxes
  - Commission amount
  - IATA accreditation selection

**Access:** Click "New Booking" button from `/admin/bookings`

---

### 2. BSP Reconciliation System

**Location:** `/admin/reconciliation`

**Features:**

- **BSP Report Upload** - Upload monthly BSP/IATA reports (CSV, Excel, TXT)
- **Automatic Reconciliation** - Match internal bookings with BSP data
- **Discrepancy Detection** - Identify fare and commission differences
- **Status Tracking:**
  - ✅ Matched - Amounts within tolerance
  - ❌ Mismatch - Differences detected
  - ⏳ Pending - Awaiting BSP data
  - ⚠️ Missing in BSP - Not found in reports

**Dashboard Metrics:**

- Total bookings count
- Matched/mismatched/pending counts
- Total discrepancy amount
- BSP sales vs our sales
- Commission earned

**Filters:**

- By status (matched, mismatch, pending, missing)
- By airline code
- By date range
- Search by booking ref or PNR

**Export:** Download reconciliation reports in JSON format

---

### 3. Enhanced IATA Tracking

**Location:** `/admin/iata-tracking` (existing, enhanced)

**Features:**

- IATA accreditation management
- Commission tracking per booking
- BSP report generation
- Airline sync capabilities
- Monthly target tracking

---

## 📄 Database Migrations Created

### Migration 0009: `0009_booking-pnr-fields.sql`

Adds PNR tracking to bookings:

- `bookings.pnr_url` - URL to uploaded PNR document
- `bookings.pnr` - Passenger Name Record
- `flights_bookings.pnr_document_url` - Flight PNR document storage

### Migration 0009a: `0009a-bookings-storage.sql`

Creates storage bucket for document uploads:

- `bookings` storage bucket
- Upload/view/delete policies for authenticated users
- Public read access for invoices

### Migration 0010: `0010_bsp_reconciliation.sql`

Comprehensive BSP reconciliation tables:

**Core Tables:**

- `bsp_reports` - Uploaded BSP/IATA reports
- `bsp_line_items` - Individual booking lines from BSP
- `bsp_reconciliation` - Matching between our bookings and BSP
- `airline_memos` - Credit/debit memos tracking
- `bsp_settlements` - Bank settlement records
- `commission_tracking` - Commission earnings and payments

**Total:** 6 new tables, 20+ indexes

---

## 🎯 Key Capabilities

### Manual Booking with IATA Tracking

When creating a manual flight booking:

1. Fill in customer details
2. Enter flight information (airline, route, times, class)
3. **Enable "IATA Booking" toggle**
4. Select IATA profile/accreditation
5. Enter PNR (6-char) and ticket number (13-digit)
6. Enter fare breakdown (base fare, taxes)
7. Enter commission amount
8. Upload PNR document/e-ticket
9. System creates:
   - Main booking record
   - Flight booking record
   - IATA tracking record
   - Commission tracking entry

### BSP Reconciliation Workflow

1. **Upload BSP Report** (from IATA BSP Link or GDS)
2. **Run Reconciliation** (matches bookings with BSP data)
3. **Review Mismatches** (investigate discrepancies)
4. **Resolve Issues** (add notes, mark resolved)
5. **Export Reports** (for accounting/audit)

---

## 📊 Reconciliation Features

### Discrepancy Detection

- Fare differences (> $1 tolerance)
- Commission variations
- Missing bookings in BSP
- PNR/ticket number mismatches

### Common Discrepancy Reasons

- Currency conversion differences
- Fare rule changes after booking
- Commission tier adjustments
- Service fees not reflected in BSP
- Credit/debit memo adjustments

### Commission Tracking

- Base commission (0-15% typical)
- Override commission (volume bonuses)
- Incentive commission (performance rewards)
- Status tracking: pending → earned → paid

---

## 🔧 Setup Instructions

### 1. Run Database Migrations

Execute in Supabase SQL Editor:

```sql
-- Run these in order:
-- 1. PNR fields
[packages/database/migrations/0009_booking-pnr-fields.sql]

-- 2. Storage setup
[packages/database/migrations/0009a-bookings-storage.sql]

-- 3. BSP reconciliation tables
[packages/database/migrations/0010_bsp_reconciliation.sql]
```

### 2. Create Storage Buckets

In Supabase Dashboard → Storage:

- Create bucket: `bookings` (for PNR documents)
- Create bucket: `bsp-reports` (for BSP uploads)
- Apply policies from migration 0009a

### 3. Update Navigation

Already done - sidebar includes:

- Bookings (with New Booking button)
- Reconciliation (new page)
- IATA Tracking (existing)
- Daily Sales (existing)
- Agency Insights (existing)

### 4. Configure IATA Profiles

In `/admin/iata-tracking`:

- Add your IATA accreditation(s)
- Set commission rates
- Configure monthly targets
- Add allowed airlines

---

## 📁 Files Created/Modified

### New Files:

1. `apps/admin/app/bookings/new/page.tsx` - Manual booking form
2. `apps/admin/app/reconciliation/page.tsx` - BSP reconciliation dashboard
3. `packages/database/migrations/0009_booking-pnr-fields.sql`
4. `packages/database/migrations/0009a-bookings-storage.sql`
5. `packages/database/migrations/0010_bsp_reconciliation.sql`
6. `docs/BSP_RECONCILIATION.md` - Complete documentation

### Modified Files:

1. `apps/admin/app/bookings/page.tsx` - Added "New Booking" button
2. `apps/admin/components/layout/admin-sidebar.tsx` - Added navigation links

---

## 🎓 Additional Features Available

### Existing in Codebase:

- **Daily Sales Tracking** (`/admin/daily-sales`)
- **Agency Insights** (`/admin/agency-insights`)
- **Partnership Management** (`/admin/partnerships`) - Sub-agents, affiliates, commissions
- **IATA/Non-IATA Tracking** (`/admin/iata-tracking`)
- **Unused Tickets** (`/admin/unused-tickets`)
- **Fare Optimization** (`/admin/fare-optimization`)

### Future Enhancements Possible:

- Automatic BSP file parsing (Edge Function)
- GDS integration (Amadeus, Sabre, Travelport)
- Bank statement auto-reconciliation
- Commission payment automation
- Airline memo dispute workflow
- Multi-currency BSP handling

---

## 💡 Best Practices

### For Manual Bookings:

1. Always enter PNR for flight bookings
2. Upload PNR documents/e-tickets
3. Enable IATA tracking for BSP bookings
4. Accurately split base fare and taxes
5. Record actual commission earned

### For Reconciliation:

1. Upload BSP reports weekly
2. Run reconciliation before month-end close
3. Review all mismatches within 48 hours
4. Document resolution for all discrepancies
5. Export monthly reports for accounting

### For Commission Tracking:

1. Reconcile commissions monthly
2. Track override commissions separately
3. Monitor airline commission rate changes
4. Verify incentive payments
5. Keep 7-year records (IATA requirement)

---

## 📞 Support & Resources

- **Documentation:** `/docs/BSP_RECONCILIATION.md`
- **IATA BSP Info:** https://www.iata.org/bsp
- **Migration Files:** `/packages/database/migrations/`

---

## ✅ Next Steps

1. **Run migrations** in Supabase SQL Editor
2. **Create storage buckets** in Supabase Dashboard
3. **Test manual booking** creation at `/admin/bookings/new`
4. **Upload test BSP report** to verify reconciliation
5. **Configure IATA profiles** with your agency details
6. **Train staff** on reconciliation workflow

---

**Questions?** Check the detailed documentation in `/docs/BSP_RECONCILIATION.md`
