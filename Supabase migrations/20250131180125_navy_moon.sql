-- Add phone_number column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text;

-- Update handle_new_user function to include phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  first_name_val text;
  last_name_val text;
  full_name_val text;
BEGIN
  -- Extract and validate user metadata
  first_name_val := COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1));
  last_name_val := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  full_name_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN last_name_val = '' THEN first_name_val
      ELSE first_name_val || ' ' || last_name_val
    END
  );

  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    phone_number,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    first_name_val,
    last_name_val,
    full_name_val,
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/PngTrasnparentHumanface.png'
    ),
    'user'
  );

  -- Create user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE LOG 'Error detail: %', SQLSTATE;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update update_profile function to handle phone_number
CREATE OR REPLACE FUNCTION update_profile(
  user_id uuid,
  first_name text,
  last_name text,
  full_name text,
  phone_number text,
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
    phone_number = COALESCE(update_profile.phone_number, profiles.phone_number),
    avatar_url = COALESCE(update_profile.avatar_url, profiles.avatar_url),
    updated_at = now()
  WHERE id = user_id
  RETURNING * INTO profile;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;