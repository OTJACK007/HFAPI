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
  updated_at timestamptz,
  enterprise_name text
) AS $$
BEGIN
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
    i.updated_at,
    e.name as enterprise_name
  FROM enterprise_invitations i
  JOIN enterprises e ON e.id = i.enterprise_id
  WHERE i.token = p_token
  AND i.status = 'pending'
  AND i.expires_at > now()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle invitation acceptance after email verification
CREATE OR REPLACE FUNCTION handle_verified_invitation_acceptance(
  p_user_id uuid,
  p_token text
)
RETURNS boolean AS $$
DECLARE
  v_invitation enterprise_invitations;
  v_current_time timestamptz;
BEGIN
  -- Get current timestamp
  v_current_time := now();

  -- Get and validate invitation
  SELECT * INTO v_invitation
  FROM enterprise_invitations
  WHERE token = p_token
  AND status = 'pending'
  AND expires_at > v_current_time;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if user's email is verified
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_user_id 
    AND email_confirmed_at IS NOT NULL
  ) THEN
    RETURN false;
  END IF;

  -- Add member to enterprise
  INSERT INTO enterprise_members (
    enterprise_id,
    user_id,
    role,
    added_by,
    is_default
  ) VALUES (
    v_invitation.enterprise_id,
    p_user_id,
    v_invitation.role,
    v_invitation.invited_by,
    NOT EXISTS (
      SELECT 1 FROM enterprise_members 
      WHERE user_id = p_user_id
    )
  );

  -- Update invitation status
  UPDATE enterprise_invitations
  SET 
    status = 'accepted',
    updated_at = v_current_time
  WHERE id = v_invitation.id;

  -- Create notification for inviter
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  )
  SELECT
    v_invitation.invited_by,
    'invitation_accepted',
    'Invitation Accepted',
    'Your invitation has been accepted',
    jsonb_build_object(
      'invitation_id', v_invitation.id,
      'enterprise_id', v_invitation.enterprise_id,
      'email', v_invitation.email,
      'role', v_invitation.role
    );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;