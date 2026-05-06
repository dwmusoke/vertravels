-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0010: BSP Reconciliation Tables
-- PostgreSQL (Supabase)
-- ========================================

-- BSP Reports table (uploaded from BSP/IATA portals)
CREATE TABLE IF NOT EXISTS bsp_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) UNIQUE NOT NULL,
    agency_iata_code VARCHAR(10) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    airline_code VARCHAR(3),
    total_sales DECIMAL(15,2) NOT NULL,
    total_commission DECIMAL(15,2) NOT NULL,
    total_tax DECIMAL(15,2) NOT NULL,
    booking_count INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    file_url VARCHAR(500),
    uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id),
    status VARCHAR(20) DEFAULT 'pending',
    processed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BSP Line Items (individual bookings from BSP reports)
CREATE TABLE IF NOT EXISTS bsp_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bsp_report_id UUID REFERENCES bsp_reports(id) ON DELETE CASCADE,
    document_number VARCHAR(50) NOT NULL,
    pnr VARCHAR(10),
    ticket_number VARCHAR(20),
    airline_code VARCHAR(3) NOT NULL,
    agent_code VARCHAR(10),
    issue_date DATE,
    document_date DATE,
    travel_date DATE,
    passenger_name VARCHAR(100),
    fare_basis VARCHAR(20),
    total_fare DECIMAL(15,2) NOT NULL,
    base_fare DECIMAL(15,2) NOT NULL,
    taxes DECIMAL(15,2) NOT NULL,
    commission DECIMAL(15,2) NOT NULL,
    net_remit DECIMAL(15,2),
    payment_method VARCHAR(20),
    endorsement VARCHAR(100),
    tour_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BSP Reconciliation (matching our bookings with BSP data)
CREATE TABLE IF NOT EXISTS bsp_reconciliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    bsp_line_item_id UUID REFERENCES bsp_line_items(id),
    status VARCHAR(20) DEFAULT 'pending',
    our_amount DECIMAL(15,2) NOT NULL,
    bsp_amount DECIMAL(15,2) NOT NULL,
    difference DECIMAL(15,2) NOT NULL,
    our_commission DECIMAL(15,2),
    bsp_commission DECIMAL(15,2),
    commission_difference DECIMAL(15,2),
    discrepancy_reason TEXT,
    resolution VARCHAR(50),
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    reconciled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reconciled_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit/Debit Memos from airlines
CREATE TABLE IF NOT EXISTS airline_memos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memo_type VARCHAR(20) NOT NULL,
    memo_number VARCHAR(50) UNIQUE NOT NULL,
    airline_code VARCHAR(3) NOT NULL,
    agency_iata_code VARCHAR(10),
    issue_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    reason_code VARCHAR(10),
    reason_description TEXT,
    related_pnr VARCHAR(10),
    related_ticket VARCHAR(20),
    booking_id UUID REFERENCES bookings(id),
    status VARCHAR(20) DEFAULT 'pending',
    disputed BOOLEAN DEFAULT FALSE,
    dispute_reason TEXT,
    dispute_date DATE,
    resolved_date DATE,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank Settlement (BSP payments)
CREATE TABLE IF NOT EXISTS bsp_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_period_start DATE NOT NULL,
    settlement_period_end DATE NOT NULL,
    settlement_date DATE NOT NULL,
    iata_code VARCHAR(10) NOT NULL,
    total_sales DECIMAL(15,2) NOT NULL,
    total_commission DECIMAL(15,2) NOT NULL,
    total_tax DECIMAL(15,2) NOT NULL,
    bank_charges DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_date DATE,
    payment_reference VARCHAR(50),
    bank_account VARCHAR(50),
    reconciliation_status VARCHAR(20) DEFAULT 'pending',
    reconciled_at TIMESTAMP WITH TIME ZONE,
    reconciled_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission Tracking
CREATE TABLE IF NOT EXISTS commission_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    airline_code VARCHAR(3) NOT NULL,
    iata_profile_id UUID REFERENCES iata_profiles(id),
    commission_type VARCHAR(20) DEFAULT 'airline',
    base_commission DECIMAL(15,2) NOT NULL,
    override_commission DECIMAL(15,2) DEFAULT 0,
    incentive_commission DECIMAL(15,2) DEFAULT 0,
    total_commission DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'pending',
    earned_date DATE,
    paid_date DATE,
    payment_reference VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bsp_reports_period ON bsp_reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_bsp_reports_airline ON bsp_reports(airline_code);
CREATE INDEX IF NOT EXISTS idx_bsp_reports_status ON bsp_reports(status);
CREATE INDEX IF NOT EXISTS idx_bsp_line_items_pnr ON bsp_line_items(pnr);
CREATE INDEX IF NOT EXISTS idx_bsp_line_items_ticket ON bsp_line_items(ticket_number);
CREATE INDEX IF NOT EXISTS idx_bsp_line_items_airline ON bsp_line_items(airline_code);
CREATE INDEX IF NOT EXISTS idx_bsp_reconciliation_booking ON bsp_reconciliation(booking_id);
CREATE INDEX IF NOT EXISTS idx_bsp_reconciliation_status ON bsp_reconciliation(status);
CREATE INDEX IF NOT EXISTS idx_airline_memos_type ON airline_memos(memo_type);
CREATE INDEX IF NOT EXISTS idx_airline_memos_airline ON airline_memos(airline_code);
CREATE INDEX IF NOT EXISTS idx_airline_memos_status ON airline_memos(status);
CREATE INDEX IF NOT EXISTS idx_bsp_settlements_period ON bsp_settlements(settlement_period_start, settlement_period_end);
CREATE INDEX IF NOT EXISTS idx_bsp_settlements_status ON bsp_settlements(payment_status);
CREATE INDEX IF NOT EXISTS idx_commission_tracking_booking ON commission_tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_commission_tracking_status ON commission_tracking(status);

-- Comments
COMMENT ON TABLE bsp_reports IS 'BSP/IATA sales reports uploaded from airline portals';
COMMENT ON TABLE bsp_line_items IS 'Individual booking line items from BSP reports';
COMMENT ON TABLE bsp_reconciliation IS 'Reconciliation matching between our bookings and BSP data';
COMMENT ON TABLE airline_memos IS 'Credit and debit memos from airlines';
COMMENT ON TABLE bsp_settlements IS 'BSP bank settlement records';
COMMENT ON TABLE commission_tracking IS 'Airline commission earnings and payments';

COMMENT ON COLUMN bsp_reconciliation.status IS 'pending, matched, mismatch, resolved';
COMMENT ON COLUMN bsp_reconciliation.discrepancy_reason IS 'Reason for amount mismatch';
COMMENT ON COLUMN bsp_reconciliation.resolution IS 'How discrepancy was resolved';
COMMENT ON COLUMN airline_memos.memo_type IS 'credit_memo or debit_memo';
COMMENT ON COLUMN airline_memos.status IS 'pending, approved, paid, disputed, cancelled';
COMMENT ON COLUMN bsp_settlements.reconciliation_status IS 'pending, reconciled, discrepancy';
COMMENT ON COLUMN commission_tracking.status IS 'pending, earned, paid, cancelled';
