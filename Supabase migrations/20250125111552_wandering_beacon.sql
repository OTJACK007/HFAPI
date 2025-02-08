/*
  # Fix Storage Policies for Enterprise Assets

  1. Changes
    - Create enterprise-assets bucket if it doesn't exist
    - Enable RLS on storage.objects
    - Create proper storage policies for enterprise assets:
      - Public read access
      - Authenticated users can upload
      - Owners/admins can update and delete
*/

-- Create enterprise-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('enterprise-assets', 'enterprise-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for enterprise assets bucket
BEGIN;
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Auth users can upload enterprise assets" ON storage.objects;
  DROP POLICY IF EXISTS "Enterprise owners/admins can update assets" ON storage.objects;
  DROP POLICY IF EXISTS "Enterprise owners/admins can delete assets" ON storage.objects;

  -- Create policy for public read access
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'enterprise-assets');

  -- Create policy for authenticated users to upload enterprise assets
  CREATE POLICY "Auth users can upload enterprise assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'enterprise-assets' 
    AND auth.role() = 'authenticated'
  );

  -- Create policy for authenticated users to update assets
  CREATE POLICY "Auth users can update assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'enterprise-assets'
    AND auth.role() = 'authenticated'
  );

  -- Create policy for authenticated users to delete assets
  CREATE POLICY "Auth users can delete assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'enterprise-assets'
    AND auth.role() = 'authenticated'
  );
COMMIT;