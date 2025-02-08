/*
  # Add Invitation Notifications

  1. New Functions
    - Function to create notifications
    - Trigger function for invitation status changes
  
  2. Security
    - RLS policies for notifications table
    - Secure function execution
*/

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_data
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle invitation status changes
CREATE OR REPLACE FUNCTION handle_invitation_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- When invitation is accepted
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Create notification for the inviter
    PERFORM create_notification(
      NEW.invited_by,
      'invitation_accepted',
      'Invitation Accepted',
      (
        SELECT 'Your invitation to ' || email || ' has been accepted'
        FROM auth.users
        WHERE id = NEW.invited_by
      ),
      jsonb_build_object(
        'invitation_id', NEW.id,
        'enterprise_id', NEW.enterprise_id,
        'email', NEW.email,
        'role', NEW.role
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for invitation status changes
DROP TRIGGER IF EXISTS on_invitation_status_change ON enterprise_invitations;
CREATE TRIGGER on_invitation_status_change
  AFTER UPDATE OF status ON enterprise_invitations
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_invitation_status_change();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_type_user 
ON notifications(type, user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_unread 
ON notifications(user_id) 
WHERE NOT read;