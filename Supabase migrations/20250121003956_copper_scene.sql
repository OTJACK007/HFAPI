-- Enable storage by default
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create enterprise assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('enterprise-assets', 'enterprise-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for enterprise assets
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'enterprise-assets' );

CREATE POLICY "Auth users can upload enterprise assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'enterprise-assets' 
  AND (storage.foldername(name))[1] = 'enterprises'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Enterprise owners/admins can update assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'enterprise-assets'
  AND EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = (storage.foldername(name))[2]::uuid
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Enterprise owners/admins can delete assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'enterprise-assets'
  AND EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = (storage.foldername(name))[2]::uuid
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Update enterprises table to add logo_url column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'enterprises' 
    AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE enterprises ADD COLUMN logo_url text;
  END IF;
END $$;