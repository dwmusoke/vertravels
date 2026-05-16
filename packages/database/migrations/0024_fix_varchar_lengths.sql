-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0024: Fix VARCHAR(3) columns that receive full names from CSV/API
-- ========================================

-- pnr_ingestion_records airline_code: CSV data may contain full airline names
ALTER TABLE pnr_ingestion_records ALTER COLUMN airline_code TYPE VARCHAR(100);

-- pnr_ingestion_batches: same field for source data
ALTER TABLE pnr_ingestion_batches ALTER COLUMN airline_code TYPE VARCHAR(100);

-- Ticket stock: airline prefixes can be longer  
ALTER TABLE ticket_stock ALTER COLUMN airline_code TYPE VARCHAR(100);
ALTER TABLE ticket_stock ALTER COLUMN ticket_prefix TYPE VARCHAR(10);

-- Tickets
ALTER TABLE tickets ALTER COLUMN airline_code TYPE VARCHAR(100);


