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
  SELECT 
    enterprise_invitations.id,
    enterprise_invitations.enterprise_id,
    enterprise_invitations.email,
    enterprise_invitations.role::text,
    enterprise_invitations.token,
    enterprise_invitations.invited_by,
    enterprise_invitations.status,
    enterprise_invitations.expires_at,
    enterprise_invitations.created_at,
    enterprise_invitations.updated_at
  FROM enterprise_invitations
  WHERE enterprise_invitations.token = p_token
  AND enterprise_invitations.status = 'pending'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;