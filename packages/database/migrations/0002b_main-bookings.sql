-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0002b: Main Bookings Table
-- PostgreSQL (Supabase)
-- ========================================

-- Main bookings table (aggregates all booking types)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    module_type VARCHAR(20) NOT NULL, -- flights, hotels, tours, cars, visa
    status VARCHAR(20) DEFAULT 'pending', -- confirmed, pending, cancelled, completed, refunded
    
    -- Module References
    flight_id UUID,
    hotel_id UUID,
    tour_id UUID,
    car_id UUID,
    visa_id UUID,
    
    -- Customer Information
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Module-Specific Data
    passenger_name VARCHAR(255),
    hotel_name VARCHAR(255),
    tour_name VARCHAR(255),
    car_name VARCHAR(255),
    visa_type VARCHAR(100),
    destination VARCHAR(255),
    
    -- Dates
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    travel_date DATE,
    check_in_date DATE,
    check_out_date DATE,
    pickup_date DATE,
    dropoff_date DATE,
    
    -- Counts
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    infants INTEGER DEFAULT 0,
    nights INTEGER,
    duration INTEGER,
    
    -- Payment
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    -- PNR & Documents (NEW - for manual bookings)
    pnr VARCHAR(50),
    pnr_url VARCHAR(500),
    
    -- Additional Data
    special_requests TEXT,
    cancellation_policy TEXT,
    itinerary JSONB,
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_module_type ON bookings(module_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);

-- Comments
COMMENT ON TABLE bookings IS 'Main bookings table aggregating all module types';
COMMENT ON COLUMN bookings.module_type IS 'Type: flights, hotels, tours, cars, visa';
COMMENT ON COLUMN bookings.status IS 'Status: confirmed, pending, cancelled, completed, refunded';
COMMENT ON COLUMN bookings.pnr IS 'Passenger Name Record / Booking reference';
COMMENT ON COLUMN bookings.pnr_url IS 'URL to uploaded PNR document or booking confirmation';
