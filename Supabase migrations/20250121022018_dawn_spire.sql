-- Add is_default column to enterprise_members if it doesn't exist
ALTER TABLE enterprise_members 
ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false;

-- Function to handle default enterprise setting
CREATE OR REPLACE FUNCTION set_default_enterprise(
  p_enterprise_id uuid,
  p_user_id uuid
)
RETURNS void AS $$
BEGIN
  -- First, set all enterprises for this user to not default
  UPDATE enterprise_members
  SET is_default = false
  WHERE user_id = p_user_id;
  
  -- Then set the specified enterprise as default
  UPDATE enterprise_members
  SET is_default = true
  WHERE enterprise_id = p_enterprise_id
  AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get default enterprise for a user
CREATE OR REPLACE FUNCTION get_default_enterprise(p_user_id uuid)
RETURNS uuid AS $$
DECLARE
  v_enterprise_id uuid;
BEGIN
  SELECT enterprise_id INTO v_enterprise_id
  FROM enterprise_members
  WHERE user_id = p_user_id
  AND is_default = true
  LIMIT 1;
  
  RETURN v_enterprise_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;