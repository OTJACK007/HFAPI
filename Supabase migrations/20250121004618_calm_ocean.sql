-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_enterprise_members;

-- Update enterprise members query function with improved parameter naming
CREATE OR REPLACE FUNCTION get_enterprise_members(p_enterprise_id uuid)
RETURNS TABLE (
  id uuid,
  enterprise_id uuid,
  user_id uuid,
  role text,
  added_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  user_full_name text,
  user_email text,
  user_avatar_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    em.id,
    em.enterprise_id,
    em.user_id,
    em.role::text,
    em.added_by,
    em.created_at,
    em.updated_at,
    p.full_name,
    p.email,
    p.avatar_url
  FROM enterprise_members em
  INNER JOIN profiles p ON p.id = em.user_id
  WHERE em.enterprise_id = p_enterprise_id
  ORDER BY em.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;