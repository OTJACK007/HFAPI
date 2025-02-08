-- Add redirect URLs to KYC settings
ALTER TABLE kyc_settings
ADD COLUMN success_url text,
ADD COLUMN failure_url text;

-- Update function to get KYC settings
CREATE OR REPLACE FUNCTION get_kyc_settings(p_enterprise_id uuid)
RETURNS kyc_settings AS $$
DECLARE
  v_settings kyc_settings;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = p_enterprise_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to view KYC settings';
  END IF;

  -- Get or create settings
  SELECT * INTO v_settings
  FROM kyc_settings
  WHERE enterprise_id = p_enterprise_id;

  IF NOT FOUND THEN
    INSERT INTO kyc_settings (
      enterprise_id,
      success_url,
      failure_url
    )
    VALUES (
      p_enterprise_id,
      NULL,
      NULL
    )
    RETURNING * INTO v_settings;
  END IF;

  RETURN v_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;