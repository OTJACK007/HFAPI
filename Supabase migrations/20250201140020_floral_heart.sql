-- Update enterprise_invitations table to set correct expiry
ALTER TABLE enterprise_invitations 
ALTER COLUMN expires_at SET DEFAULT (now() + interval '1 hour');