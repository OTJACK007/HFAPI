-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "View individual customers" ON individual_customers;
  DROP POLICY IF EXISTS "View business customers" ON business_customers;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Create or update individual_customers policies
CREATE POLICY "individual_customers_select_policy"
ON individual_customers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM individual_customer_enterprises ice
    JOIN enterprise_members em ON ice.enterprise_id = em.enterprise_id
    WHERE ice.individual_customer_id = individual_customers.id
    AND em.user_id = auth.uid()
  )
);

CREATE POLICY "individual_customers_insert_policy"
ON individual_customers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "individual_customers_update_policy"
ON individual_customers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM individual_customer_enterprises ice
    JOIN enterprise_members em ON ice.enterprise_id = em.enterprise_id
    WHERE ice.individual_customer_id = individual_customers.id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

-- Create or update business_customers policies
CREATE POLICY "business_customers_select_policy"
ON business_customers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM business_customer_enterprises bce
    JOIN enterprise_members em ON bce.enterprise_id = em.enterprise_id
    WHERE bce.business_customer_id = business_customers.id
    AND em.user_id = auth.uid()
  )
);

CREATE POLICY "business_customers_insert_policy"
ON business_customers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "business_customers_update_policy"
ON business_customers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM business_customer_enterprises bce
    JOIN enterprise_members em ON bce.enterprise_id = em.enterprise_id
    WHERE bce.business_customer_id = business_customers.id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_individual_customers_verification_status 
ON individual_customers(verification_status);

CREATE INDEX IF NOT EXISTS idx_individual_customers_risk_score 
ON individual_customers(risk_score);

CREATE INDEX IF NOT EXISTS idx_business_customers_verification_status 
ON business_customers(verification_status);

CREATE INDEX IF NOT EXISTS idx_business_customers_risk_score 
ON business_customers(risk_score);

-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION update_customer_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps if they don't exist
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