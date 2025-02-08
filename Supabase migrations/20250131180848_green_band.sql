-- First drop the existing functions that reference avatar_url
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_profile(uuid, text, text, text, text, text) CASCADE;

-- Rename the column
ALTER TABLE public.profiles 
RENAME COLUMN avatar_url TO profile_picture;

-- Recreate handle_new_user function with new column name
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
    profile_picture,
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

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate update_profile function with new column name
CREATE OR REPLACE FUNCTION public.update_profile(
  p_user_id uuid,
  p_first_name text,
  p_last_name text,
  p_full_name text,
  p_phone_number text,
  p_profile_picture text
)
RETURNS public.profiles AS $$
DECLARE
  profile public.profiles;
BEGIN
  UPDATE public.profiles
  SET
    first_name = COALESCE(p_first_name, profiles.first_name),
    last_name = COALESCE(p_last_name, profiles.last_name),
    full_name = COALESCE(p_full_name, 
      CASE 
        WHEN p_last_name IS NULL OR p_last_name = '' 
        THEN p_first_name
        ELSE p_first_name || ' ' || p_last_name
      END,
      profiles.full_name
    ),
    phone_number = COALESCE(p_phone_number, profiles.phone_number),
    profile_picture = COALESCE(p_profile_picture, profiles.profile_picture),
    updated_at = now()
  WHERE id = p_user_id
  RETURNING * INTO profile;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;