-- Add MFA column to user_settings table
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS mfa jsonb DEFAULT '{
  "factor_id": null,
  "friendly_name": null,
  "factor_type": null,
  "status": null,
  "phone": null
}'::jsonb;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_mfa ON user_settings USING gin (mfa);