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
    'e89d6d42-8a1e-4c8b-b6a0-cf7b96a4d6c8', -- ID: 1
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
    'f7c8d9e0-1a2b-3c4d-5e6f-123456789abc', -- ID: 2 (fixed UUID)
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
    'a1b2c3d4-5e6f-7890-1234-567890123456', -- ID: 3 (fixed UUID)
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
    'b1c2d3e4-5f67-8901-2345-678901234567', -- ID: 1 (fixed UUID)
    'Acme Corp',
    'contact@acme.com',
    '+9998887777',
    'REG123456',
    'TAX9876',
    'SAS',
    'US',
    'e89d6d42-8a1e-4c8b-b6a0-cf7b96a4d6c8', -- John Doe
    'verified',
    '2024-01-22',
    'low',
    TRUE,
    TRUE,
    FALSE
  ),
  (
    'c2d3e4f5-6789-0123-4567-890123456789', -- ID: 2 (fixed UUID)
    'Beta Ltd',
    'info@beta.com',
    '+8887776666',
    'REG654321',
    'TAX5432',
    'SARL',
    'UK',
    'f7c8d9e0-1a2b-3c4d-5e6f-123456789abc', -- Jane Smith
    'pending',
    '2024-01-27',
    'medium',
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'd3e4f5g6-7890-1234-5678-901234567890', -- ID: 3 (fixed UUID)
    'Gamma Inc',
    'hello@gamma.com',
    '+7776665555',
    'REG111222',
    'TAX6789',
    'LLC',
    'CA',
    'a1b2c3d4-5e6f-7890-1234-567890123456', -- Bob Wilson
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
  ('e89d6d42-8a1e-4c8b-b6a0-cf7b96a4d6c8', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  ('e89d6d42-8a1e-4c8b-b6a0-cf7b96a4d6c8', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 1 LIMIT 1)),
  
  -- Jane Smith (ID: 2) associated with enterprise 3
  ('f7c8d9e0-1a2b-3c4d-5e6f-123456789abc', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 2 LIMIT 1)),
  
  -- Bob Wilson (ID: 3) associated with enterprises 1 and 3
  ('a1b2c3d4-5e6f-7890-1234-567890123456', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  ('a1b2c3d4-5e6f-7890-1234-567890123456', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 2 LIMIT 1));

-- Insert business customer enterprise relationships
INSERT INTO public.business_customer_enterprises (
  business_customer_id,
  enterprise_id
) VALUES
  -- Acme Corp (ID: 1) associated with enterprises 2 and 3
  ('b1c2d3e4-5f67-8901-2345-678901234567', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 1 LIMIT 1)),
  ('b1c2d3e4-5f67-8901-2345-678901234567', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 2 LIMIT 1)),
  
  -- Beta Ltd (ID: 2) associated with enterprise 1
  ('c2d3e4f5-6789-0123-4567-890123456789', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  
  -- Gamma Inc (ID: 3) associated with enterprises 1 and 2
  ('d3e4f5g6-7890-1234-5678-901234567890', (SELECT id FROM enterprises ORDER BY created_at ASC LIMIT 1)),
  ('d3e4f5g6-7890-1234-5678-901234567890', (SELECT id FROM enterprises ORDER BY created_at ASC OFFSET 1 LIMIT 1));