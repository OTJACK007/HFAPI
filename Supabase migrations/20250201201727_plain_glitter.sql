-- Insert individual customers
INSERT INTO public.individual_customers (
  id,
  first_name,
  last_name,
  email,
  phone_number,
  date_of_birth,
  nationality,
  identification_type,
  identification_number,
  verification_status,
  verification_date,
  risk_score,
  verified_by_ai,
  verified_manually,
  need_manual_verification
) VALUES
  (
    '123e4567-e89b-12d3-a456-426614174000', -- ID: 1
    'John',
    'Doe',
    'john@example.com',
    '+1234567890',
    '1990-05-10',
    'US',
    'Passport',
    'ABC1234567',
    'verified',
    '2024-01-25',
    'low',
    TRUE,
    TRUE,
    FALSE
  ),
  (
    '223e4567-e89b-12d3-a456-426614174000', -- ID: 2
    'Jane',
    'Smith',
    'jane@example.com',
    '+9876543210',
    '1985-08-20',
    'UK',
    'ID Card',
    'XYZ9876543',
    'pending',
    '2024-01-26',
    'medium',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    '323e4567-e89b-12d3-a456-426614174000', -- ID: 3
    'Bob',
    'Wilson',
    'bob@example.com',
    '+1122334455',
    '1993-12-15',
    'CA',
    'Passport',
    'LMN5678901',
    'rejected',
    '2024-01-24',
    'high',
    FALSE,
    TRUE,
    FALSE
  );

-- Insert business customers
INSERT INTO public.business_customers (
  id,
  business_name,
  email,
  phone_number,
  registration_number,
  tax_id,
  legal_structure,
  country_of_registration,
  representative_id,
  verification_status,
  verification_date,
  risk_score,
  verified_by_ai,
  verified_manually,
  need_manual_verification
) VALUES
  (
    '423e4567-e89b-12d3-a456-426614174000', -- ID: 1
    'Acme Corp',
    'contact@acme.com',
    '+9998887777',
    'REG123456',
    'TAX9876',
    'SAS',
    'US',
    '123e4567-e89b-12d3-a456-426614174000', -- John Doe
    'verified',
    '2024-01-22',
    'low',
    TRUE,
    TRUE,
    FALSE
  ),
  (
    '523e4567-e89b-12d3-a456-426614174000', -- ID: 2
    'Beta Ltd',
    'info@beta.com',
    '+8887776666',
    'REG654321',
    'TAX5432',
    'SARL',
    'UK',
    '223e4567-e89b-12d3-a456-426614174000', -- Jane Smith
    'pending',
    '2024-01-27',
    'medium',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    '623e4567-e89b-12d3-a456-426614174000', -- ID: 3
    'Gamma Inc',
    'hello@gamma.com',
    '+7776665555',
    'REG111222',
    'TAX6789',
    'LLC',
    'CA',
    '323e4567-e89b-12d3-a456-426614174000', -- Bob Wilson
    'rejected',
    '2024-01-23',
    'high',
    FALSE,
    TRUE,
    FALSE
  );

-- Insert individual customer enterprise relationships
INSERT INTO public.individual_customer_enterprises (
  individual_customer_id,
  enterprise_id
) VALUES
  -- John Doe (ID: 1) associated with enterprises 1 and 2
  ('123e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  ('123e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 1 LIMIT 1)),
  
  -- Jane Smith (ID: 2) associated with enterprise 3
  ('223e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 2 LIMIT 1)),
  
  -- Bob Wilson (ID: 3) associated with enterprises 1 and 3
  ('323e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  ('323e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 2 LIMIT 1));

-- Insert business customer enterprise relationships
INSERT INTO public.business_customer_enterprises (
  business_customer_id,
  enterprise_id
) VALUES
  -- Acme Corp (ID: 1) associated with enterprises 2 and 3
  ('423e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 1 LIMIT 1)),
  ('423e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 2 LIMIT 1)),
  
  -- Beta Ltd (ID: 2) associated with enterprise 1
  ('523e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  
  -- Gamma Inc (ID: 3) associated with enterprises 1 and 2
  ('623e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  ('623e4567-e89b-12d3-a456-426614174000', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 1 LIMIT 1));