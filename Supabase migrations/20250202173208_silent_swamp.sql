-- Add first_login column to user_settings table
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS first_login boolean DEFAULT true;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_first_login 
ON user_settings(user_id) 
WHERE first_login = true;