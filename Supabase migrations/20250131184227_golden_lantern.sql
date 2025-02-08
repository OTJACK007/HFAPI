-- Drop existing problematic policies
DROP POLICY IF EXISTS "View own enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;

-- Create non-recursive policies for enterprise members
CREATE POLICY "View own enterprise members"
ON enterprise_members FOR SELECT
USING (
  -- User can view members of enterprises they belong to
  enterprise_id IN (
    SELECT enterprise_id 
    FROM enterprise_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Insert enterprise members"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow self-insertion for enterprise creator
  (
    auth.uid() = user_id
    AND role = 'owner'
    AND EXISTS (
      SELECT 1 FROM enterprises e
      WHERE e.id = enterprise_id
      AND e.created_by = auth.uid()
    )
  )
  OR
  -- Allow member insertion by owners/admins
  (
    enterprise_id IN (
      SELECT em.enterprise_id 
      FROM enterprise_members em
      WHERE em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
    )
  )
);

CREATE POLICY "Update enterprise members"
ON enterprise_members FOR UPDATE
USING (
  -- Allow owners/admins to update members
  enterprise_id IN (
    SELECT em.enterprise_id 
    FROM enterprise_members em
    WHERE em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprise members"
ON enterprise_members FOR DELETE
USING (
  -- Allow owners/admins to delete members
  enterprise_id IN (
    SELECT em.enterprise_id 
    FROM enterprise_members em
    WHERE em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

-- Create indexes to improve policy performance
CREATE INDEX IF NOT EXISTS idx_enterprise_members_user_id 
ON enterprise_members(user_id);

CREATE INDEX IF NOT EXISTS idx_enterprise_members_enterprise_id 
ON enterprise_members(enterprise_id);

CREATE INDEX IF NOT EXISTS idx_enterprise_members_role 
ON enterprise_members(role);