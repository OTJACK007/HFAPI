-- Drop existing enterprise members policies
DROP POLICY IF EXISTS "View members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert members" ON enterprise_members;
DROP POLICY IF EXISTS "Update members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete members" ON enterprise_members;

-- Create new non-recursive policies for enterprise members
CREATE POLICY "View enterprise members"
ON enterprise_members FOR SELECT
USING (
  -- User can view their own membership
  user_id = auth.uid()
  OR
  -- User can view members of enterprises they are a member of
  enterprise_id IN (
    SELECT enterprise_id 
    FROM enterprise_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Insert enterprise members"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow self-insertion for enterprise creators
  (
    auth.uid() = user_id 
    AND role = 'owner'
    AND enterprise_id IN (
      SELECT id 
      FROM enterprises 
      WHERE created_by = auth.uid()
    )
  )
  OR
  -- Allow member insertion by owners/admins
  (
    enterprise_id IN (
      SELECT enterprise_id 
      FROM enterprise_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  )
);

CREATE POLICY "Update enterprise members"
ON enterprise_members FOR UPDATE
USING (
  -- Only owners and admins can update members
  enterprise_id IN (
    SELECT enterprise_id 
    FROM enterprise_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprise members"
ON enterprise_members FOR DELETE
USING (
  -- Only owners and admins can delete members
  enterprise_id IN (
    SELECT enterprise_id 
    FROM enterprise_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Create optimized indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_enterprise_members_user_role 
ON enterprise_members(user_id, role);

CREATE INDEX IF NOT EXISTS idx_enterprise_members_enterprise_user 
ON enterprise_members(enterprise_id, user_id);