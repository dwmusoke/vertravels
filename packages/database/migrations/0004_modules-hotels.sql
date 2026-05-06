-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0004: Hotels Module
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 4. HOTELS MODULE
-- ========================================

-- Hotels table
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    stars INTEGER, -- 1-5 stars
    rating DECIMAL(3,2), -- User rating 0-5
    review_count INTEGER DEFAULT 0,
    amenities JSONB, -- [wifi, pool, gym, spa, parking, restaurant, etc.]
    images JSONB, -- Array of image URLs
    price_from DECIMAL(15,2),
    currency VARCHAR(3),
    cancellation_policy TEXT,
    check_in_time TIME,
    check_out_time TIME,
    status BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    featured_from TIMESTAMP WITH TIME ZONE,
    featured_to TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth_users(id), -- For provider hotels
    third_party_source VARCHAR(50), -- hotelbeds, expedia, direct, etc.
    third_party_reference VARCHAR(255),
    meta_title VARCHAR(255),
    meta_keywords TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel rooms
CREATE TABLE hotels_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    room_name VARCHAR(255) NOT NULL,
    room_type VARCHAR(100), -- standard, deluxe, suite, etc.
    description TEXT,
    max_occupancy INTEGER,
    bed_type VARCHAR(100), -- king, queen, twin, double
    amenities JSONB, -- [ac, minibar, balcony, tv, etc.]
    images JSONB,
    price DECIMAL(15,2),
    currency VARCHAR(3),
    available_rooms INTEGER,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel room availability
CREATE TABLE hotels_rooms_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES hotels_rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available BOOLEAN DEFAULT true,
    price DECIMAL(15,2),
    min_stay INTEGER DEFAULT 1,
    UNIQUE(room_id, date)
);

-- Hotel suggestions (popular cities)
CREATE TABLE hotels_suggestions (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    status BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel bookings
CREATE TABLE hotels_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth_users(id),
    hotel_id UUID REFERENCES hotels(id),
    room_id UUID REFERENCES hotels_rooms(id),
    guest_info JSONB, -- [{fname, lname, email, phone}]
    check_in_date DATE,
    check_out_date DATE,
    number_of_rooms INTEGER,
    number_of_guests INTEGER,
    total_price DECIMAL(15,2),
    currency VARCHAR(3),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    booking_status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, pending, completed
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancellation_policy JSONB,
    invoice_url VARCHAR(500),
    special_requests TEXT,
    confirmation_code VARCHAR(100), -- Hotel confirmation code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel reviews
CREATE TABLE hotels_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth_users(id),
    booking_id UUID REFERENCES hotels_bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    cleanliness_rating INTEGER,
    location_rating INTEGER,
    service_rating INTEGER,
    value_rating INTEGER,
    images JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_country ON hotels(country);
CREATE INDEX idx_hotels_location ON hotels(latitude, longitude);
CREATE INDEX idx_hotels_stars ON hotels(stars);
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_hotels_featured ON hotels(featured);
CREATE INDEX idx_hotels_slug ON hotels(slug);
CREATE INDEX idx_hotels_rooms_hotel ON hotels_rooms(hotel_id);
CREATE INDEX idx_hotels_rooms_availability_date ON hotels_rooms_availability(date);
CREATE INDEX idx_hotels_bookings_ref ON hotels_bookings(booking_ref_no);
CREATE INDEX idx_hotels_bookings_user ON hotels_bookings(user_id);
CREATE INDEX idx_hotels_bookings_hotel ON hotels_bookings(hotel_id);
CREATE INDEX idx_hotels_bookings_dates ON hotels_bookings(check_in_date, check_out_date);
CREATE INDEX idx_hotels_reviews_hotel ON hotels_reviews(hotel_id);
CREATE INDEX idx_hotels_reviews_user ON hotels_reviews(user_id);

-- ========================================
-- FULL TEXT SEARCH
-- ========================================

CREATE INDEX idx_hotels_search ON hotels USING gin(
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || city || ' ' || country)
);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE hotels IS 'Hotel properties';
COMMENT ON TABLE hotels_rooms IS 'Hotel room types';
COMMENT ON TABLE hotels_rooms_availability IS 'Room availability by date';
COMMENT ON TABLE hotels_suggestions IS 'Popular hotel search cities';
COMMENT ON TABLE hotels_bookings IS 'Hotel booking records';
COMMENT ON TABLE hotels_reviews IS 'Hotel reviews and ratings';
