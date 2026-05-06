-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0006: Visa Module & Payment Gateways
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 7. VISA MODULE
-- ========================================

-- Visa types and requirements
CREATE TABLE visa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id INTEGER REFERENCES countries(id),
    country_name VARCHAR(100) NOT NULL,
    visa_type VARCHAR(100), -- tourist, business, transit, student, work
    description TEXT,
    requirements JSONB, -- [{document: "passport", description: "Valid for 6 months"}, {document: "photo", description: "2 passport photos"}]
    processing_time VARCHAR(100), -- e.g., "5-7 business days"
    validity VARCHAR(100), -- e.g., "90 days from issue"
    price DECIMAL(15,2),
    currency VARCHAR(3),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visa bookings/applications
CREATE TABLE visa_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth_users(id),
    visa_id UUID REFERENCES visa(id),
    applicant_info JSONB, -- {fname, lname, dob, nationality, email, phone}
    passport_info JSONB, -- {number, issue_date, expiry_date, issue_place}
    travel_details JSONB, -- {purpose, intended_arrival, duration, hotel_booking}
    documents JSONB, -- Array of uploaded document URLs [{type: "passport", url: "..."}, {type: "photo", url: "..."}]
    total_price DECIMAL(15,2),
    currency VARCHAR(3),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    application_status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, approved, rejected, dispatched
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invoice_url VARCHAR(500),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. PAYMENT & TRANSACTIONS
-- ========================================

-- Payment gateways configuration
CREATE TABLE payment_gateways (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo VARCHAR(500),
    c1 TEXT, -- Public key / API key 1
    c2 TEXT, -- Secret key / API key 2
    c3 TEXT, -- Test credentials / API key 3
    c4 TEXT, -- Test credentials / Password
    c5 TEXT, -- Additional config
    dev_mode BOOLEAN DEFAULT true,
    status BOOLEAN DEFAULT true,
    "default" BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(255) UNIQUE,
    user_id UUID REFERENCES auth_users(id),
    booking_ref_no VARCHAR(50),
    booking_type VARCHAR(50), -- flights, hotels, tours, cars, visa
    amount DECIMAL(15,2),
    currency VARCHAR(3),
    payment_gateway VARCHAR(50),
    payment_method VARCHAR(50), -- card, paypal, flutterwave, bank_transfer, wallet
    status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, refunded, partially_refunded
    transaction_type VARCHAR(50), -- purchase, refund, wallet_topup, wallet_deduction
    description TEXT,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth_users(id),
    amount DECIMAL(15,2),
    currency VARCHAR(3),
    transaction_type VARCHAR(50), -- credit, debit
    description TEXT,
    reference_id VARCHAR(255), -- Related booking or transaction
    balance_after DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    booking_ref_no VARCHAR(50),
    booking_type VARCHAR(50),
    user_id UUID REFERENCES auth_users(id),
    refund_amount DECIMAL(15,2),
    currency VARCHAR(3),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, processed
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES backend_users(id),
    gateway_refund_id VARCHAR(255)
);

-- Payment logs
CREATE TABLE payment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    gateway VARCHAR(50),
    event_type VARCHAR(100), -- payment.created, payment.success, payment.failed, webhook.received
    payload JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_visa_country ON visa(country_name);
CREATE INDEX idx_visa_type ON visa(visa_type);
CREATE INDEX idx_visa_status ON visa(status);
CREATE INDEX idx_visa_bookings_ref ON visa_bookings(booking_ref_no);
CREATE INDEX idx_visa_bookings_user ON visa_bookings(user_id);
CREATE INDEX idx_visa_bookings_status ON visa_bookings(application_status);

CREATE INDEX idx_payment_gateways_slug ON payment_gateways(slug);
CREATE INDEX idx_payment_gateways_status ON payment_gateways(status);
CREATE INDEX idx_transactions_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_booking ON transactions(booking_ref_no);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_refunds_transaction ON refunds(transaction_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_payment_logs_transaction ON payment_logs(transaction_id);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE visa IS 'Visa types and requirements by country';
COMMENT ON TABLE visa_bookings IS 'Visa application records';
COMMENT ON TABLE payment_gateways IS 'Payment gateway configurations';
COMMENT ON TABLE transactions IS 'Payment transaction records';
COMMENT ON TABLE wallet_transactions IS 'User wallet balance transactions';
COMMENT ON TABLE refunds IS 'Refund requests and processing';
COMMENT ON TABLE payment_logs IS 'Payment gateway event logs';
