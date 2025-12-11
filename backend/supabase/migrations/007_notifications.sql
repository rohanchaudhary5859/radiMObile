CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT,                                -- follow | message | like | comment | system | verify
  title TEXT,
  body TEXT,
  data JSONB,                                -- extra payload
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_can_view_notifications
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY user_can_insert_notifications
ON notifications FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
