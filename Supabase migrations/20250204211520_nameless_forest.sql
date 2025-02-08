-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE kyc_document_type AS ENUM (
    'passport',
    'drivers_license',
    'national_id'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM (
    'pending',
    'processing',
    'verified',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE risk_score AS ENUM (
    'low',
    'medium',
    'high'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create KYC documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type kyc_document_type NOT NULL,
  number text NOT NULL,
  issue_date date,
  expiry_date date,
  issuing_country text NOT NULL,
  verified boolean DEFAULT false,
  verification_method text CHECK (verification_method IN ('ai', 'manual', 'hybrid')),
  verification_date timestamptz,
  status verification_status DEFAULT 'pending',
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create KYC verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  document_id uuid REFERENCES kyc_documents(id) ON DELETE CASCADE,
  liveness_check_id uuid,
  status verification_status DEFAULT 'pending',
  risk_score risk_score DEFAULT 'low',
  verification_date timestamptz,
  expiry_date timestamptz,
  verified_by uuid REFERENCES auth.users(id),
  rejection_reason text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create liveness checks table
CREATE TABLE IF NOT EXISTS liveness_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id uuid REFERENCES kyc_verifications(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'pending',
  score decimal,
  attempts integer DEFAULT 0,
  last_attempt_date timestamptz,
  failure_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE liveness_checks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "View KYC documents"
ON kyc_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM kyc_verifications v
    JOIN enterprise_members m ON v.enterprise_id = m.enterprise_id
    WHERE v.document_id = kyc_documents.id
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "View KYC verifications"
ON kyc_verifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = kyc_verifications.enterprise_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "View liveness checks"
ON liveness_checks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM kyc_verifications v
    JOIN enterprise_members m ON v.enterprise_id = m.enterprise_id
    WHERE v.liveness_check_id = liveness_checks.id
    AND m.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_kyc_verifications_customer_id 
ON kyc_verifications(customer_id);

CREATE INDEX idx_kyc_verifications_enterprise_id 
ON kyc_verifications(enterprise_id);

CREATE INDEX idx_kyc_verifications_status 
ON kyc_verifications(status);

CREATE INDEX idx_kyc_verifications_risk_score 
ON kyc_verifications(risk_score);

CREATE INDEX idx_liveness_checks_verification_id 
ON liveness_checks(verification_id);

CREATE INDEX idx_liveness_checks_status 
ON liveness_checks(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_kyc_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_kyc_documents_timestamp
  BEFORE UPDATE ON kyc_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_kyc_timestamp();

CREATE TRIGGER update_kyc_verifications_timestamp
  BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_kyc_timestamp();

CREATE TRIGGER update_liveness_checks_timestamp
  BEFORE UPDATE ON liveness_checks
  FOR EACH ROW
  EXECUTE FUNCTION update_kyc_timestamp();