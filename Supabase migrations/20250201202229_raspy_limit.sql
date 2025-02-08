-- Create individual_customers table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_type WHERE typname = 'verification_status'
  ) THEN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_type WHERE typname = 'risk_score'
  ) THEN
    CREATE TYPE risk_score AS ENUM ('low', 'medium', 'high');
  END IF;
END $$;

-- Create tables with proper foreign key relationships
CREATE TABLE IF NOT EXISTS public.individual_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  identification_type VARCHAR(50) NOT NULL,
  identification_number VARCHAR(100) UNIQUE NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  verification_date TIMESTAMP,
  risk_score risk_score DEFAULT 'low',
  verified_by_ai BOOLEAN DEFAULT FALSE,
  verified_manually BOOLEAN DEFAULT FALSE,
  need_manual_verification BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.business_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  tax_id VARCHAR(100) UNIQUE NOT NULL,
  legal_structure VARCHAR(50) NOT NULL,
  country_of_registration VARCHAR(100) NOT NULL,
  representative_id uuid REFERENCES public.individual_customers(id) ON DELETE SET NULL,
  verification_status verification_status DEFAULT 'pending',
  verification_date TIMESTAMP,
  risk_score risk_score DEFAULT 'low',
  verified_by_ai BOOLEAN DEFAULT FALSE,
  verified_manually BOOLEAN DEFAULT FALSE,
  need_manual_verification BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create junction tables for many-to-many relationships
CREATE TABLE IF NOT EXISTS public.individual_customer_enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  individual_customer_id uuid REFERENCES public.individual_customers(id) ON DELETE CASCADE,
  enterprise_id uuid REFERENCES public.enterprises(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(individual_customer_id, enterprise_id)
);

CREATE TABLE IF NOT EXISTS public.business_customer_enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_customer_id uuid REFERENCES public.business_customers(id) ON DELETE CASCADE,
  enterprise_id uuid REFERENCES public.enterprises(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(business_customer_id, enterprise_id)
);

-- Enable RLS
ALTER TABLE public.individual_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_customer_enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_customer_enterprises ENABLE ROW LEVEL SECURITY;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_individual_customers_verification_status 
ON individual_customers(verification_status);

CREATE INDEX IF NOT EXISTS idx_individual_customers_risk_score 
ON individual_customers(risk_score);

CREATE INDEX IF NOT EXISTS idx_business_customers_verification_status 
ON business_customers(verification_status);

CREATE INDEX IF NOT EXISTS idx_business_customers_risk_score 
ON business_customers(risk_score);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_customer_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_individual_customers_timestamp
  BEFORE UPDATE ON individual_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_timestamp();

CREATE TRIGGER update_business_customers_timestamp
  BEFORE UPDATE ON business_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_timestamp();