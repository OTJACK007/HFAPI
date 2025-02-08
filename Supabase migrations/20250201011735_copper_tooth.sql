-- Drop existing problematic policies
DROP POLICY IF EXISTS "View enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
DROP POLICY IF EXISTS "Delete enterprises" ON enterprises;
DROP POLICY IF EXISTS "View enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members during creation" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members by admin" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;

-- Create function to handle default enterprise creation
CREATE OR REPLACE FUNCTION handle_default_enterprise(p_user_id uuid)
RETURNS uuid AS $$
DECLARE
  v_enterprise_id uuid;
BEGIN
  -- Try to get first enterprise where user is a member
  SELECT enterprise_id INTO v_enterprise_id
  FROM enterprise_members
  WHERE user_id = p_user_id
  ORDER BY created_at ASC
  LIMIT 1;

  -- If no enterprise exists, create a new one
  IF v_enterprise_id IS NULL THEN
    INSERT INTO enterprises (name, slug, created_by)
    VALUES (
      'My Enterprise',
      'my-enterprise-' || LOWER(REPLACE(gen_random_uuid()::text, '-', '')),
      p_user_id
    )
    RETURNING id INTO v_enterprise_id;

    -- Create owner membership
    INSERT INTO enterprise_members (
      enterprise_id,
      user_id,
      role,
      is_default
    )
    VALUES (
      v_enterprise_id,
      p_user_id,
      'owner',
      true
    );
  ELSE
    -- Set first enterprise as default if no default exists
    UPDATE enterprise_members
    SET is_default = true
    WHERE enterprise_id = v_enterprise_id
    AND user_id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE user_id = p_user_id
      AND is_default = true
    );
  END IF;

  RETURN v_enterprise_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simple enterprise policies
CREATE POLICY "View enterprises"
ON enterprises FOR SELECT
USING (true);

CREATE POLICY "Create enterprises"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Update enterprises"
ON enterprises FOR UPDATE
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprises"
ON enterprises FOR DELETE
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role = 'owner'
  )
);

-- Create simple enterprise members policies
CREATE POLICY "View enterprise members"
ON enterprise_members FOR SELECT
USING (true);

CREATE POLICY "Insert members during creation"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow owner self-insertion during enterprise creation
  (
    auth.uid() = user_id AND
    role = 'owner' AND
    EXISTS (
      SELECT 1 FROM enterprises
      WHERE id = enterprise_id
      AND created_by = auth.uid()
    )
  )
);

CREATE POLICY "Insert members by admin"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow member insertion by owners/admins
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Update enterprise members"
ON enterprise_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprise members"
ON enterprise_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_enterprise_members_user_role 
ON enterprise_members(user_id, role);

CREATE INDEX IF NOT EXISTS idx_enterprise_members_enterprise_user 
ON enterprise_members(enterprise_id, user_id);

CREATE INDEX IF NOT EXISTS idx_enterprises_created_by 
ON enterprises(created_by);

CREATE INDEX IF NOT EXISTS idx_enterprise_members_is_default
ON enterprise_members(user_id, is_default) WHERE is_default = true;