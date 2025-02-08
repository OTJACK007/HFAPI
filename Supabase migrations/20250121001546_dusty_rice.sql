/*
  # Add Enterprise and Team Support
  
  1. New Tables
    - enterprises: Store enterprise information
    - enterprise_members: Track enterprise membership and roles
    - enterprise_invites: Manage pending invitations
    - api_keys: Store API keys for enterprises
  
  2. Security
    - Enable RLS on all tables
    - Create policies for proper access control
    - Add role-based permissions
*/

-- Create enterprise_role type
CREATE TYPE enterprise_role AS ENUM ('owner', 'admin', 'member', 'guest');

-- Create enterprises table
CREATE TABLE enterprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  website text,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enterprise_members table
CREATE TABLE enterprise_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role enterprise_role NOT NULL DEFAULT 'member',
  added_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(enterprise_id, user_id)
);

-- Create enterprise_invites table
CREATE TABLE enterprise_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  role enterprise_role NOT NULL DEFAULT 'member',
  token text UNIQUE NOT NULL,
  invited_by uuid REFERENCES auth.users(id) NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(enterprise_id, email)
);

-- Create api_keys table
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_type text NOT NULL CHECK (key_type IN ('test', 'live')),
  key_value text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  expires_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE(enterprise_id, name, key_type)
);

-- Enable RLS
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Enterprises policies
CREATE POLICY "Enterprises are viewable by their members"
  ON enterprises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE enterprise_members.enterprise_id = enterprises.id
      AND enterprise_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create enterprises"
  ON enterprises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enterprise owners and admins can update enterprise"
  ON enterprises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE enterprise_members.enterprise_id = enterprises.id
      AND enterprise_members.user_id = auth.uid()
      AND enterprise_members.role IN ('owner', 'admin')
    )
  );

-- Enterprise members policies
CREATE POLICY "Members can view enterprise members"
  ON enterprise_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members em
      WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage members"
  ON enterprise_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members em
      WHERE em.enterprise_id = enterprise_members.enterprise_id
      AND em.user_id = auth.uid()
      AND em.role IN ('owner', 'admin')
    )
  );

-- Enterprise invites policies
CREATE POLICY "Members can view enterprise invites"
  ON enterprise_invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE enterprise_members.enterprise_id = enterprise_invites.enterprise_id
      AND enterprise_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage invites"
  ON enterprise_invites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE enterprise_members.enterprise_id = enterprise_invites.enterprise_id
      AND enterprise_members.user_id = auth.uid()
      AND enterprise_members.role IN ('owner', 'admin')
    )
  );

-- API keys policies
CREATE POLICY "Members can view enterprise API keys"
  ON api_keys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE enterprise_members.enterprise_id = api_keys.enterprise_id
      AND enterprise_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage API keys"
  ON api_keys FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM enterprise_members
      WHERE enterprise_members.enterprise_id = api_keys.enterprise_id
      AND enterprise_members.user_id = auth.uid()
      AND enterprise_members.role IN ('owner', 'admin')
    )
  );

-- Functions

-- Function to create an enterprise and add creator as owner
CREATE OR REPLACE FUNCTION create_enterprise(
  name text,
  slug text,
  description text DEFAULT NULL,
  logo_url text DEFAULT NULL,
  website text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  enterprise_id uuid;
BEGIN
  -- Insert enterprise
  INSERT INTO enterprises (name, slug, description, logo_url, website, created_by)
  VALUES (name, slug, description, logo_url, website, auth.uid())
  RETURNING id INTO enterprise_id;
  
  -- Add creator as owner
  INSERT INTO enterprise_members (enterprise_id, user_id, role, added_by)
  VALUES (enterprise_id, auth.uid(), 'owner', auth.uid());
  
  RETURN enterprise_id;
END;
$$;

-- Function to invite member to enterprise
CREATE OR REPLACE FUNCTION invite_enterprise_member(
  enterprise_id uuid,
  email text,
  role enterprise_role DEFAULT 'member'::enterprise_role
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite_id uuid;
  token text;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = invite_enterprise_member.enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Generate secure token
  token := encode(gen_random_bytes(32), 'hex');

  -- Create invite
  INSERT INTO enterprise_invites (enterprise_id, email, role, token, invited_by)
  VALUES (enterprise_id, email, role, token, auth.uid())
  RETURNING id INTO invite_id;

  RETURN invite_id;
END;
$$;

-- Function to accept enterprise invite
CREATE OR REPLACE FUNCTION accept_enterprise_invite(token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite enterprise_invites;
BEGIN
  -- Get and validate invite
  SELECT * INTO invite
  FROM enterprise_invites
  WHERE 
    enterprise_invites.token = accept_enterprise_invite.token
    AND accepted_at IS NULL
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Add member
  INSERT INTO enterprise_members (
    enterprise_id,
    user_id,
    role,
    added_by
  )
  VALUES (
    invite.enterprise_id,
    auth.uid(),
    invite.role,
    invite.invited_by
  );

  -- Mark invite as accepted
  UPDATE enterprise_invites
  SET accepted_at = now()
  WHERE id = invite.id;

  RETURN true;
END;
$$;

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key(
  enterprise_id uuid,
  name text,
  key_type text,
  expires_in interval DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_value text;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_members.enterprise_id = generate_api_key.enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Generate secure API key
  key_value := 'hf_' || encode(gen_random_bytes(32), 'hex');

  -- Insert API key
  INSERT INTO api_keys (
    enterprise_id,
    name,
    key_type,
    key_value,
    created_by,
    expires_at
  )
  VALUES (
    enterprise_id,
    name,
    key_type,
    key_value,
    auth.uid(),
    CASE 
      WHEN expires_in IS NOT NULL THEN now() + expires_in
      ELSE NULL
    END
  );

  RETURN key_value;
END;
$$;