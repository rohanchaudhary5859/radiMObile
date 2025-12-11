-- 015_realtime_hooks.sql
-- events table + helper to notify

CREATE TABLE IF NOT EXISTS realtime_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL,       -- e.g. "new_message", "new_post", "story_expired"
  payload jsonb,
  created_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false
);

-- helper function to notify listeners via pg_notify
CREATE OR REPLACE FUNCTION notify_realtime_event()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    NEW.channel,
    json_build_object(
      'id', NEW.id,
      'payload', NEW.payload,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  payload json;
BEGIN
  payload := json_build_object(
    'id', NEW.id,
    'conversation_id', NEW.conversation_id,
    'sender_id', NEW.sender_id,
    'text', NEW.text,
    'created_at', NEW.created_at
  );
  PERFORM pg_notify('new_message', payload::text);

  -- also insert into realtime_events table for worker processing (optional)
  INSERT INTO realtime_events(channel, payload) VALUES ('new_message', payload);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_message_insert ON messages;
CREATE TRIGGER trigger_notify_new_message_insert
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION notify_new_message();
