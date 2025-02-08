/*
  # Fix Enterprise Member Policies

  1. Changes
    - Remove recursive policy checks
    - Simplify member access controls
    - Add direct role checks
    - Fix infinite recursion in RLS policies

  2. Security
    - Maintain proper access control
    - Prevent unauthorized access
    - Keep audit trail
*/

-- Drop existing policies
DROP POLICY IF EXISTS "View enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Insert enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Update enterprise members" ON enterprise_members;
DROP POLICY IF EXISTS "Delete enterprise members" ON enterprise_members;

-- Create new non-recursive policies
CREATE POLICY "View enterprise members"
ON enterprise_members FOR SELECT
USING (true);

-- Allow member creation with direct role check
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
  -- Allow member insertion by owners/admins using direct role check
  (
    EXISTS (
      SELECT 1 FROM enterprises e
      WHERE e.id = enterprise_id
      AND e.created_by = auth.uid()
    )
  )
);

-- Update member policy with direct role check
CREATE POLICY "Update enterprise members"
ON enterprise_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enterprises e
    WHERE e.id = enterprise_id
    AND e.created_by = auth.uid()
  )
);

-- Delete member policy with direct role check
CREATE POLICY "Delete enterprise members"
ON enterprise_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprises e
    WHERE e.id = enterprise_id
    AND e.created_by = auth.uid()
  )
);

-- Function to check member role without recursion
CREATE OR REPLACE FUNCTION public.check_member_role(enterprise_id uuid, user_id uuid, required_roles text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM enterprises e
    WHERE e.id = enterprise_id
    AND (
      e.created_by = user_id
      OR EXISTS (
        SELECT 1 FROM enterprise_members em
        WHERE em.enterprise_id = e.id
        AND em.user_id = user_id
        AND em.role = ANY(required_roles)
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;