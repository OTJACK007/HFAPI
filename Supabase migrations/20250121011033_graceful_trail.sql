-- Add delete policy for enterprises
CREATE POLICY "Owners and admins can delete enterprises"
ON enterprises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = enterprises.id
    AND enterprise_members.user_id = auth.uid()
    AND enterprise_members.role IN ('owner', 'admin')
  )
);

-- Add cascade delete trigger for enterprise deletion
CREATE OR REPLACE FUNCTION handle_enterprise_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all enterprise members
  DELETE FROM enterprise_members WHERE enterprise_id = OLD.id;
  
  -- Delete all API keys
  DELETE FROM api_keys WHERE enterprise_id = OLD.id;
  
  -- Delete all enterprise invites
  DELETE FROM enterprise_invites WHERE enterprise_id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for enterprise deletion
DROP TRIGGER IF EXISTS on_enterprise_delete ON enterprises;
CREATE TRIGGER on_enterprise_delete
  BEFORE DELETE ON enterprises
  FOR EACH ROW
  EXECUTE FUNCTION handle_enterprise_deletion();