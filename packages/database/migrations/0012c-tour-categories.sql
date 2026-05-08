-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0012c: Tour Categories Table
-- ========================================

CREATE TABLE IF NOT EXISTS tour_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_emoji VARCHAR(10),
    icon_image_url TEXT,
    color_from VARCHAR(50) DEFAULT 'from-sky-600',
    color_to VARCHAR(50) DEFAULT 'to-blue-500',
    background_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_tour_categories_order ON tour_categories(status, display_order, created_at);

-- Insert default tour categories
INSERT INTO tour_categories (name, slug, description, icon_emoji, color_from, color_to, display_order) VALUES
  ('Safari Adventures', 'safari', 'Experience the wild!', '🦁', 'from-amber-600', 'to-yellow-500', 1),
  ('Cultural Tours', 'cultural', 'Explore local heritage', '🏛️', 'from-indigo-600', 'to-purple-500', 2),
  ('Adventure Tours', 'adventure', 'Get your adrenaline rushing', '🧗', 'from-emerald-600', 'to-teal-500', 3),
  ('Beach & Island', 'beach', 'Relax and unwind', '🏖️', 'from-sky-600', 'to-blue-500', 4)
ON CONFLICT (slug) DO NOTHING;
