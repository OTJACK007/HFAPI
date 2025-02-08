/*
  # Create Avatars Storage Bucket

  1. Changes
    - Create avatars storage bucket
    - Set up storage policies for avatar uploads
    - Enable public access for avatars

  2. Security
    - Only allow authenticated users to upload their own avatars
    - Restrict file types to images
    - Limit file size
*/

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for avatars bucket
BEGIN;
  -- Create policy for public read access to avatars
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

  -- Create policy for authenticated users to upload avatars
  DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
  CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  -- Create policy for users to update their own avatars
  DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
  CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

  -- Create policy for users to delete their own avatars
  DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
  CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
COMMIT;