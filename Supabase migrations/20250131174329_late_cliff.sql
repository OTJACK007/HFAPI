-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update handle_new_user function with better error handling
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
  full_name_val := CASE 
    WHEN NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN NEW.raw_user_meta_data->>'full_name'
    WHEN last_name_val = '' THEN first_name_val
    ELSE first_name_val || ' ' || last_name_val
  END;

  -- First create the profile with validated data
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    first_name_val,
    last_name_val,
    full_name_val,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/PngTrasnparentHumanface.png'
    ),
    'user'
  );

  -- Then create user settings
  INSERT INTO public.user_settings (
    user_id,
    theme,
    color_scheme,
    notifications,
    language,
    privacy,
    professional_info
  ) VALUES (
    NEW.id,
    'dark',
    '#ff3366',
    jsonb_build_object(
      'browser', true,
      'categories', '{}',
      'content', jsonb_build_object(
        'new-episodes', true,
        'recommendations', true,
        'trending', true
      ),
      'social', jsonb_build_object(
        'follows', true,
        'mentions', true,
        'replies', true
      ),
      'system', jsonb_build_object(
        'maintenance', false,
        'security', true,
        'updates', true,
        'email', true,
        'emailFrequency', 'immediate',
        'mobile', false,
        'quietHours', jsonb_build_object(
          'enabled', false,
          'end', '07:00',
          'start', '22:00',
          'sound', true
        )
      )
    ),
    jsonb_build_object(
      'language', 'en',
      'region', 'US',
      'timeZone', 'auto',
      'dateFormat', 'MM/DD/YYYY'
    ),
    jsonb_build_object(
      'password_authentication', jsonb_build_object(
        'change_password', true,
        'phone_number_authentication', jsonb_build_object(
          'enabled', false,
          'phone_number', '',
          'verified', false
        ),
        'authenticator_app', jsonb_build_object(
          'enabled', false,
          'qr_code_url', '',
          'last_used', null
        )
      ),
      'privacy_settings', jsonb_build_object(
        'show_profile', true,
        'allow_listening_activity', false,
        'share_library', true,
        'allow_friend_requests', true
      ),
      'security_log', '[]'
    ),
    jsonb_build_object(
      'company', '',
      'jobTitle', '',
      'location', '',
      'website', ''
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error details to a table or raise notice
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);