-- First drop ALL existing policies to start fresh
DO $$ 
BEGIN
  -- Drop all policies on enterprises table
  DROP POLICY IF EXISTS "View enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Delete enterprises" ON enterprises;
  DROP POLICY IF EXISTS "View own enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Create own enterprises" ON enterprises;
  DROP POLICY IF EXISTS "Update as owner or admin" ON enterprises;
  DROP POLICY IF EXISTS "Delete as owner" ON enterprises;
  DROP POLICY IF EXISTS "Manage as owner or admin" ON enterprises;
END $$;

-- Create new policies with unique names
CREATE POLICY "enterprises_select_policy"
ON enterprises FOR SELECT
USING (
  -- User can only view enterprises where they are a member
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "enterprises_insert_policy"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "enterprises_update_policy"
ON enterprises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "enterprises_delete_policy"
ON enterprises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role = 'owner'
  )
);

-- Create index for better performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_enterprise_members_user_enterprise 
ON enterprise_members(user_id, enterprise_id);