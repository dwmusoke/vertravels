-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0009: Add PNR URL fields to bookings
-- PostgreSQL (Supabase)
-- ========================================

-- Add pnr_url to main bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pnr_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS pnr VARCHAR(50);

-- Add pnr_document_url to flights_bookings table
ALTER TABLE flights_bookings
ADD COLUMN IF NOT EXISTS pnr_document_url VARCHAR(500);

-- Create index for PNR searches
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_flights_bookings_pnr ON flights_bookings(pnr);

-- Add comment
COMMENT ON COLUMN bookings.pnr_url IS 'URL to uploaded PNR document or booking confirmation';
COMMENT ON COLUMN bookings.pnr IS 'Passenger Name Record / Booking reference';
COMMENT ON COLUMN flights_bookings.pnr_document_url IS 'URL to uploaded PNR document or e-ticket';
