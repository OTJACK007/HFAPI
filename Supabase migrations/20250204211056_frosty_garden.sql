
-- Create KYC settings table
CREATE TABLE IF NOT EXISTS kyc_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  required_documents text[] DEFAULT ARRAY['passport', 'drivers_license', 'national_id'],
  allowed_document_types text[] DEFAULT ARRAY['passport', 'drivers_license', 'national_id'],
  liveness_check_required boolean DEFAULT true,
  manual_review_threshold integer DEFAULT 80,
  expiry_notification_days integer DEFAULT 30,
  auto_reject_rules jsonb DEFAULT '{
    "maxAttempts": 3,
    "documentQualityThreshold": 60,
    "livenessScoreThreshold": 80
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(enterprise_id)
);

-- Create KYC webhooks table
CREATE TABLE IF NOT EXISTS kyc_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id uuid REFERENCES enterprises(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text NOT NULL,
  events text[] DEFAULT ARRAY['verification.completed', 'verification.failed'],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create KYC webhook events table
CREATE TABLE IF NOT EXISTS kyc_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES kyc_webhooks(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'failed')),
  payload jsonb NOT NULL,
  response jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE kyc_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_webhook_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "View KYC settings"
ON kyc_settings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = kyc_settings.enterprise_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Manage KYC settings"
ON kyc_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = kyc_settings.enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "View KYC webhooks"
ON kyc_webhooks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = kyc_webhooks.enterprise_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Manage KYC webhooks"
ON kyc_webhooks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = kyc_webhooks.enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "View KYC webhook events"
ON kyc_webhook_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM kyc_webhooks w
    JOIN enterprise_members m ON w.enterprise_id = m.enterprise_id
    WHERE w.id = kyc_webhook_events.webhook_id
    AND m.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_kyc_settings_enterprise_id 
ON kyc_settings(enterprise_id);

CREATE INDEX idx_kyc_webhooks_enterprise_id 
ON kyc_webhooks(enterprise_id);

CREATE INDEX idx_kyc_webhook_events_webhook_id 
ON kyc_webhook_events(webhook_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_kyc_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_kyc_settings_timestamp
  BEFORE UPDATE ON kyc_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_kyc_settings_timestamp();

CREATE TRIGGER update_kyc_webhooks_timestamp
  BEFORE UPDATE ON kyc_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_kyc_settings_timestamp();

-- Function to get KYC settings
CREATE OR REPLACE FUNCTION get_kyc_settings(p_enterprise_id uuid)
RETURNS kyc_settings AS $$
DECLARE
  v_settings kyc_settings;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = p_enterprise_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to view KYC settings';
  END IF;

  -- Get or create settings
  SELECT * INTO v_settings
  FROM kyc_settings
  WHERE enterprise_id = p_enterprise_id;

  IF NOT FOUND THEN
    INSERT INTO kyc_settings (enterprise_id)
    VALUES (p_enterprise_id)
    RETURNING * INTO v_settings;
  END IF;

  RETURN v_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update KYC settings
CREATE OR REPLACE FUNCTION update_kyc_settings(
  p_enterprise_id uuid,
  p_settings jsonb
)
RETURNS kyc_settings AS $$
DECLARE
  v_settings kyc_settings;
BEGIN
  -- Check if user has permission
  IF NOT EXISTS (
    SELECT 1 FROM enterprise_members
    WHERE enterprise_id = p_enterprise_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to update KYC settings';
  END IF;

  -- Update settings
  UPDATE kyc_settings
  SET
    required_documents = COALESCE(p_settings->>'required_documents', required_documents),
    allowed_document_types = COALESCE(p_settings->>'allowed_document_types', allowed_document_types),
    liveness_check_required = COALESCE((p_settings->>'liveness_check_required')::boolean, liveness_check_required),
    manual_review_threshold = COALESCE((p_settings->>'manual_review_threshold')::integer, manual_review_threshold),
    expiry_notification_days = COALESCE((p_settings->>'expiry_notification_days')::integer, expiry_notification_days),
    auto_reject_rules = COALESCE(p_settings->'auto_reject_rules', auto_reject_rules),
    updated_at = now()
  WHERE enterprise_id = p_enterprise_id
  RETURNING * INTO v_settings;

  RETURN v_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
