-- Drop ALL existing policies first to avoid conflicts
DO $$ 
BEGIN
  -- Drop old policy names
  DROP POLICY IF EXISTS "View enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Delete enterprises" ON enterprises;
  
  -- Drop new policy names in case they exist
  DROP POLICY IF EXISTS "enterprises_select_policy" ON enterprises;
  DROP POLICY IF EXISTS "enterprises_insert_policy" ON enterprises;
  DROP POLICY IF EXISTS "enterprises_update_policy" ON enterprises;
  DROP POLICY IF EXISTS "enterprises_delete_policy" ON enterprises;
  
  -- Drop member policies
  DROP POLICY IF EXISTS "View enterprise members" ON enterprise_members;
  DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
  DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
  DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;
  DROP POLICY IF EXISTS "members_select_policy" ON enterprise_members;
  DROP POLICY IF EXISTS "members_insert_policy" ON enterprise_members;
  DROP POLICY IF EXISTS "members_update_policy" ON enterprise_members;
  DROP POLICY IF EXISTS "members_delete_policy" ON enterprise_members;
END $$;

-- Create enterprise policies with new names
CREATE POLICY "enterprise_view_policy"
ON enterprises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
  )
  OR created_by = auth.uid()
);

CREATE POLICY "enterprise_create_policy"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "enterprise_update_policy"
ON enterprises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
  OR created_by = auth.uid()
);

CREATE POLICY "enterprise_delete_policy"
ON enterprises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role = 'owner'
  )
  OR created_by = auth.uid()
);

-- Create member policies with new names
CREATE POLICY "member_view_policy"
ON enterprise_members FOR SELECT
USING (true);

CREATE POLICY "member_create_policy"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow self-insertion during enterprise creation
  (
    auth.uid() = user_id
    AND role = 'owner'
    AND EXISTS (
      SELECT 1 FROM enterprises
      WHERE id = enterprise_id
      AND created_by = auth.uid()
    )
  )
  OR
  -- Allow member insertion by owners/admins
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "member_update_policy"
ON enterprise_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "member_delete_policy"
ON enterprise_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_enterprise_with_owner;

-- Create function to handle enterprise creation with proper permissions
CREATE OR REPLACE FUNCTION create_enterprise_with_owner(
  name text,
  slug text,
  description text DEFAULT NULL,
  logo_url text DEFAULT NULL,
  website text DEFAULT NULL
)
RETURNS enterprises AS $$
DECLARE
  new_enterprise enterprises;
BEGIN
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
    slug,
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