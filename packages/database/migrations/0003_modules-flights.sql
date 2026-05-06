-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0003: Flights Module
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 3. FLIGHTS MODULE
-- ========================================

-- Airlines table
CREATE TABLE flights_airlines (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    country VARCHAR(100),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Airports table
CREATE TABLE flights_airports (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    city_airport VARCHAR(100),
    country VARCHAR(100),
    country_code VARCHAR(2),
    timezone VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flights table (inventory)
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_number VARCHAR(50),
    airline_id INTEGER REFERENCES flights_airlines(id),
    origin_airport VARCHAR(10) REFERENCES flights_airports(code),
    destination_airport VARCHAR(10) REFERENCES flights_airports(code),
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    aircraft_type VARCHAR(100),
    cabin_class VARCHAR(50), -- economy, business, first, premium_economy
    baggage_allowance JSONB, -- { checked: "23kg", cabin: "7kg" }
    price DECIMAL(15,2),
    currency VARCHAR(3),
    seats_available INTEGER,
    status VARCHAR(20) DEFAULT 'available', -- available, sold_out, cancelled
    third_party_source VARCHAR(50), -- amadeus, travelport, kiwi, ndc, direct
    third_party_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured flights
CREATE TABLE flights_featured (
    id SERIAL PRIMARY KEY,
    from_airport VARCHAR(10) REFERENCES flights_airports(code),
    to_airport VARCHAR(10) REFERENCES flights_airports(code),
    airline VARCHAR(10) REFERENCES flights_airlines(code),
    price DECIMAL(15,2),
    currency VARCHAR(3),
    status BOOLEAN DEFAULT true,
    featured_from TIMESTAMP WITH TIME ZONE,
    featured_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight suggestions (popular routes)
CREATE TABLE flights_suggestions (
    id SERIAL PRIMARY KEY,
    city_airport VARCHAR(100) REFERENCES flights_airports(code),
    type VARCHAR(50), -- origin, destination
    status BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight bookings
CREATE TABLE flights_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth_users(id),
    guest_info JSONB, -- [{fname, lname, dob, passport, type}]
    flight_details JSONB, -- [{flight_id, airline, flight_number, from, to, departure, arrival, class}]
    total_price DECIMAL(15,2),
    currency VARCHAR(3),
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, unpaid, refunded, partially_refunded
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    booking_status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, pending, on_hold
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    travel_date TIMESTAMP WITH TIME ZONE,
    cancellation_policy JSONB,
    invoice_url VARCHAR(500),
    pnr VARCHAR(50), -- Airline PNR
    ticket_numbers JSONB, -- Array of ticket numbers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight booking passengers
CREATE TABLE flights_booking_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES flights_bookings(id) ON DELETE CASCADE,
    passenger_type VARCHAR(20), -- adult, child, infant
    fname VARCHAR(100),
    lname VARCHAR(100),
    dob DATE,
    gender VARCHAR(10),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    nationality VARCHAR(100),
    seat_preference VARCHAR(50), -- window, aisle, none
    meal_preference VARCHAR(100),
    frequent_flyer_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight cancellations
CREATE TABLE flights_cancellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES flights_bookings(id),
    cancellation_ref VARCHAR(50) UNIQUE,
    reason TEXT,
    cancellation_fee DECIMAL(15,2),
    refund_amount DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, processed
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES backend_users(id)
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_flights_airlines_code ON flights_airlines(code);
CREATE INDEX idx_flights_airports_code ON flights_airports(code);
CREATE INDEX idx_flights_origin ON flights(origin_airport);
CREATE INDEX idx_flights_destination ON flights(destination_airport);
CREATE INDEX idx_flights_departure ON flights(departure_time);
CREATE INDEX idx_flights_airline ON flights(airline_id);
CREATE INDEX idx_flights_status ON flights(status);
CREATE INDEX idx_flights_featured_routes ON flights_featured(from_airport, to_airport);
CREATE INDEX idx_flights_bookings_ref ON flights_bookings(booking_ref_no);
CREATE INDEX idx_flights_bookings_user ON flights_bookings(user_id);
CREATE INDEX idx_flights_bookings_status ON flights_bookings(booking_status);
CREATE INDEX idx_flights_bookings_travel_date ON flights_bookings(travel_date);
CREATE INDEX idx_flights_booking_passengers_booking ON flights_booking_passengers(booking_id);

-- ========================================
-- FULL TEXT SEARCH
-- ========================================

CREATE INDEX idx_flights_airports_search ON flights_airports USING gin(
    to_tsvector('english', name || ' ' || city || ' ' || country)
);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE flights_airlines IS 'Airline carriers';
COMMENT ON TABLE flights_airports IS 'Airports worldwide';
COMMENT ON TABLE flights IS 'Flight inventory';
COMMENT ON TABLE flights_featured IS 'Featured flight deals';
COMMENT ON TABLE flights_suggestions IS 'Popular flight search suggestions';
COMMENT ON TABLE flights_bookings IS 'Flight booking records';
COMMENT ON TABLE flights_booking_passengers IS 'Passenger details for bookings';
COMMENT ON TABLE flights_cancellations IS 'Flight cancellation requests';
