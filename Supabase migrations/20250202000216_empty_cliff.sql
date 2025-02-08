-- Drop existing function if it exists
DROP FUNCTION IF EXISTS handle_enterprise_deletion();

-- Create improved function to handle enterprise deletion
CREATE OR REPLACE FUNCTION handle_enterprise_deletion()
RETURNS TRIGGER AS $$
DECLARE
  logo_path text;
BEGIN
  -- Delete all enterprise members
  DELETE FROM enterprise_members WHERE enterprise_id = OLD.id;
  
  -- Delete all API keys
  DELETE FROM api_keys WHERE enterprise_id = OLD.id;
  
  -- Delete all enterprise invitations
  DELETE FROM enterprise_invitations WHERE enterprise_id = OLD.id;

  -- Delete logo from storage if it exists
  IF OLD.logo_url IS NOT NULL THEN
    -- Extract the file path from the URL
    logo_path := replace(
      split_part(OLD.logo_url, '/object/public/', 2),
      '?t=' || split_part(OLD.logo_url, '?t=', 2),
      ''
    );
    
    -- Delete the file from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'enterprise-assets'
    AND name = logo_path;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's using the latest version
DROP TRIGGER IF EXISTS on_enterprise_delete ON enterprises;
CREATE TRIGGER on_enterprise_delete
  BEFORE DELETE ON enterprises
  FOR EACH ROW
  EXECUTE FUNCTION handle_enterprise_deletion();