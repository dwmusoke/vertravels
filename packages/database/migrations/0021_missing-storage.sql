-- ========================================
-- VERTRAVELS STORAGE SETUP
-- Migration 0021: Missing storage buckets
-- Add pnr-ingestion, reports, bsp-reports buckets
-- ========================================

-- ========================================
-- PNR INGESTION BUCKET
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('pnr-ingestion', 'pnr-ingestion', true, 20971520, ARRAY['text/csv', 'text/plain', 'application/json', 'application/xml'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload PNR files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pnr-ingestion');

CREATE POLICY "Authenticated users can view PNR files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'pnr-ingestion');

CREATE POLICY "Authenticated users can delete PNR files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pnr-ingestion');

-- ========================================
-- REPORTS BUCKET (for daily sales CSV uploads)
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('reports', 'reports', true, 20971520, ARRAY['text/csv', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'reports');

CREATE POLICY "Authenticated users can view reports"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'reports');

CREATE POLICY "Authenticated users can delete reports"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'reports');

-- ========================================
-- BSP REPORTS BUCKET
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('bsp-reports', 'bsp-reports', true, 20971520, ARRAY['text/csv', 'text/plain', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload BSP reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bsp-reports');

CREATE POLICY "Authenticated users can view BSP reports"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'bsp-reports');

CREATE POLICY "Authenticated users can delete BSP reports"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bsp-reports');
