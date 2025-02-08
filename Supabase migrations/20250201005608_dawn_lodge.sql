-- Drop existing problematic policies
DROP POLICY IF EXISTS "View enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
DROP POLICY IF EXISTS "Delete enterprises" ON enterprises;
DROP POLICY IF EXISTS "View own enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;

-- Create improved enterprise policies
CREATE POLICY "View own or member enterprises"
ON enterprises FOR SELECT
USING (
  -- User can view enterprises they created
  created_by = auth.uid()
  OR 
  -- User can view enterprises where they are a member
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "Create own enterprises"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Update own or admin enterprises"
ON enterprises FOR UPDATE
USING (
  -- User can update enterprises they created
  created_by = auth.uid()
  OR
  -- Owners and admins can update enterprises
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete own or owner enterprises"
ON enterprises FOR DELETE
USING (
  -- User can delete enterprises they created
  created_by = auth.uid()
  OR
  -- Only owners can delete enterprises
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role = 'owner'
  )
);

-- Create enterprise members policies
CREATE POLICY "View own enterprise members"
ON enterprise_members FOR SELECT
USING (
  -- User can view members of enterprises where they are a member
  enterprise_id IN (
    SELECT enterprise_id 
    FROM enterprise_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Insert enterprise members"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow owner self-insertion during enterprise creation
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
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Update enterprise members"
ON enterprise_members FOR UPDATE
USING (
  -- Only owners and admins can update members
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprise members"
ON enterprise_members FOR DELETE
USING (
  -- Only owners and admins can delete members
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enterprise_members_user_role 
ON enterprise_members(user_id, role);

CREATE INDEX IF NOT EXISTS idx_enterprise_members_enterprise_user 
ON enterprise_members(enterprise_id, user_id);

CREATE INDEX IF NOT EXISTS idx_enterprises_created_by 
ON enterprises(created_by);