/*
  # Drop member_roles materialized view
  
  This migration removes the member_roles materialized view that was causing permission issues
  with enterprise creation.
*/

-- Drop the materialized view and related objects
DROP MATERIALIZED VIEW IF EXISTS member_roles CASCADE;

-- Drop the refresh function if it exists
DROP FUNCTION IF EXISTS refresh_member_roles() CASCADE;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS refresh_member_roles_trigger ON enterprise_members;