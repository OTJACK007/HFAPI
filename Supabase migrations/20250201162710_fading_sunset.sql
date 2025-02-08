-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_invitation_by_token;

-- Create improved function to get invitation by token without auth check
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
  SET search_path = public;
  RETURN QUERY
  SELECT 
    i.id,
    i.enterprise_id,
    i.email,
    i.role::text,
    i.token,
    i.invited_by,
    i.status,
    i.expires_at,
    i.created_at,
    i.updated_at
  FROM enterprise_invitations i
  WHERE i.token = p_token
  AND i.status = 'pending'
  AND i.expires_at > now()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to cancel invitation
CREATE OR REPLACE FUNCTION cancel_invitation(p_invitation_id uuid)
RETURNS void AS $$
BEGIN
  SET search_path = public;
  UPDATE enterprise_invitations
  SET 
    status = 'cancelled',
    updated_at = now()
  WHERE id = p_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;