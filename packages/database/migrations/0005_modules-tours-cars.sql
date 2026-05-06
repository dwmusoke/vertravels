-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0005: Tours & Cars Modules
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 5. TOURS MODULE
-- ========================================

-- Tours table
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    location VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    duration VARCHAR(100), -- e.g., "3 days", "5 hours", "Full day"
    itinerary JSONB, -- [{day: 1, title: "...", description: "...", activities: [...]}]
    includes JSONB, -- What's included [lunch, transport, guide, entrance fees]
    excludes JSONB, -- What's excluded [tips, personal expenses, etc.]
    images JSONB,
    stars INTEGER,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    module VARCHAR(50), -- adventure, cultural, food, historical, nature, etc.
    tour_basic_price DECIMAL(15,2),
    currency VARCHAR(3),
    min_pax INTEGER DEFAULT 1,
    max_pax INTEGER,
    status BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth_users(id),
    third_party_source VARCHAR(50), -- viator, getyourguide, direct, etc.
    third_party_reference VARCHAR(255),
    cancellation_policy TEXT,
    meta_title VARCHAR(255),
    meta_keywords TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour suggestions
CREATE TABLE tours_suggestions (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    status BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour bookings
CREATE TABLE tours_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth_users(id),
    tour_id UUID REFERENCES tours(id),
    guest_info JSONB, -- [{fname, lname, email, phone}]
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    travel_date TIMESTAMP WITH TIME ZONE,
    number_of_pax INTEGER,
    total_price DECIMAL(15,2),
    currency VARCHAR(3),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    booking_status VARCHAR(20) DEFAULT 'confirmed',
    cancellation_policy JSONB,
    invoice_url VARCHAR(500),
    special_requests TEXT,
    confirmation_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour reviews
CREATE TABLE tours_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth_users(id),
    booking_id UUID REFERENCES tours_bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    guide_rating INTEGER,
    value_rating INTEGER,
    organization_rating INTEGER,
    images JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. CARS MODULE
-- ========================================

-- Cars table
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    car_type VARCHAR(100), -- sedan, suv, luxury, economy, compact, van
    car_image VARCHAR(500),
    images JSONB,
    passengers INTEGER,
    doors INTEGER,
    luggage INTEGER,
    transmission VARCHAR(50), -- automatic, manual
    fuel_type VARCHAR(50), -- petrol, diesel, electric, hybrid
    air_conditioning BOOLEAN DEFAULT true,
    price DECIMAL(15,2),
    currency VARCHAR(3),
    airport_pickup BOOLEAN DEFAULT true,
    cancel_anytime BOOLEAN DEFAULT false,
    free_amend BOOLEAN DEFAULT false,
    unlimited_mileage BOOLEAN DEFAULT false,
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth_users(id),
    third_party_source VARCHAR(50), -- rentalcars, discovercars, direct, etc.
    third_party_reference VARCHAR(255),
    meta_title VARCHAR(255),
    meta_keywords TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car locations
CREATE TABLE cars_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    airport_code VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    opening_hours JSONB, -- {monday: "09:00-18:00", ...}
    phone VARCHAR(50),
    email VARCHAR(255),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car suggestions
CREATE TABLE cars_suggestions (
    id SERIAL PRIMARY KEY,
    city_airport VARCHAR(100),
    status BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car bookings
CREATE TABLE cars_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth_users(id),
    car_id UUID REFERENCES cars(id),
    pickup_location VARCHAR(500),
    dropoff_location VARCHAR(500),
    pickup_date TIMESTAMP WITH TIME ZONE,
    dropoff_date TIMESTAMP WITH TIME ZONE,
    driver_age INTEGER,
    guest_info JSONB, -- [{fname, lname, email, phone, license_number}]
    total_price DECIMAL(15,2),
    currency VARCHAR(3),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    booking_status VARCHAR(20) DEFAULT 'confirmed',
    cancellation_policy JSONB,
    invoice_url VARCHAR(500),
    special_requests TEXT,
    confirmation_code VARCHAR(100),
    voucher_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car reviews
CREATE TABLE cars_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth_users(id),
    booking_id UUID REFERENCES cars_bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    cleanliness_rating INTEGER,
    condition_rating INTEGER,
    value_rating INTEGER,
    pickup_experience_rating INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_tours_city ON tours(city);
CREATE INDEX idx_tours_country ON tours(country);
CREATE INDEX idx_tours_module ON tours(module);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_bookings_ref ON tours_bookings(booking_ref_no);
CREATE INDEX idx_tours_bookings_user ON tours_bookings(user_id);
CREATE INDEX idx_tours_bookings_tour ON tours_bookings(tour_id);
CREATE INDEX idx_tours_reviews_tour ON tours_reviews(tour_id);

CREATE INDEX idx_cars_type ON cars(car_type);
CREATE INDEX idx_cars_city ON cars(city);
CREATE INDEX idx_cars_country ON cars(country);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_slug ON cars(slug);
CREATE INDEX idx_cars_locations_city ON cars_locations(city);
CREATE INDEX idx_cars_bookings_ref ON cars_bookings(booking_ref_no);
CREATE INDEX idx_cars_bookings_user ON cars_bookings(user_id);
CREATE INDEX idx_cars_bookings_car ON cars_bookings(car_id);
CREATE INDEX idx_cars_bookings_dates ON cars_bookings(pickup_date, dropoff_date);
CREATE INDEX idx_cars_reviews_car ON cars_reviews(car_id);

-- ========================================
-- FULL TEXT SEARCH
-- ========================================

CREATE INDEX idx_tours_search ON tours USING gin(
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || city || ' ' || country)
);

CREATE INDEX idx_cars_search ON cars USING gin(
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE tours IS 'Tour packages and activities';
COMMENT ON TABLE tours_suggestions IS 'Popular tour search cities';
COMMENT ON TABLE tours_bookings IS 'Tour booking records';
COMMENT ON TABLE tours_reviews IS 'Tour reviews and ratings';
COMMENT ON TABLE cars IS 'Car rental inventory';
COMMENT ON TABLE cars_locations IS 'Car rental pickup/dropoff locations';
COMMENT ON TABLE cars_suggestions IS 'Popular car rental locations';
COMMENT ON TABLE cars_bookings IS 'Car rental booking records';
COMMENT ON TABLE cars_reviews IS 'Car rental reviews and ratings';
