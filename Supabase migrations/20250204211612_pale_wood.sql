-- Create individual customers table
CREATE TABLE IF NOT EXISTS individual_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  date_of_birth date,
  nationality text,
  identification_type kyc_document_type,
  identification_number text,
  verification_status verification_status DEFAULT 'pending',
  verification_date timestamptz,
  risk_score risk_score DEFAULT 'low',
  verified_by_ai boolean DEFAULT false,
  verified_manually boolean DEFAULT false,
  need_manual_verification boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business customers table
CREATE TABLE IF NOT EXISTS business_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  registration_number text NOT NULL,
  tax_id text,
  legal_structure text,
  country_of_registration text NOT NULL,
  business_type text,
  industry text,
  website text,
  email text NOT NULL,
  phone_number text,
  representative_id uuid REFERENCES individual_customers(id),
  verification_status verification_status DEFAULT 'pending',
  verification_date timestamptz,
  risk_score risk_score DEFAULT 'low',
  verified_by_ai boolean DEFAULT false,
  verified_manually boolean DEFAULT false,
  need_manual_verification boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer-enterprise relationship tables
CREATE TABLE IF NOT EXISTS individual_customer_enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  individual_customer_id uuid REFERENCES individual_customers(id) ON DELETE CASCADE,
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(individual_customer_id, enterprise_id)
);

CREATE TABLE IF NOT EXISTS business_customer_enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_customer_id uuid REFERENCES business_customers(id) ON DELETE CASCADE,
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_customer_id, enterprise_id)
);

-- Enable RLS
ALTER TABLE individual_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_customer_enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_customer_enterprises ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "View individual customers"
ON individual_customers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM individual_customer_enterprises ice
    JOIN enterprise_members em ON ice.enterprise_id = em.enterprise_id
    WHERE ice.individual_customer_id = individual_customers.id
    AND em.user_id = auth.uid()
  )
);

CREATE POLICY "View business customers"
ON business_customers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM business_customer_enterprises bce
    JOIN enterprise_members em ON bce.enterprise_id = em.enterprise_id
    WHERE bce.business_customer_id = business_customers.id
    AND em.user_id = auth.uid()
  )
);

-- Create indexes for better performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_individual_customers_verification_status'
  ) THEN
    CREATE INDEX idx_individual_customers_verification_status 
    ON individual_customers(verification_status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_individual_customers_risk_score'
  ) THEN
    CREATE INDEX idx_individual_customers_risk_score 
    ON individual_customers(risk_score);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_business_customers_verification_status'
  ) THEN
    CREATE INDEX idx_business_customers_verification_status 
    ON business_customers(verification_status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_business_customers_risk_score'
  ) THEN
    CREATE INDEX idx_business_customers_risk_score 
    ON business_customers(risk_score);
  END IF;
END $$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_customer_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_individual_customers_timestamp ON individual_customers;
CREATE TRIGGER update_individual_customers_timestamp
  BEFORE UPDATE ON individual_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_timestamp();

DROP TRIGGER IF EXISTS update_business_customers_timestamp ON business_customers;
CREATE TRIGGER update_business_customers_timestamp
  BEFORE UPDATE ON business_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_timestamp();

-- Function to create individual customer
CREATE OR REPLACE FUNCTION create_individual_customer(
  p_enterprise_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone_number text DEFAULT NULL,
  p_date_of_birth date DEFAULT NULL,
  p_nationality text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_customer_id uuid;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = p_enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to create customers';
  END IF;

  -- Create customer
  INSERT INTO individual_customers (
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    nationality
  ) VALUES (
    p_first_name,
    p_last_name,
    p_email,
    p_phone_number,
    p_date_of_birth,
    p_nationality
  ) RETURNING id INTO v_customer_id;

  -- Create enterprise relationship
  INSERT INTO individual_customer_enterprises (
    individual_customer_id,
    enterprise_id
  ) VALUES (
    v_customer_id,
    p_enterprise_id
  );

  RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create business customer
CREATE OR REPLACE FUNCTION create_business_customer(
  p_enterprise_id uuid,
  p_business_name text,
  p_registration_number text,
  p_country_of_registration text,
  p_email text,
  p_phone_number text DEFAULT NULL,
  p_tax_id text DEFAULT NULL,
  p_legal_structure text DEFAULT NULL,
  p_business_type text DEFAULT NULL,
  p_industry text DEFAULT NULL,
  p_website text DEFAULT NULL,
  p_representative_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_customer_id uuid;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = p_enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to create customers';
  END IF;

  -- Create customer
  INSERT INTO business_customers (
    business_name,
    registration_number,
    country_of_registration,
    email,
    phone_number,
    tax_id,
    legal_structure,
    business_type,
    industry,
    website,
    representative_id
  ) VALUES (
    p_business_name,
    p_registration_number,
    p_country_of_registration,
    p_email,
    p_phone_number,
    p_tax_id,
    p_legal_structure,
    p_business_type,
    p_industry,
    p_website,
    p_representative_id
  ) RETURNING id INTO v_customer_id;

  -- Create enterprise relationship
  INSERT INTO business_customer_enterprises (
    business_customer_id,
    enterprise_id
  ) VALUES (
    v_customer_id,
    p_enterprise_id
  );

  RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get customer verification status
CREATE OR REPLACE FUNCTION get_customer_verification_status(
  p_customer_id uuid,
  p_customer_type text
)
RETURNS TABLE (
  verification_status verification_status,
  risk_score risk_score,
  verification_date timestamptz,
  verified_by_ai boolean,
  verified_manually boolean,
  need_manual_verification boolean,
  latest_verification_id uuid,
  latest_document_id uuid,
  latest_liveness_check_id uuid
) AS $$
BEGIN
  IF p_customer_type = 'individual' THEN
    RETURN QUERY
    SELECT 
      i.verification_status,
      i.risk_score,
      i.verification_date,
      i.verified_by_ai,
      i.verified_manually,
      i.need_manual_verification,
      v.id as latest_verification_id,
      v.document_id as latest_document_id,
      v.liveness_check_id as latest_liveness_check_id
    FROM individual_customers i
    LEFT JOIN kyc_verifications v ON v.customer_id = i.id
    WHERE i.id = p_customer_id
    ORDER BY v.created_at DESC
    LIMIT 1;
  ELSE
    RETURN QUERY
    SELECT 
      b.verification_status,
      b.risk_score,
      b.verification_date,
      b.verified_by_ai,
      b.verified_manually,
      b.need_manual_verification,
      v.id as latest_verification_id,
      v.document_id as latest_document_id,
      v.liveness_check_id as latest_liveness_check_id
    FROM business_customers b
    LEFT JOIN kyc_verifications v ON v.customer_id = b.id
    WHERE b.id = p_customer_id
    ORDER BY v.created_at DESC
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
