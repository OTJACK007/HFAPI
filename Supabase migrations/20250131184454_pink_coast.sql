-- Drop existing enterprise policies
DROP POLICY IF EXISTS "View own or member enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create own enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update own or admin enterprises" ON enterprises;

-- Create improved enterprise policies
CREATE POLICY "View enterprises"
ON enterprises FOR SELECT
USING (true);

CREATE POLICY "Create enterprises"
ON enterprises FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Update enterprises"
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

CREATE POLICY "Delete enterprises"
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enterprises_created_by 
ON enterprises(created_by);

CREATE INDEX IF NOT EXISTS idx_enterprises_id 
ON enterprises(id);