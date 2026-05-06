-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0007: Blog & Content Management
-- PostgreSQL (Supabase)
-- ========================================

-- ========================================
-- 9. BLOGS & CONTENT
-- ========================================

-- Blog categories
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    cat_name VARCHAR(255) NOT NULL,
    cat_slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES blog_categories(id),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    post_title VARCHAR(255) NOT NULL,
    post_slug VARCHAR(255) UNIQUE NOT NULL,
    post_desc TEXT,
    post_content TEXT,
    post_category INTEGER REFERENCES blog_categories(id),
    post_img VARCHAR(500),
    images JSONB,
    author_id UUID REFERENCES backend_users(id),
    status BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_keywords TEXT,
    meta_description TEXT,
    views INTEGER DEFAULT 0,
    reading_time_minutes INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog translations
CREATE TABLE blogs_translations (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id),
    post_title VARCHAR(255),
    post_desc TEXT,
    post_content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, language_id)
);

-- CMS pages
CREATE TABLE cms (
    id SERIAL PRIMARY KEY,
    page_name VARCHAR(255) NOT NULL,
    page_slug VARCHAR(255) UNIQUE NOT NULL,
    page_content TEXT,
    page_image VARCHAR(500),
    meta_title VARCHAR(255),
    meta_keywords TEXT,
    meta_description TEXT,
    status BOOLEAN DEFAULT true,
    show_in_footer BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMS translations
CREATE TABLE cms_translations (
    id SERIAL PRIMARY KEY,
    cms_id INTEGER REFERENCES cms(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id),
    page_name VARCHAR(255),
    page_content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cms_id, language_id)
);

-- Newsletter subscribers
CREATE TABLE newsletter (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Offers and promotions
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20), -- percentage, fixed
    discount_value DECIMAL(15,2),
    min_booking_amount DECIMAL(15,2),
    max_discount_amount DECIMAL(15,2),
    applicable_modules JSONB, -- ["flights", "hotels", ...]
    promo_code VARCHAR(50) UNIQUE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_to TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT true,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_blog_categories_slug ON blog_categories(cat_slug);
CREATE INDEX idx_blogs_slug ON blogs(post_slug);
CREATE INDEX idx_blogs_category ON blogs(post_category);
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_featured ON blogs(featured);
CREATE INDEX idx_blogs_published ON blogs(published_at);
CREATE INDEX idx_blogs_translations_blog ON blogs_translations(blog_id);
CREATE INDEX idx_blogs_translations_lang ON blogs_translations(language_id);

CREATE INDEX idx_cms_slug ON cms(page_slug);
CREATE INDEX idx_cms_status ON cms(status);
CREATE INDEX idx_cms_translations_cms ON cms_translations(cms_id);
CREATE INDEX idx_cms_translations_lang ON cms_translations(language_id);

CREATE INDEX idx_newsletter_email ON newsletter(email);
CREATE INDEX idx_newsletter_status ON newsletter(status);

CREATE INDEX idx_offers_slug ON offers(slug);
CREATE INDEX idx_offers_code ON offers(promo_code);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_validity ON offers(valid_from, valid_to);

-- ========================================
-- FULL TEXT SEARCH
-- ========================================

CREATE INDEX idx_blogs_search ON blogs USING gin(
    to_tsvector('english', post_title || ' ' || COALESCE(post_desc, '') || ' ' || COALESCE(post_content, ''))
);

CREATE INDEX idx_cms_search ON cms USING gin(
    to_tsvector('english', page_name || ' ' || COALESCE(page_content, ''))
);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE blog_categories IS 'Blog post categories';
COMMENT ON TABLE blogs IS 'Blog posts';
COMMENT ON TABLE blogs_translations IS 'Blog post translations';
COMMENT ON TABLE cms IS 'CMS pages (About, Contact, Terms, etc.)';
COMMENT ON TABLE cms_translations IS 'CMS page translations';
COMMENT ON TABLE newsletter IS 'Newsletter subscribers';
COMMENT ON TABLE offers IS 'Promotional offers and discount codes';
