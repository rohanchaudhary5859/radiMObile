CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  email_enabled BOOLEAN DEFAULT true,
  privacy_mode BOOLEAN DEFAULT false,     -- Private account like Instagram
  restricted_mode BOOLEAN DEFAULT false,  -- Restricted users cannot DM
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  blocked_user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  device TEXT,
  ip TEXT,
  is_current_session BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY view_own_settings
ON user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY update_own_settings
ON user_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY view_own_blocks
ON blocked_users FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY manage_blocks
ON blocked_users FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_blocks
ON blocked_users FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY view_login_activity
ON login_activity FOR SELECT
USING (auth.uid() = user_id);
