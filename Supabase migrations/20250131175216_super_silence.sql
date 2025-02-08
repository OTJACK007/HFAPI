-- First create a temporary table with the new structure
CREATE TABLE IF NOT EXISTS public.profiles_temp (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Copy data from old table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
    INSERT INTO public.profiles_temp (
      id, email, first_name, last_name, full_name, avatar_url, role, created_at, updated_at
    )
    SELECT 
      id, email, first_name, last_name, 
      CASE 
        WHEN last_name IS NULL OR last_name = '' THEN first_name 
        ELSE first_name || ' ' || last_name 
      END,
      avatar_url, role, created_at, updated_at
    FROM public.profiles;
  END IF;
END $$;

-- Update foreign key constraints to point to the temporary table
DO $$ 
BEGIN
  -- Update user_settings foreign key
  ALTER TABLE public.user_settings
    DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
    
  ALTER TABLE public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Now we can safely drop and rename
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
    DROP TABLE public.profiles CASCADE;
  END IF;
END $$;

-- Rename temporary table to profiles
ALTER TABLE public.profiles_temp RENAME TO profiles;

-- Update handle_new_user function
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);