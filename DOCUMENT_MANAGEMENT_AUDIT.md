# Document Management System Audit & Implementation Plan

## Current State Analysis

### ✅ What Exists
- Basic UI pages for Invoices, Quotations, Bookings, Payments (in `/dashboard`)
- Hardcoded data arrays (no database integration)
- Modal components for viewing documents
- Download/Send buttons (non-functional)
- Basic CRUD UI elements

### ❌ Critical Gaps

#### 1. **No Database Integration**
- All data is hardcoded in frontend
- No Create/Update/Delete operations connected to backend
- No real-time data synchronization
- Admin panel separate from customer dashboard

#### 2. **No PDF Generation**
- Download PDF buttons exist but don't work
- No PDF library installed
- No professional invoice/quotation templates
- No branding on documents

#### 3. **No Email/Document Sharing**
- Send email buttons are non-functional
- No email template system integration
- No document sharing links
- No client portal access

#### 4. **Missing Features**
- ❌ Customer Statements (aged receivables)
- ❌ Credit Notes
- ❌ Payment Receipts
- ❌ Bulk document generation
- ❌ Document versioning
- ❌ Approval workflows
- ❌ Automated reminders

#### 5. **No Admin Centralization**
- Invoices in `/dashboard/invoices` (web app)
- Admin panel at `/admin` has no document management
- Inconsistent UX between admin and customer views

---

## Required Implementation

### Phase 1: Database Schema (Missing Tables)

```sql
-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE,
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES auth_users(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    items JSONB, -- [{description, quantity, unit_price, total}]
    subtotal DECIMAL(15,2),
    tax_rate DECIMAL(5,2),
    tax_amount DECIMAL(15,2),
    discount DECIMAL(15,2),
    total DECIMAL(15,2),
    currency VARCHAR(3),
    status VARCHAR(20), -- draft, sent, paid, overdue, cancelled
    issue_date DATE,
    due_date DATE,
    paid_date DATE,
    notes TEXT,
    terms TEXT,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Quotations
CREATE TABLE quotations (
    id UUID PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE,
    customer_id UUID REFERENCES auth_users(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    destination VARCHAR(255),
    travel_date DATE,
    duration_days INTEGER,
    passengers INTEGER,
    items JSONB, -- [{type, description, quantity, unit_price, total}]
    subtotal DECIMAL(15,2),
    tax_amount DECIMAL(15,2),
    total DECIMAL(15,2),
    currency VARCHAR(3),
    status VARCHAR(20), -- draft, sent, accepted, rejected, expired
    valid_until DATE,
    notes TEXT,
    terms TEXT,
    pdf_url VARCHAR(500),
    converted_to_booking_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Customer Statements
CREATE TABLE customer_statements (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES auth_users(id),
    statement_date DATE,
    period_start DATE,
    period_end DATE,
    opening_balance DECIMAL(15,2),
    closing_balance DECIMAL(15,2),
    transactions JSONB, -- [{date, type, reference, description, debit, credit, balance}]
    pdf_url VARCHAR(500),
    created_at TIMESTAMP
);

-- Payment Receipts
CREATE TABLE payment_receipts (
    id UUID PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE,
    payment_id UUID REFERENCES bookings(payment_id),
    invoice_id UUID REFERENCES invoices(id),
    customer_id UUID REFERENCES auth_users(id),
    amount DECIMAL(15,2),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    transaction_id VARCHAR(255),
    notes TEXT,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP
);

-- Credit Notes
CREATE TABLE credit_notes (
    id UUID PRIMARY KEY,
    credit_number VARCHAR(50) UNIQUE,
    invoice_id UUID REFERENCES invoices(id),
    customer_id UUID REFERENCES auth_users(id),
    amount DECIMAL(15,2),
    reason TEXT,
    status VARCHAR(20), -- draft, issued, applied, cancelled
    pdf_url VARCHAR(500),
    created_at TIMESTAMP
);

-- Document Sharing Links
CREATE TABLE document_shares (
    id UUID PRIMARY KEY,
    document_type VARCHAR(50), -- invoice, quotation, receipt, statement
    document_id UUID,
    share_token VARCHAR(100) UNIQUE,
    recipient_email VARCHAR(255),
    expires_at TIMESTAMP,
    accessed_at TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP
);
```

### Phase 2: PDF Generation System

