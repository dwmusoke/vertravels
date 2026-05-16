-- Migration 0027: Fix VARCHAR(10) columns too small for real data
ALTER TABLE pnr_ingestion_records ALTER COLUMN pnr TYPE VARCHAR(50);
ALTER TABLE pnr_ingestion_records ALTER COLUMN ticket_number TYPE VARCHAR(30);
ALTER TABLE tickets ALTER COLUMN pnr TYPE VARCHAR(50);
ALTER TABLE tickets ALTER COLUMN ticket_number TYPE VARCHAR(30);
ALTER TABLE bookings ALTER COLUMN booking_ref TYPE VARCHAR(50);
ALTER TABLE bookings ALTER COLUMN pnr TYPE VARCHAR(50);
