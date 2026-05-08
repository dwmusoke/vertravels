-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0014: Backoffice & Mid-Office Operations
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 1. TICKETING SYSTEM
-- ========================================

-- Ticket Stock Management (airline ticket inventory)
CREATE TABLE IF NOT EXISTS ticket_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_code VARCHAR(3) NOT NULL,
    airline_name VARCHAR(100),
    ticket_prefix VARCHAR(3) NOT NULL,
    start_number VARCHAR(10) NOT NULL,
    end_number VARCHAR(10) NOT NULL,
    current_number VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    received_date DATE,
    received_by UUID REFERENCES auth_users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(airline_code, start_number, end_number)
);

-- Tickets Issued
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(15) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    pnr VARCHAR(10),
    passenger_name VARCHAR(100) NOT NULL,
    airline_code VARCHAR(3) NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    issued_by UUID REFERENCES auth_users(id),
    status VARCHAR(20) DEFAULT 'issued',
    fare DECIMAL(15,2),
    tax DECIMAL(15,2),
    total DECIMAL(15,2),
    commission DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    fare_basis VARCHAR(20),
    ticket_type VARCHAR(20) DEFAULT 'electronic',
    endorsement VARCHAR(200),
    tour_code VARCHAR(20),
    original_ticket VARCHAR(15),
    conjuction_ticket VARCHAR(15),
    voided_at TIMESTAMP WITH TIME ZONE,
    voided_by UUID REFERENCES auth_users(id),
    void_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_amount DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EMD (Electronic Miscellaneous Document)
CREATE TABLE IF NOT EXISTS emd_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emd_number VARCHAR(15) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    ticket_number VARCHAR(15),
    passenger_name VARCHAR(100) NOT NULL,
    airline_code VARCHAR(3) NOT NULL,
    service_type VARCHAR(50),
    service_description TEXT,
    issue_date DATE DEFAULT CURRENT_DATE,
    issued_by UUID REFERENCES auth_users(id),
    status VARCHAR(20) DEFAULT 'issued',
    amount DECIMAL(15,2),
    tax DECIMAL(15,2),
    total DECIMAL(15,2),
    commission DECIMAL(15,2),
    associated_ticket VARCHAR(15),
    voided_at TIMESTAMP WITH TIME ZONE,
    voided_by UUID REFERENCES auth_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. QUEUE MANAGEMENT
-- ========================================

-- Queue Definitions (GDS queues)
CREATE TABLE IF NOT EXISTS queue_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name VARCHAR(100) NOT NULL,
    queue_number VARCHAR(10),
    office_id VARCHAR(10),
    source VARCHAR(20),
    description TEXT,
    priority INTEGER DEFAULT 5,
    auto_process BOOLEAN DEFAULT false,
    sla_hours INTEGER DEFAULT 24,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue Items (PNRs in queue)
CREATE TABLE IF NOT EXISTS queue_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID REFERENCES queue_definitions(id),
    pnr VARCHAR(10) NOT NULL,
    passenger_name VARCHAR(100),
    airline_code VARCHAR(3),
    queue_date TIMESTAMP WITH TIME ZONE,
    received_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    assigned_to UUID REFERENCES auth_users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth_users(id),
    processing_notes TEXT,
    booking_id UUID REFERENCES bookings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue Processing History
CREATE TABLE IF NOT EXISTS queue_processing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_item_id UUID REFERENCES queue_items(id),
    action VARCHAR(50),
    action_by UUID REFERENCES auth_users(id),
    action_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    old_status VARCHAR(20),
    new_status VARCHAR(20)
);

-- ========================================
-- 3. BOOKING WORKFLOW
-- ========================================

-- Workflow Status Definitions
CREATE TABLE IF NOT EXISTS workflow_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_code VARCHAR(20) UNIQUE NOT NULL,
    status_name VARCHAR(50) NOT NULL,
    status_group VARCHAR(20),
    display_order INTEGER,
    color VARCHAR(20),
    icon VARCHAR(50),
    is_final BOOLEAN DEFAULT false,
    requires_action BOOLEAN DEFAULT false,
    action_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default workflow statuses
