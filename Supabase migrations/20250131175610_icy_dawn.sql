-- Drop existing policies
DROP POLICY IF EXISTS "View enterprises" ON enterprises;
DROP POLICY IF EXISTS "Create enterprises" ON enterprises;
DROP POLICY IF EXISTS "Update enterprises" ON enterprises;

-- Create improved RLS policies for enterprises
CREATE POLICY "View own or member enterprises"
ON enterprises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
  )
  OR created_by = auth.uid()
);

CREATE POLICY "Create own enterprises"
ON enterprises FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Update own or admin enterprises"
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

-- API Keys policies
DROP POLICY IF EXISTS "View API keys" ON api_keys;
DROP POLICY IF EXISTS "Manage API keys" ON api_keys;

CREATE POLICY "View own enterprise API keys"
ON api_keys FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = api_keys.enterprise_id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "Manage own enterprise API keys"
ON api_keys FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = api_keys.enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Webhook policies
DROP POLICY IF EXISTS "View webhook events" ON webhook_events;
DROP POLICY IF EXISTS "View enterprise webhooks" ON enterprise_webhooks;
DROP POLICY IF EXISTS "Create enterprise webhooks" ON enterprise_webhooks;
DROP POLICY IF EXISTS "Update enterprise webhooks" ON enterprise_webhooks;
DROP POLICY IF EXISTS "Delete enterprise webhooks" ON enterprise_webhooks;

-- Webhook events policies
CREATE POLICY "View own enterprise webhook events"
ON webhook_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_webhooks w
    JOIN enterprise_members m ON w.enterprise_id = m.enterprise_id
    WHERE w.id = webhook_events.webhook_id
    AND m.user_id = auth.uid()
  )
);

-- Enterprise webhooks policies
CREATE POLICY "View own enterprise webhooks"
ON enterprise_webhooks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_webhooks.enterprise_id
    AND enterprise_members.user_id = auth.uid()
  )
);

CREATE POLICY "Create own enterprise webhooks"
ON enterprise_webhooks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_webhooks.enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Update own enterprise webhooks"
ON enterprise_webhooks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_webhooks.enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete own enterprise webhooks"
ON enterprise_webhooks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprise_webhooks.enterprise_id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Enterprise members policies
DROP POLICY IF EXISTS "View enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;

CREATE POLICY "View own enterprise members"
ON enterprise_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
    AND em.user_id = auth.uid()
  )
);

CREATE POLICY "Insert enterprise members"
ON enterprise_members FOR INSERT
WITH CHECK (
  -- Allow self-insertion during enterprise creation
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
    EXISTS (
      SELECT 1 FROM enterprise_members em
      WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
    )
  )
);

CREATE POLICY "Update enterprise members"
ON enterprise_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Delete enterprise members"
ON enterprise_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members em
    WHERE em.enterprise_id = enterprise_members.enterprise_id
    AND em.user_id = auth.uid()
    AND em.role IN ('owner', 'admin')
  )
);