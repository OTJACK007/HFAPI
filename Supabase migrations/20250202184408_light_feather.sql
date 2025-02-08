-- Remove MFA from user_settings jsonb
ALTER TABLE public.user_settings
DROP COLUMN IF EXISTS mfa;

-- Add dedicated MFA column
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS mfa_enabled boolean DEFAULT false;

-- Create function to handle MFA status changes
CREATE OR REPLACE FUNCTION handle_mfa_status_change()
RETURNS trigger AS $$
BEGIN
  -- When a new TOTP factor is verified
  IF NEW.status = 'verified' AND OLD.status != 'verified' THEN
    -- Update user_settings mfa_enabled flag
    UPDATE public.user_settings
    SET mfa_enabled = true
    WHERE user_id = auth.uid();
  END IF;

  -- When a TOTP factor is unenrolled
  IF TG_OP = 'DELETE' AND OLD.status = 'verified' THEN
    -- Check if user has any other verified factors
    IF NOT EXISTS (
      SELECT 1 FROM auth.mfa_factors
      WHERE user_id = auth.uid()
      AND status = 'verified'
      AND id != OLD.id
    ) THEN
      -- Update user_settings mfa_enabled flag
      UPDATE public.user_settings
      SET mfa_enabled = false
      WHERE user_id = auth.uid();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for MFA status changes
DROP TRIGGER IF EXISTS on_mfa_status_change ON auth.mfa_factors;
CREATE TRIGGER on_mfa_status_change
  AFTER INSERT OR UPDATE OR DELETE ON auth.mfa_factors
  FOR EACH ROW
  EXECUTE FUNCTION handle_mfa_status_change();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_mfa_enabled 
ON user_settings(user_id) 
WHERE mfa_enabled = true;