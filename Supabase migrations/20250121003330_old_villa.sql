-- Drop existing policies and functions
DROP POLICY IF EXISTS "View enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update enterprises" ON enterprises;
DROP POLICY IF EXISTS "View enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;
DROP FUNCTION IF EXISTS check_enterprise_role;

-- Create optimized role check function
CREATE OR REPLACE FUNCTION public.has_enterprise_role(enterprise_id uuid, required_roles text[])
RETURNS boolean AS $$
BEGIN
  -- Direct role check without recursion
  RETURN EXISTS (
    SELECT 1 
    FROM enterprise_members
    WHERE enterprise_members.enterprise_id = $1
      AND enterprise_members.user_id = auth.uid()
      AND enterprise_members.role = ANY($2)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enterprises policies
CREATE POLICY "enterprises_select_policy"
ON enterprises FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members
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
    SELECT 1 
    FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
      AND enterprise_members.user_id = auth.uid()
      AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Enterprise members policies
CREATE POLICY "members_select_policy"
ON enterprise_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
  )
);

CREATE POLICY "members_insert_policy"
ON enterprise_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "members_update_policy"
ON enterprise_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "members_delete_policy"
ON enterprise_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);

-- Enterprise invites policies
CREATE POLICY "invites_select_policy"
ON enterprise_invites FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_invites.enterprise_id
      AND em.user_id = auth.uid()
  )
);

CREATE POLICY "invites_insert_policy"
ON enterprise_invites FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_invites.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);

-- API keys policies
CREATE POLICY "api_keys_select_policy"
ON api_keys FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = api_keys.enterprise_id
      AND em.user_id = auth.uid()
  )
);

CREATE POLICY "api_keys_insert_policy"
ON api_keys FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = api_keys.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "api_keys_update_policy"
ON api_keys FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = api_keys.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "api_keys_delete_policy"
ON api_keys FOR DELETE
USING (
  EXISTS (
    SELECT 1 
    FROM enterprise_members em
    WHERE em.enterprise_id = api_keys.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
  )
);