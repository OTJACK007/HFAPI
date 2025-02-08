-- Add function to get invitation by token without auth
CREATE OR REPLACE FUNCTION get_invitation_by_token(p_token text)
RETURNS TABLE (
  id uuid,
  enterprise_id uuid,
  email text,
  role text,
  token text,
  invited_by uuid,
  status text,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM enterprise_invitations
  WHERE token = p_token
  AND status = 'pending'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;