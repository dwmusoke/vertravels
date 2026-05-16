-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0025: Fix PNR ingestion RLS/access
-- ========================================

ALTER TABLE pnr_ingestion_batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE pnr_ingestion_records DISABLE ROW LEVEL SECURITY;
