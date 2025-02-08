-- Create profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  full_name text GENERATED ALWAYS AS (
    CASE
      WHEN last_name IS NULL THEN first_name
      ELSE first_name || ' ' || last_name
    END
  ) STORED,
  profile_picture text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  theme text DEFAULT 'dark',
  color_scheme text DEFAULT '#ff3366',
  notifications jsonb DEFAULT '{
    "browser": true,
    "categories": {},
    "content": {
      "new-episodes": true,
      "recommendations": true,
      "trending": true
    },
    "social": {
      "follows": true,
      "mentions": true,
      "replies": true
    },
    "system": {
      "maintenance": false,
      "security": true,
      "updates": true,
      "email": true,
      "emailFrequency": "immediate",
      "mobile": false,
      "quietHours": {
        "enabled": false,
        "end": "07:00",
        "start": "22:00",
        "sound": true
      }
    }
  }'::jsonb,
  language jsonb DEFAULT '{
    "language": "en",
    "region": "US",
    "timeZone": "auto",
    "dateFormat": "MM/DD/YYYY"
  }'::jsonb,
  privacy jsonb DEFAULT '{
    "show_profile": true,
    "allow_listening_activity": false,
    "share_library": true,
    "allow_friend_requests": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- User settings RLS policies
CREATE POLICY "Users can view own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON public.user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    profile_picture
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/PngTrasnparentHumanface.png'
    )
  );

  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to create profile and settings on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();