-- Drop existing function if it exists
DROP FUNCTION IF EXISTS set_default_enterprise(uuid, uuid);

-- Create improved set_default_enterprise function
CREATE OR REPLACE FUNCTION set_default_enterprise(
  p_enterprise_id uuid,
  p_user_id uuid
)
RETURNS boolean AS $$
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
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;