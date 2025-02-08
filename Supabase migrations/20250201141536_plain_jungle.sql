-- Drop existing function if it exists
DROP FUNCTION IF EXISTS accept_enterprise_invitation;

-- Create improved function to accept invitation
CREATE OR REPLACE FUNCTION accept_enterprise_invitation(
  p_token text
)
RETURNS boolean AS $$
DECLARE
  v_invitation enterprise_invitations;
  v_current_time timestamptz;
BEGIN
  -- Get current timestamp
  v_current_time := clock_timestamp();

  -- Get and validate invitation
  SELECT * INTO v_invitation
  FROM enterprise_invitations
  WHERE token = p_token
  AND status = 'pending'
  AND expires_at > v_current_time;

  IF NOT FOUND THEN
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
    auth.uid(),
    v_invitation.role,
    v_invitation.invited_by,
    NOT EXISTS (
      SELECT 1 FROM enterprise_members 
      WHERE user_id = auth.uid()
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