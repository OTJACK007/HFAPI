-- Update enterprise members query function
CREATE OR REPLACE FUNCTION get_enterprise_members(enterprise_id uuid)
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
    em.role,
    em.added_by,
    em.created_at,
    em.updated_at,
    p.full_name,
    p.email,
    p.avatar_url
  FROM enterprise_members em
  JOIN profiles p ON p.id = em.user_id
  WHERE em.enterprise_id = $1
  ORDER BY em.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;