INSERT INTO workflow_statuses (status_code, status_name, status_group, display_order, color, icon, is_final, requires_action) VALUES
('inquiry', 'Inquiry', 'initial', 1, 'gray', 'MessageCircle', false, false),
('quoted', 'Quoted', 'initial', 2, 'blue', 'FileText', false, false),
('booked', 'Booked', 'active', 3, 'sky', 'Calendar', false, false),
('pending_payment', 'Pending Payment', 'active', 4, 'yellow', 'Clock', true, true),
('paid', 'Paid', 'active', 5, 'green', 'CheckCircle', false, false),
('ticketed', 'Ticketed', 'active', 6, 'green', 'Ticket', false, false),
('confirmed', 'Confirmed', 'active', 7, 'green', 'CheckCircle', false, false),
('vouchers_sent', 'Vouchers Sent', 'fulfillment', 8, 'green', 'Mail', false, false),
('travelled', 'Travelled', 'completed', 9, 'gray', 'CheckCircle', true, false),
('completed', 'Completed', 'completed', 10, 'gray', 'CheckCircle', true, false),
('cancelled', 'Cancelled', 'cancelled', 11, 'red', 'XCircle', true, false),
('refunded', 'Refunded', 'cancelled', 12, 'red', 'RefreshCcw', true, false)
ON CONFLICT (status_code) DO NOTHING;

-- Booking Workflow Tracking
CREATE TABLE IF NOT EXISTS booking_workflow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) UNIQUE NOT NULL,
    current_status VARCHAR(20) DEFAULT 'inquiry',
    previous_status VARCHAR(20),
    status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status_changed_by UUID REFERENCES auth_users(id),
    time_limit DATE,
    ticketing_deadline TIMESTAMP WITH TIME ZONE,
    payment_deadline DATE,
    confirmation_deadline DATE,
    travel_date DATE,
    completion_date DATE,
    auto_ticket_eligible BOOLEAN DEFAULT false,
    auto_ticket_scheduled TIMESTAMP WITH TIME ZONE,
    requires_attention BOOLEAN DEFAULT false,
    attention_reason TEXT,
    assigned_agent UUID REFERENCES auth_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow History
CREATE TABLE IF NOT EXISTS workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    workflow_id UUID REFERENCES booking_workflow(id),
    from_status VARCHAR(20),
    to_status VARCHAR(20),
    changed_by UUID REFERENCES auth_users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT,
    notes TEXT,
    metadata JSONB
);

-- ========================================
-- 4. SUPPLIER MANAGEMENT
-- ========================================

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(20) UNIQUE,
    supplier_name VARCHAR(100) NOT NULL,
    supplier_type VARCHAR(20),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    payment_terms VARCHAR(50),
    credit_limit DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    commission_rate DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplier Confirmations
CREATE TABLE IF NOT EXISTS supplier_confirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    supplier_id UUID REFERENCES suppliers(id),
    confirmation_number VARCHAR(50),
    confirmation_date TIMESTAMP WITH TIME ZONE,
    confirmation_status VARCHAR(20) DEFAULT 'pending',
    confirmation_method VARCHAR(20),
    confirmed_by VARCHAR(100),
    confirmation_email VARCHAR(100),
    confirmation_notes TEXT,
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_date DATE,
    voucher_sent BOOLEAN DEFAULT false,
    voucher_sent_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vouchers
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_number VARCHAR(20) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    voucher_type VARCHAR(20),
    supplier_id UUID REFERENCES suppliers(id),
    passenger_name VARCHAR(100),
    service_description TEXT,
    service_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    pdf_url VARCHAR(500),
    sent_at TIMESTAMP WITH TIME ZONE,
    sent_to VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. MANUAL POSTINGS
-- ========================================

