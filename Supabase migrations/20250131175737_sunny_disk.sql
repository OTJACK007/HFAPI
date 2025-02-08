-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Create storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update profiles table structure
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS fullname CASCADE;

-- Add full_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name text;
  END IF;
END $$;

-- Update existing profiles to set full_name
UPDATE public.profiles
SET full_name = CASE 
  WHEN last_name IS NULL OR last_name = '' THEN first_name
  ELSE first_name || ' ' || last_name
END
WHERE full_name IS NULL;

-- Drop existing profile policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create improved profile policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Function to update profile
CREATE OR REPLACE FUNCTION update_profile(
  user_id uuid,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text
)
RETURNS public.profiles AS $$
DECLARE
  profile public.profiles;
BEGIN
  UPDATE public.profiles
  SET
    first_name = COALESCE(update_profile.first_name, profiles.first_name),
    last_name = COALESCE(update_profile.last_name, profiles.last_name),
    full_name = COALESCE(update_profile.full_name, 
      CASE 
        WHEN update_profile.last_name IS NULL OR update_profile.last_name = '' 
        THEN update_profile.first_name
        ELSE update_profile.first_name || ' ' || update_profile.last_name
      END,
      profiles.full_name
    ),
    avatar_url = COALESCE(update_profile.avatar_url, profiles.avatar_url),
    updated_at = now()
  WHERE id = user_id
  RETURNING * INTO profile;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;