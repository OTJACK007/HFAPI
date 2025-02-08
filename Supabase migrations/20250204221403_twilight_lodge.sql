-- Create KYC sessions table
CREATE TABLE IF NOT EXISTS kyc_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '1 hour'),
  completed_at timestamptz,
  verification_id uuid REFERENCES kyc_verifications(id),
  api_key_id uuid REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL
);

-- Create KYC temporary data table
CREATE TABLE IF NOT EXISTS kyc_temp_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES kyc_sessions(id) ON DELETE CASCADE NOT NULL,
  form_data jsonb NOT NULL,
  document_urls text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '1 hour')
);

-- Enable RLS
ALTER TABLE kyc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_temp_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "View own enterprise sessions"
ON kyc_sessions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = kyc_sessions.enterprise_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "View session temp data"
ON kyc_temp_data FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM kyc_sessions s
    JOIN enterprise_members m ON s.enterprise_id = m.enterprise_id
    WHERE s.id = kyc_temp_data.session_id
    AND m.user_id = auth.uid()
  )
);

-- Create function to create KYC session
CREATE OR REPLACE FUNCTION create_kyc_session(
  p_enterprise_id uuid,
  p_customer_email text,
  p_customer_name text,
  p_api_key_id uuid
)
RETURNS uuid AS $$
DECLARE
  v_session_id uuid;
BEGIN
  -- Verify API key is valid and belongs to enterprise
  IF NOT EXISTS (
    SELECT 1 FROM api_keys
    WHERE id = p_api_key_id
    AND enterprise_id = p_enterprise_id
    AND revoked_at IS NULL
    AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RAISE EXCEPTION 'Invalid API key';
  END IF;

  -- Create session
  INSERT INTO kyc_sessions (
    enterprise_id,
    customer_email,
    customer_name,
    status,
    api_key_id
  ) VALUES (
    p_enterprise_id,
    p_customer_email,
    p_customer_name,
    'pending',
    p_api_key_id
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to store temporary KYC data
CREATE OR REPLACE FUNCTION store_kyc_temp_data(
  p_session_id uuid,
  p_form_data jsonb,
  p_document_urls text[]
)
RETURNS uuid AS $$
DECLARE
  v_temp_data_id uuid;
BEGIN
  -- Verify session exists and is pending
  IF NOT EXISTS (
    SELECT 1 FROM kyc_sessions
    WHERE id = p_session_id
    AND status = 'pending'
    AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'Invalid or expired session';
  END IF;

  -- Store temp data
  INSERT INTO kyc_temp_data (
    session_id,
    form_data,
    document_urls
  ) VALUES (
    p_session_id,
    p_form_data,
    p_document_urls
  )
  RETURNING id INTO v_temp_data_id;

  RETURN v_temp_data_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to cleanup expired data
CREATE OR REPLACE FUNCTION cleanup_expired_kyc_data()
RETURNS void AS $$
BEGIN
  -- Delete expired sessions
  DELETE FROM kyc_sessions
  WHERE status = 'pending'
  AND expires_at < now();

  -- Delete expired temp data
  DELETE FROM kyc_temp_data
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to cleanup expired data periodically
CREATE OR REPLACE FUNCTION trigger_cleanup_expired_data()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_expired_kyc_data();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that runs cleanup before insert
CREATE TRIGGER cleanup_expired_data_trigger
  BEFORE INSERT ON kyc_sessions
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_expired_data();

-- Create indexes for better performance
CREATE INDEX idx_kyc_sessions_enterprise_id 
ON kyc_sessions(enterprise_id);

CREATE INDEX idx_kyc_sessions_status 
ON kyc_sessions(status);

CREATE INDEX idx_kyc_sessions_expires_at 
ON kyc_sessions(expires_at) 
WHERE status = 'pending';

CREATE INDEX idx_kyc_temp_data_session_id 
ON kyc_temp_data(session_id);

CREATE INDEX idx_kyc_temp_data_expires_at 
ON kyc_temp_data(expires_at);

-- Create KYC storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('kyc-documents', 'kyc-documents', false),
  ('kyc-photos', 'kyc-photos', false),
  ('kyc-liveness', 'kyc-liveness', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for KYC buckets
CREATE POLICY "Enterprise members can view KYC files"
ON storage.objects FOR SELECT
USING (
  bucket_id IN ('kyc-documents', 'kyc-photos', 'kyc-liveness') AND
  EXISTS (
    SELECT 1 FROM kyc_sessions s
    JOIN enterprise_members m ON s.enterprise_id = m.enterprise_id
    WHERE split_part(name, '/', 1) = s.id::text
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can upload KYC files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('kyc-documents', 'kyc-photos', 'kyc-liveness') AND
  auth.role() = 'authenticated'
);