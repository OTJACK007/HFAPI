/*
  # Add avatar_url to profiles table

  1. Changes
    - Add avatar_url column to profiles table if it doesn't exist
    - Set default avatar URL for existing profiles
*/

-- Add avatar_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
    
    -- Set default avatar URL for existing profiles
    UPDATE profiles 
    SET avatar_url = 'https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/PngTrasnparentHumanface.png'
    WHERE avatar_url IS NULL;
  END IF;
END $$;