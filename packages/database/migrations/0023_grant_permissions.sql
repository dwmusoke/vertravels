-- ========================================
-- VERTRAVELS DATABASE SCHEMA
-- Migration 0023: Grant table & storage permissions
-- Enable RLS with permissive policies so anon key can write
-- ========================================

-- Settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on settings" ON settings;
CREATE POLICY "Allow all on settings" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- Email settings
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on email_settings" ON email_settings;
CREATE POLICY "Allow all on email_settings" ON email_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Storage: permissive policies for all buckets
DROP POLICY IF EXISTS "Allow all on pnr-ingestion" ON storage.objects;
CREATE POLICY "Allow all on pnr-ingestion" ON storage.objects
  FOR ALL USING (bucket_id = 'pnr-ingestion') WITH CHECK (bucket_id = 'pnr-ingestion');

DROP POLICY IF EXISTS "Allow all on reports" ON storage.objects;
CREATE POLICY "Allow all on reports" ON storage.objects
  FOR ALL USING (bucket_id = 'reports') WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Allow all on bsp-reports" ON storage.objects;
CREATE POLICY "Allow all on bsp-reports" ON storage.objects
  FOR ALL USING (bucket_id = 'bsp-reports') WITH CHECK (bucket_id = 'bsp-reports');

DROP POLICY IF EXISTS "Allow all on bookings" ON storage.objects;
CREATE POLICY "Allow all on bookings" ON storage.objects
  FOR ALL USING (bucket_id = 'bookings') WITH CHECK (bucket_id = 'bookings');

DROP POLICY IF EXISTS "Allow all on destination-images" ON storage.objects;
CREATE POLICY "Allow all on destination-images" ON storage.objects
  FOR ALL USING (bucket_id = 'destination-images') WITH CHECK (bucket_id = 'destination-images');

DROP POLICY IF EXISTS "Allow all on tour-images" ON storage.objects;
CREATE POLICY "Allow all on tour-images" ON storage.objects
  FOR ALL USING (bucket_id = 'tour-images') WITH CHECK (bucket_id = 'tour-images');

DROP POLICY IF EXISTS "Allow all on hotel-images" ON storage.objects;
CREATE POLICY "Allow all on hotel-images" ON storage.objects
  FOR ALL USING (bucket_id = 'hotel-images') WITH CHECK (bucket_id = 'hotel-images');

DROP POLICY IF EXISTS "Allow all on car-images" ON storage.objects;
CREATE POLICY "Allow all on car-images" ON storage.objects
  FOR ALL USING (bucket_id = 'car-images') WITH CHECK (bucket_id = 'car-images');

DROP POLICY IF EXISTS "Allow all on category-icons" ON storage.objects;
CREATE POLICY "Allow all on category-icons" ON storage.objects
  FOR ALL USING (bucket_id = 'category-icons') WITH CHECK (bucket_id = 'category-icons');

DROP POLICY IF EXISTS "Allow all on blog-images" ON storage.objects;
CREATE POLICY "Allow all on blog-images" ON storage.objects
  FOR ALL USING (bucket_id = 'blog-images') WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Allow all on cms-images" ON storage.objects;
CREATE POLICY "Allow all on cms-images" ON storage.objects
  FOR ALL USING (bucket_id = 'cms-images') WITH CHECK (bucket_id = 'cms-images');
