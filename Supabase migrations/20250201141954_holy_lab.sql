-- Drop existing function if it exists
DROP FUNCTION IF EXISTS invite_user_to_enterprise;

-- Create function to invite user to enterprise with fixed expiry
CREATE OR REPLACE FUNCTION invite_user_to_enterprise(
  p_enterprise_id uuid,
  p_email text,
  p_role enterprise_role DEFAULT 'member'::enterprise_role
)
RETURNS uuid AS $$
DECLARE
  v_token text;
  v_invitation_id uuid;
  v_current_time timestamptz;
BEGIN
  -- Check if inviter has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = p_enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to invite members';
  END IF;

  -- Get current timestamp
  v_current_time := now();

  -- Generate secure token
  v_token := encode(gen_random_bytes(32), 'hex');

  -- Create invitation
  INSERT INTO enterprise_invitations (
    enterprise_id,
    email,
    role,
    invited_by,
    token,
    status,
    created_at,
    expires_at
  ) VALUES (
    p_enterprise_id,
    p_email,
    p_role,
    auth.uid(),
    v_token,
    'pending',
    v_current_time,
    v_current_time + interval '1 hour'
  )
  RETURNING id INTO v_invitation_id;

  RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;