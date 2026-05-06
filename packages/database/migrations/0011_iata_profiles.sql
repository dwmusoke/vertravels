-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0011: IATA Profiles & Tracking
-- PostgreSQL (Supabase)
-- ========================================

-- IATA Profiles Table (agency accreditations)
CREATE TABLE IF NOT EXISTS iata_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID,
    iata_code VARCHAR(10) NOT NULL,
    iata_number VARCHAR(20) NOT NULL,
    accreditation_type VARCHAR(20) NOT NULL, -- IATA, NON_IATA, CLIA, TRUE
    status VARCHAR(20) DEFAULT 'active', -- active, pending, suspended, expired
    issue_date DATE,
    expiry_date DATE,
    bsp_code VARCHAR(20),
    pseudo_city_code VARCHAR(10),
    commission_rate DECIMAL(5,2),
    booking_fee DECIMAL(10,2),
    allowed_airlines TEXT[],
    monthly_target DECIMAL(15,2),
    current_month_sales DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IATA Tracking Table (for individual bookings)
CREATE TABLE IF NOT EXISTS iata_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    pnr VARCHAR(10),
    ticket_number VARCHAR(20),
    iata_booking BOOLEAN DEFAULT false,
    iata_profile_id UUID REFERENCES iata_profiles(id),
    airline_code VARCHAR(5),
    commission_amount DECIMAL(10,2),
    base_fare DECIMAL(10,2),
    taxes DECIMAL(10,2),
    total_amount DECIMAL(15,2),
    issued_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners Table (sub-agents, affiliates, B2B)
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL, -- affiliate, sub_agent, b2b, corporate, wholesaler
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended
    commission_rate DECIMAL(5,2) DEFAULT 5,
    commission_type VARCHAR(20) DEFAULT 'percentage', -- percentage, fixed, tiered
    tier VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    api_key VARCHAR(255) UNIQUE,
    white_label_enabled BOOLEAN DEFAULT false,
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_commission DECIMAL(15,2) DEFAULT 0,
    pending_commission DECIMAL(15,2) DEFAULT 0,
    paid_commission DECIMAL(15,2) DEFAULT 0,
    joined_date DATE DEFAULT NOW(),
    last_booking_date DATE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partner Payouts Table
CREATE TABLE IF NOT EXISTS partner_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    amount DECIMAL(15,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, paid, cancelled
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission Tracking Table
CREATE TABLE IF NOT EXISTS commission_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    airline_code VARCHAR(3) NOT NULL,
    iata_profile_id UUID REFERENCES iata_profiles(id),
    commission_type VARCHAR(20) DEFAULT 'airline', -- airline, override, incentive
    base_commission DECIMAL(15,2) NOT NULL,
    override_commission DECIMAL(15,2) DEFAULT 0,
    incentive_commission DECIMAL(15,2) DEFAULT 0,
    total_commission DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, earned, paid, cancelled
    earned_date DATE,
    paid_date DATE,
    payment_reference VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_iata_profiles_code ON iata_profiles(iata_code);
CREATE INDEX IF NOT EXISTS idx_iata_profiles_status ON iata_profiles(status);
CREATE INDEX IF NOT EXISTS idx_iata_tracking_booking ON iata_tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_iata_tracking_pnr ON iata_tracking(pnr);
CREATE INDEX IF NOT EXISTS idx_iata_tracking_profile ON iata_tracking(iata_profile_id);
CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(type);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_partner ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_payouts_status ON partner_payouts(status);
CREATE INDEX IF NOT EXISTS idx_commission_tracking_booking ON commission_tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_commission_tracking_status ON commission_tracking(status);

-- Comments
COMMENT ON TABLE iata_profiles IS 'IATA accreditation profiles for travel agencies';
COMMENT ON TABLE iata_tracking IS 'IATA tracking for individual flight bookings';
COMMENT ON TABLE partners IS 'B2B partners, sub-agents, and affiliates';
COMMENT ON TABLE partner_payouts IS 'Commission payouts to partners';
COMMENT ON TABLE commission_tracking IS 'Airline commission tracking and payments';
