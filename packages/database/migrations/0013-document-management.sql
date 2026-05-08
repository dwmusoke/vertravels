-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0013: Document Management
-- Invoices, Quotations, Receipts, Statements
-- ========================================

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES auth_users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'draft',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    terms TEXT,
    pdf_url VARCHAR(500),
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES auth_users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    destination VARCHAR(255),
    travel_date DATE,
    duration_days INTEGER,
    passengers INTEGER DEFAULT 1,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'draft',
    valid_until DATE NOT NULL,
    notes TEXT,
    terms TEXT,
    pdf_url VARCHAR(500),
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    converted_to_booking_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Receipts table
CREATE TABLE IF NOT EXISTS payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    invoice_id UUID REFERENCES invoices(id),
    customer_id UUID REFERENCES auth_users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_id VARCHAR(255),
    reference_number VARCHAR(100),
    notes TEXT,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Statements table
CREATE TABLE IF NOT EXISTS customer_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth_users(id) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    statement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    closing_balance DECIMAL(15,2) DEFAULT 0,
    transactions JSONB NOT NULL DEFAULT '[]'::jsonb,
    pdf_url VARCHAR(500),
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Notes table
CREATE TABLE IF NOT EXISTS credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    customer_id UUID REFERENCES auth_users(id) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    pdf_url VARCHAR(500),
    applied_to_invoice_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Shares table (for sharing links)
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(50) NOT NULL,
    document_id UUID NOT NULL,
    share_token VARCHAR(100) UNIQUE NOT NULL,
    recipient_email VARCHAR(255),
    message TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    accessed_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_receipts_number ON payment_receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_statements_customer ON customer_statements(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_number ON credit_notes(credit_number);
CREATE INDEX IF NOT EXISTS idx_shares_token ON document_shares(share_token);

-- Comments
COMMENT ON TABLE invoices IS 'Customer invoices with PDF generation support';
COMMENT ON TABLE quotations IS 'Travel quotations/estimates with itinerary';
COMMENT ON TABLE payment_receipts IS 'Payment receipts auto-generated on payment';
COMMENT ON TABLE customer_statements IS 'Periodic customer account statements';
COMMENT ON TABLE credit_notes IS 'Credit notes for refunds/adjustments';
COMMENT ON TABLE document_shares IS 'Shareable links for documents';
