-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0020: Missing admin tables
-- Add payments, unused_tickets, sales_reports tables
-- ========================================

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_ref VARCHAR(50) UNIQUE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50),
    customer_name VARCHAR(200),
    customer_email VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'credit_card',
    status VARCHAR(20) DEFAULT 'pending',
    reference VARCHAR(100),
    notes TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unused tickets table
CREATE TABLE IF NOT EXISTS unused_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    passenger_name VARCHAR(200),
    airline VARCHAR(100),
    route VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    fare DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'unused',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily sales reports table
CREATE TABLE IF NOT EXISTS sales_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255),
    file_path TEXT,
    record_count INTEGER DEFAULT 0,
    total_sales DECIMAL(14,2) DEFAULT 0,
    report_date DATE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on new tables
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE unused_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports DISABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_unused_tickets_status ON unused_tickets(status);
CREATE INDEX IF NOT EXISTS idx_sales_reports_date ON sales_reports(report_date);
