-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0022: Disable RLS on remaining admin tables
-- Tables missed by 0018 (covered here: pre-0019 tables only)
-- Tables from 0020+ already disable RLS themselves
-- ========================================

ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE destinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE queue_definitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE queue_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE queue_processing_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_stock DISABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE permission_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log DISABLE ROW LEVEL SECURITY;
