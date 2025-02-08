-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload enterprise assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete assets" ON storage.objects;

-- Create improved storage policies
CREATE POLICY "Public read access for enterprise assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'enterprise-assets');

CREATE POLICY "Authenticated users can upload enterprise assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'enterprise-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'enterprises'
);

CREATE POLICY "Authenticated users can update enterprise assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'enterprise-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'enterprises'
);

CREATE POLICY "Authenticated users can delete enterprise assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'enterprise-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'enterprises'
);

-- Create enterprise-assets bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('enterprise-assets', 'enterprise-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name 
ON storage.objects(bucket_id, name);