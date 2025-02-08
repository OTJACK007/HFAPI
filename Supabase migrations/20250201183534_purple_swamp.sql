-- Create api_key_requests table
CREATE TABLE IF NOT EXISTS public.api_key_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  encrypt_key text,
  access_key text,
  requested_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(enterprise_id, status) WHERE status = 'pending'
);

-- Enable RLS
ALTER TABLE public.api_key_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "View own enterprise key requests"
ON api_key_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = api_key_requests.enterprise_id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "Create key requests"
ON api_key_requests FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = api_key_requests.enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Create function to handle key request
CREATE OR REPLACE FUNCTION request_api_keys(p_enterprise_id uuid)
RETURNS uuid AS $$
DECLARE
  v_request_id uuid;
BEGIN
  -- Check if there's already a pending request
  IF EXISTS (
    SELECT 1 FROM api_key_requests 
    WHERE enterprise_id = p_enterprise_id 
    AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'A pending request already exists for this enterprise';
  END IF;

  -- Create new request
  INSERT INTO api_key_requests (
    enterprise_id,
    requested_by
  ) VALUES (
    p_enterprise_id,
    auth.uid()
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;