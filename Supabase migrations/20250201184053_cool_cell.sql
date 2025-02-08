-- Drop API key requests table and related objects
DROP FUNCTION IF EXISTS request_api_keys;
DROP POLICY IF EXISTS "View own enterprise key requests" ON api_key_requests;
DROP POLICY IF EXISTS "Create key requests" ON api_key_requests;
DROP INDEX IF EXISTS idx_pending_api_key_requests;
DROP TABLE IF EXISTS api_key_requests;