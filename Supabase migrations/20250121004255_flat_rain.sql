-- Create enterprise-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('enterprise-assets', 'enterprise-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for enterprise assets bucket
BEGIN;
  -- Create policy for public read access
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'enterprise-assets' );

  -- Create policy for authenticated users to upload enterprise assets
  DROP POLICY IF EXISTS "Auth users can upload enterprise assets" ON storage.objects;
  CREATE POLICY "Auth users can upload enterprise assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'enterprise-assets' 
    AND auth.role() = 'authenticated'
  );

  -- Create policy for enterprise owners/admins to update assets
  DROP POLICY IF EXISTS "Enterprise owners/admins can update assets" ON storage.objects;
  CREATE POLICY "Enterprise owners/admins can update assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'enterprise-assets'
    AND auth.role() = 'authenticated'
  );

  -- Create policy for enterprise owners/admins to delete assets
  DROP POLICY IF EXISTS "Enterprise owners/admins can delete assets" ON storage.objects;
  CREATE POLICY "Enterprise owners/admins can delete assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'enterprise-assets'
    AND auth.role() = 'authenticated'
  );
COMMIT;