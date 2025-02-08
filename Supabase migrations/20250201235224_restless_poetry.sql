-- Drop existing function
DROP FUNCTION IF EXISTS create_enterprise_with_owner;

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_enterprise_slug(base_slug text)
RETURNS text AS $$
DECLARE
  new_slug text;
  counter integer := 1;
BEGIN
  -- Initial attempt with base slug
  new_slug := base_slug;
  
  -- Keep checking until we find a unique slug
  WHILE EXISTS (SELECT 1 FROM enterprises WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create improved enterprise creation function with unique slug generation
CREATE OR REPLACE FUNCTION create_enterprise_with_owner(
  name text,
  base_slug text,
  description text DEFAULT NULL,
  logo_url text DEFAULT NULL,
  website text DEFAULT NULL
)
RETURNS enterprises AS $$
DECLARE
  new_enterprise enterprises;
  unique_slug text;
BEGIN
  -- Generate unique slug
  unique_slug := generate_unique_enterprise_slug(base_slug);
  
  -- Create enterprise
  INSERT INTO enterprises (
    name,
    slug,
    description,
    logo_url,
    website,
    created_by
  )
  VALUES (
    name,
    unique_slug,
    description,
    logo_url,
    website,
    auth.uid()
  )
  RETURNING * INTO new_enterprise;
  
  -- Create owner membership
  INSERT INTO enterprise_members (
    enterprise_id,
    user_id,
    role,
    is_default,
    added_by
  )
  VALUES (
    new_enterprise.id,
    auth.uid(),
    'owner',
    NOT EXISTS (
      SELECT 1 FROM enterprise_members 
      WHERE user_id = auth.uid()
    ),
    auth.uid()
  );
  
  RETURN new_enterprise;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON enterprises TO authenticated;
GRANT ALL ON enterprise_members TO authenticated;
GRANT EXECUTE ON FUNCTION create_enterprise_with_owner TO authenticated;
GRANT EXECUTE ON FUNCTION generate_unique_enterprise_slug TO authenticated;