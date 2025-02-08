-- Drop existing problematic policies
DROP POLICY IF EXISTS "View enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
DROP POLICY IF EXISTS "Delete enterprises" ON enterprises;
DROP POLICY IF EXISTS "View enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;

-- Create materialized view for member roles to avoid recursion
DROP MATERIALIZED VIEW IF EXISTS member_roles;
CREATE MATERIALIZED VIEW member_roles AS
SELECT 
  user_id,
  enterprise_id,
  role
FROM enterprise_members;

-- Create unique index for materialized view
CREATE UNIQUE INDEX member_roles_unique_idx ON member_roles (user_id, enterprise_id);

-- Create function to refresh member roles
CREATE OR REPLACE FUNCTION refresh_member_roles()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY member_roles;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh member roles
DROP TRIGGER IF EXISTS refresh_member_roles_trigger ON enterprise_members;
CREATE TRIGGER refresh_member_roles_trigger
AFTER INSERT OR UPDATE OR DELETE ON enterprise_members
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_member_roles();

-- Create enterprise policies
CREATE POLICY "View enterprises"
ON enterprises FOR SELECT
USING (
  created_by = auth.uid() OR
  id IN (
    SELECT enterprise_id 
    FROM member_roles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Create enterprises"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Update enterprises"
ON enterprises FOR UPDATE
USING (
  created_by = auth.uid() OR
  id IN (
    SELECT enterprise_id 
    FROM member_roles 
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprises"
ON enterprises FOR DELETE
USING (
  created_by = auth.uid() OR
  id IN (
    SELECT enterprise_id 
    FROM member_roles 
    WHERE user_id = auth.uid()
    AND role = 'owner'
  )
);

-- Create enterprise members policies
CREATE POLICY "View members"
ON enterprise_members FOR SELECT
USING (
  user_id = auth.uid() OR
  enterprise_id IN (
    SELECT enterprise_id 
    FROM member_roles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Insert members"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Self-insertion for enterprise creator
  (
    auth.uid() = user_id AND
    role = 'owner' AND
    enterprise_id IN (
      SELECT id FROM enterprises WHERE created_by = auth.uid()
    )
  )
  OR
  -- Admin insertion of new members
  (
    enterprise_id IN (
      SELECT enterprise_id 
      FROM member_roles
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  )
);

CREATE POLICY "Update members"
ON enterprise_members FOR UPDATE
USING (
  enterprise_id IN (
    SELECT enterprise_id 
    FROM member_roles
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete members"
ON enterprise_members FOR DELETE
USING (
  enterprise_id IN (
    SELECT enterprise_id 
    FROM member_roles
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_member_roles_user_role 
ON member_roles(user_id, role);

CREATE INDEX IF NOT EXISTS idx_member_roles_enterprise_user 
ON member_roles(enterprise_id, user_id);

CREATE INDEX IF NOT EXISTS idx_enterprises_created_by 
ON enterprises(created_by);

-- Initial refresh of member roles view
REFRESH MATERIALIZED VIEW member_roles;