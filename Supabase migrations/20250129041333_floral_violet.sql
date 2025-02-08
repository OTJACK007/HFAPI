-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES public.enterprise_webhooks(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'failed')),
  payload jsonb NOT NULL,
  response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "View webhook events"
ON public.webhook_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enterprise_webhooks w
    JOIN enterprise_members m ON w.enterprise_id = m.enterprise_id
    WHERE w.id = webhook_events.webhook_id
    AND m.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_webhook_id 
ON public.webhook_events(webhook_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at 
ON public.webhook_events(created_at DESC);

-- Create function to handle webhook event logging
CREATE OR REPLACE FUNCTION log_webhook_event(
  p_webhook_id uuid,
  p_event_type text,
  p_status text,
  p_payload jsonb,
  p_response jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_event_id uuid;
BEGIN
  INSERT INTO public.webhook_events (
    webhook_id,
    event_type,
    status,
    payload,
    response
  )
  VALUES (
    p_webhook_id,
    p_event_type,
    p_status,
    p_payload,
    p_response
  )
  RETURNING id INTO v_event_id;

  -- Update webhook stats
  PERFORM update_webhook_stats(
    p_webhook_id,
    p_status = 'success'
  );

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for updated_at
CREATE TRIGGER set_webhook_events_timestamp
  BEFORE UPDATE ON public.webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();