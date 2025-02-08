-- Add indexes for invitation queries
CREATE INDEX IF NOT EXISTS idx_enterprise_invitations_token 
ON enterprise_invitations(token);

CREATE INDEX IF NOT EXISTS idx_enterprise_invitations_status_expires 
ON enterprise_invitations(status, expires_at) 
WHERE status = 'pending';

-- Update enterprise_invitations table to ensure proper timestamp handling
ALTER TABLE enterprise_invitations
ALTER COLUMN expires_at TYPE timestamptz USING expires_at AT TIME ZONE 'UTC',
ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
ALTER COLUMN updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC';