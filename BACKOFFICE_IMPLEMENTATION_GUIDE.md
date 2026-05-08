# Backoffice & Mid-Office Implementation Guide

## ✅ **Phase 1 Complete - Core Infrastructure**

Your VerTravels system now has a complete backoffice and mid-office foundation with support for both:
- ✅ **PNR Ingestion** (automated from BSP/airline files)
- ✅ **Manual Postings** (staff entry for phone/email/walk-in)

---

## 📋 **What's Been Implemented**

### **1. Database Schema (15 New Tables)**

**Migration:** `packages/database/migrations/0014-backoffice-midoffice.sql`

#### **Ticketing System**
- `ticket_stock` - Airline ticket inventory management
- `tickets` - Issued tickets with full details
- `emd_documents` - Electronic Miscellaneous Documents

#### **Queue Management**
- `queue_definitions` - GDS queue configurations
- `queue_items` - PNRs in queue for processing
- `queue_processing_history` - Audit trail

#### **Booking Workflow**
- `workflow_statuses` - 12 predefined statuses (inquiry → completed)
- `booking_workflow` - Lifecycle tracking per booking
- `workflow_history` - Status change audit

#### **Operations**
- `manual_postings` - Manually entered bookings
- `pnr_ingestion_batches` - Batch upload tracking
- `pnr_ingestion_records` - Individual PNR records
- `supplier_confirmations` - Supplier tracking
- `vouchers` - Voucher generation
- `refund_requests` - Refund processing
- `auto_ticketing_rules` - Automation rules

---

### **2. New Admin Pages**

#### **PNR Ingestion** (`/admin/pnr-ingestion`)

**Features:**
- ✅ Upload CSV files with PNR data
- ✅ Batch processing with progress tracking
- ✅ Automatic duplicate detection
- ✅ Success/error counting
- ✅ Individual record status tracking
- ✅ Automatic booking creation

**File Format (CSV):**
```csv
PNR,TicketNumber,PassengerName,AirlineCode,FlightDate,Route,Fare,Tax,Commission,Total
ABC123,1762345678901,SMITH/JOHN,AA,2026-06-15,EBB-LHR,1200,150,144,1494
DEF456,1762345678902,JONES/MARY,EK,2026-06-20,NBO-DXB,800,100,96,996
```

**How It Works:**
1. Upload CSV file → Creates batch
2. Parse records → Store in `pnr_ingestion_records`
3. Click "Process" → Check for duplicates
4. Create bookings for new PNRs
5. Update status (success/error/duplicate)

**Stats Dashboard:**
- Total batches
- Pending/Completed
- Total records
- Success/Error counts

---

#### **Manual Postings** (`/admin/manual-postings`)

**Features:**
- ✅ Manual booking entry form
- ✅ Support for flights, hotels, tours, cars, visa
- ✅ Financial tracking (fare, tax, commission)
- ✅ Verification workflow (draft → pending → verified)
- ✅ Search and filter
- ✅ Edit and delete
- ✅ Commission tracking

**Workflow:**
```
1. Staff creates posting → DRAFT
2. Submits for review → PENDING
3. Supervisor verifies → VERIFIED
4. Posts to system → POSTED
```

**Form Fields:**
- Posting type (flight/hotel/tour/car/visa)
- PNR and ticket number
- Passenger name
- Route description
- Travel date
- Financial details (fare, tax, commission)
- Notes

**Stats Dashboard:**
- Total postings
- Draft/Pending/Verified counts
- Total amount
- Total commission

---

### **3. Updated Navigation**

New **"Operations"** section in admin sidebar:
- 📤 PNR Ingestion
- 📝 Manual Postings
- ⏰ Queue Management (coming next)
- 🎫 Ticketing (coming next)

---

## 🚀 **Setup Instructions**

### **Step 1: Run Database Migration**

```bash
# In Supabase Dashboard → SQL Editor
# Copy and run: packages/database/migrations/0014-backoffice-midoffice.sql
```

This creates all 15 tables with:
- Indexes for performance
- Foreign key relationships
- Default workflow statuses
- Comments for documentation

### **Step 2: Create Storage Bucket**

