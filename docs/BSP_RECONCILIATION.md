# BSP Reconciliation & Commission Management

## Overview

VerTravels now includes comprehensive BSP (Billing and Settlement Plan) reconciliation capabilities for travel agencies to match their internal bookings with BSP/IATA reports, track commissions, and manage airline settlements.

## Features

### 1. BSP Report Upload

**Access:** `/admin/reconciliation` → "Upload BSP Report"

Upload monthly BSP reports from:

- IATA BSP Link
- Airline GDS (Amadeus, Sabre, Travelport)
- BSP Direct Connect

**Supported Formats:**

- CSV (Comma-separated values)
- Excel (.xlsx, .xls)
- TXT (Fixed-width or tab-delimited)

**Report Data Extracted:**

- Document numbers
- PNRs and ticket numbers
- Passenger names
- Fare breakdown (base, taxes, total)
- Commission amounts
- Airline codes
- Issue and travel dates

### 2. Automatic Reconciliation

**Access:** `/admin/reconciliation` → "Run Reconciliation"

The system automatically matches:

- Your internal flight bookings ↔ BSP line items
- Matching criteria: PNR, ticket number, or document number
- Amount validation: Compares fares and commissions
- Status assignment:
  - ✅ **Matched** - Amounts within $1 tolerance
  - ❌ **Mismatch** - Amount differences detected
  - ⏳ **Pending** - Awaiting BSP data
  - ⚠️ **Missing in BSP** - Not found in BSP reports

### 3. Discrepancy Management

**Common Discrepancies:**

- Fare differences (currency conversion, fare changes)
- Commission rate variations
- Tax calculation differences
- Service fees not reflected in BSP
- Credit/debit memo adjustments

**Resolution Workflow:**

1. Review mismatched items
2. Investigate cause (fare rules, commission tiers, memos)
3. Add resolution notes
4. Mark as resolved
5. Export discrepancy report for accounting

### 4. Commission Tracking

**Access:** `/admin/iata-tracking`

**Commission Types Tracked:**

- **Base Commission** - Standard airline commission (0-15%)
- **Override Commission** - Additional commission based on volume targets
- **Incentive Commission** - Performance bonuses from airlines
- **Service Fees** - Customer service charges (non-commissionable)

**Commission Statuses:**

- Pending - Booking made, commission not yet earned
- Earned - Ticket flown, commission eligible
- Paid - Commission received from airline
- Cancelled - Booking cancelled/refunded

### 5. Credit & Debit Memos

**Access:** `/admin/reconciliation/memos`

**Credit Memos (ADM - Agent Debit Memo):**

- Refunds from airlines
- Commission adjustments
- Fare difference refunds
- Goodwill credits

**Debit Memos:**

- Additional charges from airlines
- Commission clawbacks
- Penalty fees
- Fare rule violations

**Memo Management:**

- Track memo status (pending, approved, paid, disputed)
- Link to original bookings
- Dispute management workflow
- Expiry date tracking

### 6. BSP Settlement Tracking

**Access:** `/admin/reconciliation/settlements`

**Settlement Cycle:**

- Weekly or monthly BSP cycles
- Bank draft dates
- Payment reconciliation

**Settlement Report Includes:**

- Total sales volume
- Total commission earned
- Taxes collected
- Bank charges
- Net settlement amount
- Payment status

## Database Schema

### Key Tables

```
bsp_reports
├── id
├── report_id (unique BSP report identifier)
├── agency_iata_code
├── period_start / period_end
├── airline_code
├── total_sales
├── total_commission
├── total_tax
├── booking_count
├── file_url (uploaded file)
└── status (pending, processed, reconciled)

bsp_line_items
├── id
├── bsp_report_id
├── document_number
├── pnr
├── ticket_number
├── airline_code
├── passenger_name
├── total_fare
├── base_fare
├── taxes
├── commission
└── issue_date / travel_date

bsp_reconciliation
├── id
├── booking_id (our system)
├── bsp_line_item_id (BSP data)
├── status (matched, mismatch, pending)
├── our_amount
├── bsp_amount
├── difference
├── our_commission
├── bsp_commission
├── commission_difference
├── discrepancy_reason
├── resolution
└── reconciled_at / reconciled_by

airline_memos
├── id
├── memo_type (credit_memo / debit_memo)
├── memo_number
├── airline_code
├── amount
├── reason_code / reason_description
├── related_pnr / related_ticket
├── booking_id
├── status
├── disputed
└── resolved_date

bsp_settlements
├── id
├── settlement_period_start / end
├── settlement_date
├── iata_code
├── total_sales
├── total_commission
├── total_tax
├── bank_charges
├── net_amount
├── payment_status
├── payment_reference
└── reconciliation_status

commission_tracking
├── id
├── booking_id
├── airline_code
├── iata_profile_id
├── base_commission
├── override_commission
├── incentive_commission
├── total_commission
├── status (pending, earned, paid)
├── earned_date
└── paid_date
```

