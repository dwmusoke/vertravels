-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0012b: Destinations Table
-- ========================================

CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    image_url TEXT,
    flights_count INTEGER DEFAULT 0,
    hotels_count INTEGER DEFAULT 0,
    price_from VARCHAR(50),
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for featured destinations
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured, display_order, created_at);

-- Insert some sample destinations (can be managed from Admin)
INSERT INTO destinations (name, country, price_from, flights_count, hotels_count, featured, display_order) VALUES
  ('Dubai', 'UAE', '$450', 45, 280, true, 1),
  ('Nairobi', 'Kenya', '$180', 38, 156, true, 2),
  ('London', 'UK', '$680', 25, 450, true, 3),
  ('Kampala', 'Uganda', '$50', 15, 85, false, 4),
  ('Zanzibar', 'Tanzania', '$350', 22, 120, true, 5),
  ('Kigali', 'Rwanda', '$200', 18, 65, false, 6)
ON CONFLICT DO NOTHING;
