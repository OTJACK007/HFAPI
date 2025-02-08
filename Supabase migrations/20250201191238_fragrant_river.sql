-- Drop existing table and functions
DROP FUNCTION IF EXISTS request_audit_keys;
DROP TABLE IF EXISTS audit_key_requests;

-- Create audit_key_requests table with new structure
CREATE TABLE IF NOT EXISTS public.audit_key_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded')),
  decrypt_key text,
  access_key text,
  requested_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '3 days'),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index to ensure only one pending request per enterprise
CREATE UNIQUE INDEX idx_pending_audit_key_requests 
ON audit_key_requests(enterprise_id) 
WHERE status = 'pending';

-- Enable RLS
ALTER TABLE public.audit_key_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "View own enterprise audit key requests"
ON audit_key_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = audit_key_requests.enterprise_id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "Create audit key requests"
ON audit_key_requests FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = audit_key_requests.enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Function to handle audit key request
CREATE OR REPLACE FUNCTION request_audit_keys(p_enterprise_id uuid)
RETURNS uuid AS $$
DECLARE
  v_request_id uuid;
BEGIN
  -- Check if there's already a pending request
  IF EXISTS (
    SELECT 1 FROM audit_key_requests 
    WHERE enterprise_id = p_enterprise_id 
    AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'A pending request already exists for this enterprise';
  END IF;

  -- Create new request with 3-day expiration
  INSERT INTO audit_key_requests (
    enterprise_id,
    requested_by,
    expires_at
  ) VALUES (
    p_enterprise_id,
    auth.uid(),
    now() + interval '3 days'
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired requests
CREATE OR REPLACE FUNCTION cleanup_expired_audit_requests()
RETURNS void AS $$
BEGIN
  DELETE FROM audit_key_requests
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically clean up expired requests
CREATE OR REPLACE FUNCTION check_expired_requests()
RETURNS trigger AS $$
BEGIN
  -- Clean up expired requests when accessing the table
  DELETE FROM audit_key_requests
  WHERE expires_at < now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that runs cleanup on table access
CREATE TRIGGER cleanup_expired_requests
  BEFORE INSERT OR UPDATE OR SELECT ON audit_key_requests
  FOR EACH STATEMENT
  EXECUTE FUNCTION check_expired_requests();