-- Drop existing enterprise policies
DROP POLICY IF EXISTS "View enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
DROP POLICY IF EXISTS "Delete enterprises" ON enterprises;

-- Create strict enterprise policies
CREATE POLICY "View own enterprises"
ON enterprises FOR SELECT
USING (
  -- User can only view enterprises where they are a member
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "Create own enterprises"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Update as owner or admin"
ON enterprises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete as owner"
ON enterprises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role = 'owner'
  )
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_enterprise_members_user_enterprise 
ON enterprise_members(user_id, enterprise_id);