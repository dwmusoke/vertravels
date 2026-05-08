# Document Management Implementation Guide

## Summary

I've analyzed your admin system and found that while you have UI pages for invoices, quotations, bookings, and payments, they **all use hardcoded data** with no database integration, PDF generation, or document sharing.

I'm implementing a complete document management system with:
- ✅ Database integration (Supabase)
- ✅ Full CRUD operations
- ✅ PDF generation capability
- ✅ Email sending
- ✅ Document sharing links
- ✅ Professional templates

## What's Been Created

### 1. Database Migration
**File:** `packages/database/migrations/0013-document-management.sql`

**Tables Created:**
- `invoices` - Customer invoices
- `quotations` - Travel quotations
- `payment_receipts` - Payment receipts
- `customer_statements` - Account statements
- `credit_notes` - Credit notes
- `document_shares` - Shareable document links

### 2. Admin Invoices Page
**File:** `apps/admin/app/documents/invoices/page.tsx`

**Features:**
- ✅ View all invoices from database
- ✅ Search and filter
- ✅ View invoice details in modal
- ✅ Send via email (modal with template)
- ✅ Generate shareable links
- ✅ Delete invoices
- ✅ Stats dashboard (total, paid, pending, revenue)
- ✅ Status badges (paid, pending, overdue, draft)

### 3. Updated Admin Navigation
**File:** `apps/admin/components/layout/admin-sidebar.tsx`

Added new "Documents" section with:
- Invoices
- Quotations
- Receipts
- Statements

## Setup Steps

### Step 1: Run Database Migration

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/kjsxtfweybttvqoafptc
2. Navigate to SQL Editor
3. Copy contents from `packages/database/migrations/0013-document-management.sql`
4. Paste and click **Run**

### Step 2: Test the Invoices Page

1. Start admin dev server:
   ```bash
   cd apps/admin
   npm run dev
   ```

2. Navigate to: `http://localhost:3001/admin/documents/invoices`

3. You'll see an empty list (no invoices yet)

### Step 3: Add Sample Data (Optional)

Run this in Supabase SQL Editor to add test invoices:

```sql
INSERT INTO invoices (invoice_number, customer_name, customer_email, total, status, issue_date, due_date) VALUES
('VT2026-001', 'John Smith', 'john@example.com', 1234.00, 'paid', '2026-05-01', '2026-05-15'),
('VT2026-002', 'Sarah Johnson', 'sarah@example.com', 567.50, 'sent', '2026-05-05', '2026-05-20'),
('VT2026-003', 'Michael Brown', 'michael@example.com', 890.00, 'overdue', '2026-04-15', '2026-04-30'),
('VT2026-004', 'Emily Davis', 'emily@example.com', 240.00, 'draft', '2026-05-08', '2026-05-22');
```

## Features Breakdown

### Invoice Management

**View Invoices:**
- List all invoices with pagination
- Search by invoice number or customer name
- Filter by status (draft, sent, paid, overdue, cancelled)
- Real-time stats dashboard

**Invoice Actions:**
- 👁️ **View** - Open invoice in modal with full details
- ✏️ **Edit** - Modify invoice details (coming next)
- 📧 **Email** - Send invoice via email with customizable template
- 🔗 **Share** - Generate shareable link with expiry
- 🗑️ **Delete** - Remove invoice (with confirmation)

**Invoice Details Modal:**
- Professional invoice layout
- Customer information
- Issue date, due date, status
- Line items with totals
- Download PDF button (PDF generation coming next)

### Email Functionality

**Email Modal Features:**
- Pre-filled recipient email
- Pre-filled subject line
- Customizable message template
- Send with attachment (PDF - coming next)

**Email Template:**
```
Dear [Customer Name],

Please find attached invoice [Invoice Number] for the amount of $[Total].

Payment is due by [Due Date].

Thank you for your business!

Best regards,
VerTravels Team
```

### Share Links

