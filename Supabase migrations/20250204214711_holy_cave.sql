-- Create KYC document buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('kyc-documents', 'kyc-documents', true),
  ('kyc-photos', 'kyc-photos', true),
  ('kyc-liveness', 'kyc-liveness', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for KYC buckets
BEGIN;
  -- Create policy for public read access
  DROP POLICY IF EXISTS "Public KYC Access" ON storage.objects;
  CREATE POLICY "Public KYC Access"
  ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('kyc-documents', 'kyc-photos', 'kyc-liveness')
  );

  -- Create policy for authenticated users to upload KYC documents
  DROP POLICY IF EXISTS "Auth users can upload KYC documents" ON storage.objects;
  CREATE POLICY "Auth users can upload KYC documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('kyc-documents', 'kyc-photos', 'kyc-liveness')
    AND auth.role() = 'authenticated'
  );

  -- Create policy for authenticated users to update KYC documents
  DROP POLICY IF EXISTS "Auth users can update KYC documents" ON storage.objects;
  CREATE POLICY "Auth users can update KYC documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('kyc-documents', 'kyc-photos', 'kyc-liveness')
    AND auth.role() = 'authenticated'
  );

  -- Create policy for authenticated users to delete KYC documents
  DROP POLICY IF EXISTS "Auth users can delete KYC documents" ON storage.objects;
  CREATE POLICY "Auth users can delete KYC documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('kyc-documents', 'kyc-photos', 'kyc-liveness')
    AND auth.role() = 'authenticated'
  );
COMMIT;