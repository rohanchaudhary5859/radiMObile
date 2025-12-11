-- 016_notifications_schema.sql
CREATE TABLE IF NOT EXISTS public.device_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  token text,
  platform text, -- expo | fcm | apns
  device_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text, -- follow, like, comment, message, story_view, admin_alert, system
  title text,
  body text,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  preferences jsonb DEFAULT '{}' -- { follow: true, like: true, message: true, reels: true, stories: true }
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);