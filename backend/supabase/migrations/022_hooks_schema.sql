
-- Tracks triggers and async hooks
CREATE TABLE IF NOT EXISTS hook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text,
  payload jsonb,
  created_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false
);