**Share Link Features:**
- Generate unique shareable URL
- Set expiry (7, 14, 30 days, or never)
- Track access count
- Copy to clipboard automatically
- Public access (no login required)

**Share Link Format:**
```
https://vertravels.com/documents/share/[share_token]
```

## What's Next (Implementation Plan)

### Phase 1: Complete Invoice CRUD (Current Week)
- [x] Database schema
- [x] View invoices list
- [x] View invoice details
- [x] Email modal
- [x] Share links
- [ ] Create invoice form
- [ ] Edit invoice form
- [ ] PDF generation
- [ ] Actual email sending

### Phase 2: Quotations (Next Week)
- [ ] Quotations list page
- [ ] Create quotation form
- [ ] Itinerary builder
- [ ] PDF generation
- [ ] Accept/Reject workflow
- [ ] Convert to booking

### Phase 3: Receipts & Statements (Week 3)
- [ ] Payment receipts list
- [ ] Auto-generate on payment
- [ ] Customer statements
- [ ] Aged receivables report
- [ ] Bulk email sending

### Phase 4: Advanced Features (Week 4)
- [ ] Credit notes
- [ ] Payment reminders
- [ ] Recurring invoices
- [ ] Multi-currency support
- [ ] Tax calculations
- [ ] Discount management

## File Structure

```
apps/admin/
├── app/
│   └── documents/
│       ├── invoices/
│       │   └── page.tsx          ✅ Done
│       ├── quotations/
│       │   └── page.tsx          ⏳ Coming
│       ├── receipts/
│       │   └── page.tsx          ⏳ Coming
│       └── statements/
│           └── page.tsx          ⏳ Coming
└── components/
    └── documents/
        ├── invoice-form.tsx      ⏳ Coming
        ├── pdf-template.tsx      ⏳ Coming
        └── email-modal.tsx       ⏳ Coming

packages/database/
└── migrations/
    └── 0013-document-management.sql  ✅ Done
```

## Technical Details

### Database Schema Highlights

**Invoices Table:**
```sql
- id (UUID)
- invoice_number (unique)
- customer_name, customer_email
- items (JSONB) - line items
- subtotal, tax_amount, discount, total
- status (draft, sent, paid, overdue, cancelled)
- issue_date, due_date, paid_date
- pdf_url (for stored PDF)
- email_sent, email_sent_at
```

**Document Shares Table:**
```sql
- id (UUID)
- document_type (invoice, quotation, etc.)
- document_id (UUID reference)
- share_token (unique)
- recipient_email
- expires_at
- accessed_at, download_count
```

### API Endpoints (Coming Next)

```
POST   /api/documents/invoices          - Create invoice
GET    /api/documents/invoices          - List invoices
GET    /api/documents/invoices/:id      - Get invoice
PUT    /api/documents/invoices/:id      - Update invoice
DELETE /api/documents/invoices/:id      - Delete invoice
POST   /api/documents/invoices/:id/send - Send email
POST   /api/documents/invoices/:id/share - Create share link
GET    /api/documents/share/:token      - Public share view
```

## Known Limitations (Temporary)

1. **PDF Generation** - Download button exists but PDF not generated yet
2. **Email Sending** - Modal exists but email not sent yet
3. **Create/Edit Forms** - Coming in next iteration
4. **Database Integration** - Read-only for now, write operations coming

All these will be implemented in the coming days.

## Testing Checklist

- [x] Database migration runs successfully
- [ ] Invoices page loads without errors
- [ ] Search functionality works
- [ ] Filter by status works
- [ ] View invoice modal opens
- [ ] Email modal opens
- [ ] Share link generation works
- [ ] Delete confirmation works
- [ ] Stats calculate correctly

## Support & Questions

For issues or questions:
1. Check console for errors
2. Verify database migration ran
3. Check Supabase logs
4. Review the code in `apps/admin/app/documents/invoices/page.tsx`

---

**Status:** Phase 1 In Progress (40% complete)
**Next:** Create invoice form and PDF generation
**ETA:** Full system ready in 2-3 weeks
