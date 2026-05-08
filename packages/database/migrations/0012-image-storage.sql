-- ========================================
-- VERTRAVELS STORAGE SETUP - IMAGES
-- Create storage buckets for platform images
-- ========================================

-- Create buckets for different image types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('destination-images', 'destination-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('tour-images', 'tour-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('hotel-images', 'hotel-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('car-images', 'car-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('category-icons', 'category-icons', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('cms-images', 'cms-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- DESTINATION IMAGES POLICIES
-- ========================================
CREATE POLICY "Public can view destination images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destination-images');

CREATE POLICY "Authenticated users can upload destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'destination-images');

CREATE POLICY "Authenticated users can delete destination images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'destination-images');

-- ========================================
-- TOUR IMAGES POLICIES
-- ========================================
CREATE POLICY "Public can view tour images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload tour images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can delete tour images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tour-images');

-- ========================================
-- HOTEL IMAGES POLICIES
-- ========================================
CREATE POLICY "Public can view hotel images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hotel-images');

CREATE POLICY "Authenticated users can upload hotel images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hotel-images');

CREATE POLICY "Authenticated users can delete hotel images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hotel-images');

-- ========================================
-- CAR IMAGES POLICIES
-- ========================================
CREATE POLICY "Public can view car images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can delete car images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'car-images');

-- ========================================
-- CATEGORY ICONS POLICIES
-- ========================================
CREATE POLICY "Public can view category icons"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'category-icons');

CREATE POLICY "Authenticated users can upload category icons"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'category-icons');

CREATE POLICY "Authenticated users can delete category icons"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'category-icons');

-- ========================================
-- BLOG IMAGES POLICIES
-- ========================================
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- ========================================
-- CMS IMAGES POLICIES
-- ========================================
CREATE POLICY "Public can view CMS images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can upload CMS images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can delete CMS images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cms-images');
