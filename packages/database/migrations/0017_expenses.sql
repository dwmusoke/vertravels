-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0017: Expenses Management
-- PostgreSQL (Supabase)
-- ========================================

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_number VARCHAR(20) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- office_supplies, travel, utilities, software, marketing, payroll, maintenance, other
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    expense_date DATE NOT NULL,
    vendor_name VARCHAR(255),
    payment_method VARCHAR(50), -- cash, bank_transfer, credit_card, debit_card, mobile_money, other
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, paid, cancelled
    paid_date DATE,
    receipt_url VARCHAR(500),
    notes TEXT,
    approved_by UUID,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON expenses(vendor_name);

COMMENT ON TABLE expenses IS 'Company expenses tracking';
COMMENT ON COLUMN expenses.category IS 'Category: office_supplies, travel, utilities, software, marketing, payroll, maintenance, other';
COMMENT ON COLUMN expenses.status IS 'Status: pending, approved, paid, cancelled';