-- Manual Booking Postings
CREATE TABLE IF NOT EXISTS manual_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posting_number VARCHAR(20) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    posting_type VARCHAR(20) NOT NULL,
    source VARCHAR(20) DEFAULT 'manual',
    pnr VARCHAR(10),
    ticket_number VARCHAR(15),
    passenger_name VARCHAR(100),
    route_description TEXT,
    travel_date DATE,
    fare DECIMAL(15,2),
    tax DECIMAL(15,2),
    commission DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    airline_code VARCHAR(3),
    supplier_id UUID REFERENCES suppliers(id),
    payment_status VARCHAR(20) DEFAULT 'pending',
    ticketing_status VARCHAR(20) DEFAULT 'pending',
    entered_by UUID REFERENCES auth_users(id),
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_by UUID REFERENCES auth_users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. PNR INGESTION
-- ========================================

-- PNR Ingestion Batches
CREATE TABLE IF NOT EXISTS pnr_ingestion_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number VARCHAR(20) UNIQUE NOT NULL,
    source_type VARCHAR(20) NOT NULL,
    source_file VARCHAR(200),
    airline_code VARCHAR(3),
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    uploaded_by UUID REFERENCES auth_users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth_users(id),
    error_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PNR Ingestion Records
CREATE TABLE IF NOT EXISTS pnr_ingestion_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES pnr_ingestion_batches(id),
    record_number INTEGER,
    pnr VARCHAR(10),
    ticket_number VARCHAR(15),
    passenger_name VARCHAR(100),
    airline_code VARCHAR(3),
    flight_date DATE,
    route VARCHAR(50),
    fare DECIMAL(15,2),
    tax DECIMAL(15,2),
    commission DECIMAL(15,2),
    total DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    booking_id UUID REFERENCES bookings(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. REFUNDS
-- ========================================

-- Refund Requests
CREATE TABLE IF NOT EXISTS refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refund_number VARCHAR(20) UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    ticket_id UUID REFERENCES tickets(id),
    passenger_name VARCHAR(100),
    refund_type VARCHAR(20),
    refund_reason TEXT,
    original_amount DECIMAL(15,2),
    refund_amount DECIMAL(15,2),
    penalty_amount DECIMAL(15,2),
    net_refund DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    requested_by UUID REFERENCES auth_users(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID REFERENCES auth_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth_users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    airline_refund_ref VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. AUTOMATION RULES
-- ========================================

-- Auto-Ticketing Rules
CREATE TABLE IF NOT EXISTS auto_ticketing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(20) DEFAULT 'auto_ticketing',
    priority INTEGER DEFAULT 5,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    execute_time TIME,
    days_before_travel INTEGER,
    created_by UUID REFERENCES auth_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Execution Log
CREATE TABLE IF NOT EXISTS automation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES auto_ticketing_rules(id),
    execution_type VARCHAR(50),
    booking_id UUID REFERENCES bookings(id),
    status VARCHAR(20) DEFAULT 'pending',
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    result JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_booking ON tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_emd_number ON emd_documents(emd_number);
CREATE INDEX IF NOT EXISTS idx_queue_items_status ON queue_items(status);
CREATE INDEX IF NOT EXISTS idx_queue_items_pnr ON queue_items(pnr);
CREATE INDEX IF NOT EXISTS idx_booking_workflow_status ON booking_workflow(current_status);
CREATE INDEX IF NOT EXISTS idx_booking_workflow_assigned ON booking_workflow(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_manual_postings_status ON manual_postings(status);
CREATE INDEX IF NOT EXISTS idx_pnr_batch_status ON pnr_ingestion_batches(status);
CREATE INDEX IF NOT EXISTS idx_refund_status ON refund_requests(status);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE ticket_stock IS 'Airline ticket stock/inventory management';
COMMENT ON TABLE tickets IS 'Issued tickets with full details';
COMMENT ON TABLE emd_documents IS 'Electronic Miscellaneous Documents';
COMMENT ON TABLE queue_items IS 'GDS queue items for processing';
COMMENT ON TABLE booking_workflow IS 'Booking lifecycle tracking';
COMMENT ON TABLE manual_postings IS 'Manually entered bookings';
COMMENT ON TABLE pnr_ingestion_batches IS 'PNR ingestion batch tracking';
COMMENT ON TABLE pnr_ingestion_records IS 'Individual PNR records from ingestion';
COMMENT ON TABLE refund_requests IS 'Refund request tracking';
COMMENT ON TABLE auto_ticketing_rules IS 'Automated ticketing rules';
