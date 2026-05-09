-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0019: Agency Branding & Settings
-- PostgreSQL (Supabase)
-- ========================================

-- Add branding columns to agencies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'agencies' AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE agencies ADD COLUMN logo_url VARCHAR(500);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'agencies' AND column_name = 'favicon_url'
    ) THEN
        ALTER TABLE agencies ADD COLUMN favicon_url VARCHAR(500);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'agencies' AND column_name = 'primary_color'
    ) THEN
        ALTER TABLE agencies ADD COLUMN primary_color VARCHAR(7) DEFAULT '#0ea5e9';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'agencies' AND column_name = 'secondary_color'
    ) THEN
        ALTER TABLE agencies ADD COLUMN secondary_color VARCHAR(7) DEFAULT '#8b5cf6';
    END IF;
END $$;