**Required Libraries:**
```json
{
  "dependencies": {
    "@react-pdf/renderer": "^3.4.0",
    "react-to-pdf": "^1.0.1"
  }
}
```

**PDF Templates Needed:**
1. Invoice Template (professional, branded)
2. Quotation Template (with itinerary)
3. Booking Confirmation (with PNR)
4. Payment Receipt
5. Customer Statement
6. Credit Note

### Phase 3: Email Integration

**Required:**
- Email templates in database (already exists in migration 0008)
- Integration with email service (Resend/SendGrid)
- Document attachment functionality
- Email tracking (opened, clicked)

### Phase 4: Admin Document Management

**New Admin Pages:**
- `/admin/documents/invoices` - Full CRUD
- `/admin/documents/quotations` - Full CRUD
- `/admin/documents/statements` - Generate & send
- `/admin/documents/receipts` - Auto-generate on payment
- `/admin/documents/credit-notes` - Create & apply
- `/admin/documents/templates` - Customize PDF templates

### Phase 5: Client Portal

**Customer Features:**
- View all invoices
- Download PDFs
- Pay invoices online
- View quotations
- Accept/reject quotations
- Download statements
- View payment history
- Download receipts

---

## Implementation Priority

### Week 1: Core Infrastructure
- [ ] Database migrations
- [ ] PDF generation library
- [ ] Email service integration
- [ ] Base PDF templates

### Week 2: Invoice System
- [ ] Admin invoice CRUD
- [ ] PDF generation
- [ ] Email sending
- [ ] Payment tracking
- [ ] Client view

### Week 3: Quotation System
- [ ] Admin quotation CRUD
- [ ] Itinerary builder
- [ ] PDF generation
- [ ] Accept/reject workflow
- [ ] Convert to booking

### Week 4: Statements & Receipts
- [ ] Auto-generate statements
- [ ] Payment receipt generation
- [ ] Credit notes
- [ ] Bulk email sending

### Week 5: Advanced Features
- [ ] Document sharing links
- [ ] Expiry tracking
- [ ] Automated reminders
- [ ] Reporting & analytics

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Admin Panel                        │
│  /admin/documents/*                                 │
│  - Full CRUD operations                             │
│  - PDF generation                                   │
│  - Email sending                                    │
│  - Bulk operations                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│               API Layer (Next.js)                   │
│  /api/documents/*                                   │
│  - Create/Read/Update/Delete                        │
│  - PDF generation endpoints                         │
│  - Email sending endpoints                          │
│  - File upload (Supabase Storage)                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Database (Supabase)                    │
│  - invoices, quotations, statements                 │
│  - payment_receipts, credit_notes                   │
│  - document_shares                                  │
│  - Email templates                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              External Services                      │
│  - Supabase Storage (PDFs)                          │
│  - Email Service (Resend/SendGrid)                  │
│  - Payment Gateway (Stripe/Flutterwave)             │
└─────────────────────────────────────────────────────┘
```

---

## File Structure

```
apps/admin/
├── app/
│   └── documents/
│       ├── invoices/
│       │   └── page.tsx
│       ├── quotations/
│       │   └── page.tsx
│       ├── statements/
│       │   └── page.tsx
│       ├── receipts/
│       │   └── page.tsx
│       └── templates/
│           └── page.tsx
├── components/
│   └── documents/
│       ├── invoice-form.tsx
│       ├── quotation-form.tsx
│       ├── pdf-preview.tsx
│       └── email-modal.tsx
└── lib/
    └── documents/
        ├── pdf-generator.ts
        ├── email-sender.ts
        └── templates/

apps/web/
├── app/
│   └── dashboard/
│       └── documents/
│           ├── page.tsx (client portal)
│           └── [type]/
│               └── [id]/
│                   └── page.tsx (public share)
└── components/
    └── documents/
        └── pdf-templates/

packages/
└── documents/
    ├── templates/
    │   ├── invoice-template.tsx
    │   ├── quotation-template.tsx
    │   └── receipt-template.tsx
    └── utils/
        ├── generate-pdf.ts
        └── send-email.ts
```

---

## Next Steps

1. **Immediate (Today)**
   - Create database migration for document tables
   - Install PDF generation libraries
   - Set up email service

2. **This Week**
   - Build admin invoice management
   - Create PDF templates
   - Implement email sending

3. **Next Week**
   - Build quotation system
   - Add client portal
   - Implement sharing links

Would you like me to proceed with implementing this complete document management system?
