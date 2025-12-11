
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  device text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now()
);