For PNR file uploads:

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('pnr-ingestion', 'pnr-ingestion', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated users to upload PNR files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pnr-ingestion');

CREATE POLICY "Allow authenticated users to view PNR files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'pnr-ingestion');
```

### **Step 3: Test PNR Ingestion**

1. Create a test CSV file:
```csv
PNR,TicketNumber,PassengerName,AirlineCode,FlightDate,Route,Fare,Tax,Commission,Total
TEST01,,TEST/PASSENGER,AA,2026-06-15,EBB-LHR,1200,150,144,1494
TEST02,,TEST/PASSENGER2,EK,2026-06-20,NBO-DXB,800,100,96,996
```

2. Navigate to `/admin/pnr-ingestion`
3. Click "Upload PNR File"
4. Select your CSV file
5. Click "Process" on the batch
6. Verify bookings were created in database

### **Step 4: Test Manual Postings**

1. Navigate to `/admin/manual-postings`
2. Click "New Posting"
3. Fill in the form:
   - Type: Flight
   - PNR: MANUAL01
   - Passenger: SMITH/JOHN
   - Route: EBB → LHR
   - Travel Date: 2026-06-15
   - Fare: 1200
   - Tax: 150
   - Commission: 144
4. Click "Create Posting"
5. Verify it appears in the list
6. Click "Verify" to approve

---

## 📊 **Workflow Examples**

### **Example 1: PNR Ingestion from BSP**

**Scenario:** Daily BSP report upload

1. Download BSP report from airline portal (CSV format)
2. Go to `/admin/pnr-ingestion`
3. Upload BSP file
4. System creates batch with all PNRs
5. Review records in batch
6. Click "Process"
7. System:
   - Checks for duplicates
   - Creates new bookings
   - Links PNRs to bookings
   - Tracks success/failure
8. Review results:
   - ✅ 45 successful
   - ⚠️ 3 duplicates (already in system)
   - ❌ 2 errors (data issues)
9. Fix errors and re-process if needed

### **Example 2: Manual Phone Booking**

**Scenario:** Customer calls to book flight

1. Customer calls: "I need a flight to London next week"
2. Staff goes to `/admin/manual-postings`
3. Clicks "New Posting"
4. Enters details:
   - Type: Flight
   - PNR: ABC123 (from GDS)
   - Passenger: JOHN/SMITH
   - Route: EBB → LHR
   - Date: 2026-06-15
   - Fare: $1,200
   - Tax: $150
   - Commission: $144
5. Saves as "Draft"
6. Supervisor reviews and clicks "Verify"
7. Booking moves to "Verified" status
8. Can now be ticketed (Phase 2)

### **Example 3: Walk-in Customer**

**Scenario:** Customer visits office for hotel booking

1. Customer walks in: "Need hotel in Dubai"
2. Staff creates manual posting:
   - Type: Hotel
   - No PNR yet
   - Passenger: WALKIN/CUSTOMER
   - Route: Serena Hotel Dubai
   - Date: 2026-06-20
   - Fare: $500 (hotel cost)
   - Tax: $50
   - Commission: $50
3. Takes payment
4. Marks as "Verified"
5. Books with supplier
6. Updates with actual PNR/confirmation

---

## 🔄 **Integration with Existing Systems**

### **BSP Reconciliation**

The PNR ingestion integrates with existing BSP reconciliation:

```sql
-- PNRs ingested can be matched with BSP reports
SELECT 
  p.pnr,
  p.passenger_name,
  p.total as ingested_amount,
  b.total_sales as bsp_amount,
  p.total - b.total_sales as difference
FROM pnr_ingestion_records p
LEFT JOIN bsp_line_items b ON p.pnr = b.pnr
WHERE p.status = 'success';
```

### **Commission Tracking**

Manual postings and PNR ingestion both track commission:

```sql
-- Total commission earned
SELECT 
  SUM(commission) as total_commission,
  COUNT(*) as total_bookings
FROM manual_postings
WHERE status = 'verified';

-- Commission from PNR ingestion
SELECT 
  SUM(commission) as total_commission,
  COUNT(*) as total_bookings
FROM pnr_ingestion_records
WHERE status = 'success';
```

### **Booking Workflow**

Once PNRs are ingested or manually posted, they can enter the workflow:

```sql
-- Create workflow entry for booking
INSERT INTO booking_workflow (booking_id, current_status, assigned_agent)
SELECT 
  id,
  'booked',
  NULL
FROM bookings
WHERE pnr IN (
  SELECT pnr FROM pnr_ingestion_records WHERE status = 'success'
);
```

---

## 📈 **Next Phases**

### **Phase 2: Queue Management** (Next Week)
- [ ] Queue monitoring interface
- [ ] GDS integration (Amadeus/Sabre/Travelport)
- [ ] Automated queue processing
- [ ] SLA tracking
- [ ] Queue assignment to agents

### **Phase 3: Ticketing** (Week 3)
- [ ] Ticket issuance interface
- [ ] E-ticket generation
- [ ] EMD handling
- [ ] Auto-ticketing rules
- [ ] Ticket stock management
- [ ] Void/refund processing

### **Phase 4: Automation** (Week 4)
- [ ] Automated reminders
- [ ] Time limit monitoring
- [ ] Payment deadline alerts
- [ ] Confirmation follow-ups
- [ ] Voucher generation
- [ ] Manifest creation

---

## 🎯 **Key Benefits**

### **For Operations Team**

1. **Centralized Data Entry**
   - All bookings in one system
   - No more spreadsheets
   - Full audit trail

2. **Quality Control**
   - Verification workflow
   - Duplicate detection
   - Error tracking

3. **Efficiency**
   - Batch processing
   - Automated booking creation
   - Commission tracking

### **For Management**

1. **Visibility**
   - Real-time stats dashboard
   - Success/error rates
   - Commission tracking

2. **Control**
   - Verification workflow
   - Audit trail
   - User assignment

3. **Reporting**
   - Daily/weekly/monthly reports
   - Agent performance
   - Revenue tracking

### **For Finance**

1. **Accurate Tracking**
   - All commissions recorded
   - Fare and tax breakdown
   - Payment status

2. **Reconciliation**
   - Match with BSP reports
   - Identify discrepancies
   - Track supplier payments

---

## 🔧 **Technical Details**

### **Database Indexes**

All critical fields are indexed for performance:
- `tickets(ticket_number)`
- `tickets(booking_id)`
- `queue_items(status)`
- `queue_items(pnr)`
- `booking_workflow(current_status)`
- `manual_postings(status)`
- `pnr_ingestion_batches(status)`

### **Security**

- All tables require authentication
- Row-level security can be added per user role
- Audit trail for all changes
- File uploads restricted to authenticated users

### **API Endpoints** (Future)

```typescript
// PNR Ingestion
POST   /api/pnr/ingest          - Upload and process file
GET    /api/pnr/batches         - List batches
GET    /api/pnr/batches/:id     - Get batch details
POST   /api/pnr/batches/:id/process - Process batch

// Manual Postings
POST   /api/postings            - Create posting
GET    /api/postings            - List postings
PUT    /api/postings/:id        - Update posting
DELETE /api/postings/:id        - Delete posting
POST   /api/postings/:id/verify - Verify posting
```

---

## 📝 **Best Practices**

### **Data Entry**

1. **Always verify before posting**
   - Review all details
   - Check for duplicates
   - Confirm pricing

2. **Use consistent formats**
   - Passenger names: LASTNAME/FIRSTNAME
   - Routes: ORIGIN → DESTINATION
   - Dates: YYYY-MM-DD

3. **Add detailed notes**
   - Special requests
   - Contact preferences
   - Payment arrangements

### **Batch Processing**

1. **Upload daily**
   - Process BSP reports daily
   - Don't let batches accumulate
   - Review errors immediately

2. **Monitor success rates**
   - Target: >95% success
   - Investigate errors
   - Fix data quality issues

3. **Keep backups**
   - Export batches regularly
   - Archive processed files
   - Maintain audit trail

---

## 🆘 **Troubleshooting**

### **PNR Upload Fails**

**Problem:** File upload error

**Solutions:**
1. Check file format (must be CSV)
2. Verify column headers match expected format
3. Check file size (max 10MB)
4. Ensure storage bucket exists

### **Duplicate PNRs**

**Problem:** PNR already exists in system

**Solutions:**
1. Check if booking was already created
2. Review duplicate in ingestion records
3. If valid duplicate, merge bookings
4. Update ingestion record status

### **Manual Posting Won't Verify**

**Problem:** Verification button disabled

**Solutions:**
1. Check all required fields are filled
2. Ensure posting is in "pending" status
3. Verify user has permission
4. Check for validation errors

---

## 📞 **Support**

For questions or issues:
1. Check `BACKOFFICE_MIDOFFICE_AUDIT.md` for system overview
2. Review database schema comments
3. Check Supabase logs for errors
4. Contact development team

---

**Status:** ✅ Phase 1 Complete
**Next:** Phase 2 - Queue Management
**Production Ready:** Yes (for manual postings and PNR ingestion)