## Usage Guide

### Step 1: Upload BSP Report

1. Navigate to `/admin/reconciliation`
2. Click "Upload BSP Report"
3. Select reporting period (month)
4. Upload BSP file (CSV/Excel/TXT)
5. System processes and creates line items

### Step 2: Run Reconciliation

1. Set date range for reconciliation
2. Click "Run Reconciliation"
3. System matches bookings with BSP data
4. Review results:
   - Matched count
   - Mismatch count
   - Total discrepancy amount

### Step 3: Review Mismatches

1. Filter by status = "mismatch"
2. Click "Review" on each item
3. Investigate discrepancy:
   - Check fare rules
   - Verify commission rates
   - Look for related memos
   - Compare currency rates
4. Add resolution notes
5. Mark as resolved

### Step 4: Export Reports

1. Click "Export Report"
2. Select format (JSON, CSV, PDF)
3. Download includes:
   - Summary statistics
   - All matched items
   - All mismatches with reasons
   - Pending items list

### Step 5: Track Commissions

1. Navigate to `/admin/iata-tracking`
2. View commission dashboard:
   - Total earned
   - Pending vs paid
   - By airline
   - By agent
3. Export commission reports for accounting

## BSP Report Format Examples

### CSV Format

```csv
DocumentNumber,PNR,TicketNumber,AirlineCode,PassengerName,TotalFare,BaseFare,Taxes,Commission,IssueDate,TravelDate
0162345678901,ABC123,1762345678901,EK,JOHN/DOE MR,1250.00,1000.00,250.00,50.00,2024-01-15,2024-02-01
```

### Excel Columns

| Column | Description     |
| ------ | --------------- |
| A      | Document Number |
| B      | PNR             |
| C      | Ticket Number   |
| D      | Airline Code    |
| E      | Passenger Name  |
| F      | Total Fare      |
| G      | Base Fare       |
| H      | Taxes           |
| I      | Commission      |
| J      | Issue Date      |
| K      | Travel Date     |

## Integration with Manual Booking

When creating manual flight bookings (`/admin/bookings/new`):

1. **Enable IATA Tracking** checkbox
2. Select IATA profile/accreditation
3. Enter:
   - Airline PNR (6 characters)
   - Ticket number (13 digits)
   - Airline code (e.g., EK, QR, BA)
   - Base fare amount
   - Tax amount
   - Commission amount
4. System creates:
   - Main booking record
   - Flight booking record
   - IATA tracking record
   - Commission tracking entry

## Best Practices

### 1. Regular Reconciliation

- Run weekly for current period
- Reconcile previous month within 5 days of close
- Review all mismatches within 48 hours

### 2. Documentation

- Always add notes to discrepancies
- Link credit/debit memos to bookings
- Keep BSP reports for 7 years (IATA requirement)

### 3. Commission Audit

- Reconcile commissions monthly
- Track override commissions separately
- Monitor airline commission rate changes
- Verify incentive payments

### 4. Discrepancy Resolution

- Common causes:
  - Currency conversion differences
  - Fare rule changes after booking
  - Commission tier adjustments
  - Service fees not in BSP
- Create standard resolution codes:
  - CURR_DIFF - Currency conversion
  - FARE_CHANGE - Post-booking fare adjustment
  - COMM_TIER - Commission tier change
  - SVC_FEE - Service fee difference
  - MEMO_ADJ - Memo adjustment

### 5. Bank Reconciliation

- Match BSP settlements to bank statements
- Track bank charges separately
- Reconcile net amounts (not gross)
- Monitor outstanding settlements

## Reports Available

1. **BSP Reconciliation Summary** - Overall matching statistics
2. **Discrepancy Report** - All mismatches with reasons
3. **Commission Report** - Earned vs paid by airline
4. **Aging Report** - Unreconciled items by age
5. **Airline Settlement Report** - By airline code
6. **Memo Tracking Report** - Credit/debit memo status
7. **Bank Settlement Report** - BSP payment tracking

## Setup Requirements

### Database Migration

Run: `packages/database/migrations/0010_bsp_reconciliation.sql`

### Storage Bucket

Create Supabase storage bucket: `bsp-reports`

### Environment Variables

```env
# BSP Integration
BSP_UPLOAD_ENABLED=true
BSP_AUTO_RECONCILE=false  # Set true for automatic reconciliation
BSP_DISCREPANCY_THRESHOLD=1.00  # Tolerance in USD
```

### User Permissions

- `bsp.reports.upload` - Upload BSP reports
- `bsp.reconciliation.run` - Run reconciliation
- `bsp.reconciliation.resolve` - Resolve discrepancies
- `bsp.settlements.manage` - Manage settlements
- `commission.view` - View commission data
- `commission.export` - Export commission reports

## Support

For BSP reconciliation issues:

- Email: support@vertravels.com
- Documentation: `/docs/BSP_RECONCILIATION.md`
- IATA BSP Help: https://www.iata.org/bsp
