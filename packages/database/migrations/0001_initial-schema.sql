-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0001: Initial Schema
-- PostgreSQL (Supabase)
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. CORE SETTINGS & CONFIGURATION
-- ========================================

-- Settings table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'string',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- flights, hotels, tours, cars, visa, extra
    active BOOLEAN DEFAULT true,
    status BOOLEAN DEFAULT false,
    module_color VARCHAR(7) DEFAULT '#3b82f6',
    icon VARCHAR(100),
    settings JSONB DEFAULT '{}',
    third_party_integrations JSONB DEFAULT '[]',
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Currencies table
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL,
    symbol VARCHAR(10),
    rate DECIMAL(15,6) NOT NULL DEFAULT 1.0,
    country_iso VARCHAR(2),
    status BOOLEAN DEFAULT true,
    "default" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages table
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    native_name VARCHAR(100),
    flag_emoji VARCHAR(10),
    direction VARCHAR(5) DEFAULT 'ltr',
    status BOOLEAN DEFAULT true,
    "default" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries table
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    iso CHAR(2) UNIQUE NOT NULL,
    iso3 CHAR(3) UNIQUE,
    name VARCHAR(100) NOT NULL,
    nicename VARCHAR(100),
    phone_code VARCHAR(20),
    currency_code VARCHAR(3),
    currency_name VARCHAR(50),
    region VARCHAR(50),
    subregion VARCHAR(50),
    status BOOLEAN DEFAULT true
);

-- Locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    city_slug VARCHAR(150),
    country_id INTEGER REFERENCES countries(id),
    country VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

CREATE INDEX idx_currencies_code ON currencies(code);
CREATE INDEX idx_languages_code ON languages(code);
CREATE INDEX idx_countries_iso ON countries(iso);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_modules_type ON modules(type);

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE settings IS 'Application settings and configuration';
COMMENT ON TABLE modules IS 'Available modules (flights, hotels, tours, etc.)';
COMMENT ON TABLE currencies IS 'Supported currencies with exchange rates';
COMMENT ON TABLE languages IS 'Supported languages for i18n';
COMMENT ON TABLE countries IS 'Country list for locations';
COMMENT ON TABLE locations IS 'City/location data for search';
