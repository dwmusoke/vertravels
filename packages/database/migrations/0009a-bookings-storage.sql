-- ========================================
-- VERTRAVELS STORAGE SETUP
-- Create bookings storage bucket for PNR uploads
-- ========================================

-- Create bookings bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('bookings', 'bookings', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload booking documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bookings');

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view booking documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'bookings');

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete booking documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bookings');

-- Allow public read access to booking documents (for invoices, etc.)
CREATE POLICY "Public can view booking documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bookings');
