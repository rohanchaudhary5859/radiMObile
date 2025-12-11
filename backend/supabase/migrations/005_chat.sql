-- 005_chat.sql

-- ============================================
-- Conversations (chat threads)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  is_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Conversation Members
-- ============================================
CREATE TABLE IF NOT EXISTS conversation_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  text TEXT,
  media jsonb DEFAULT '[]'::jsonb,
  is_deleted BOOLEAN DEFAULT false,
  read_by jsonb DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Typing Status (ephemeral)
-- ============================================
CREATE TABLE IF NOT EXISTS typing_status (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

-- ============================================
-- Presence (online / last seen)
-- ============================================
CREATE TABLE IF NOT EXISTS presence_status (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages(conversation_id, created_at DESC);

-- ============================================
-- RLS Enable
-- ============================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence_status ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Conversations: member can view
CREATE POLICY select_conversation_for_member ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_members cm
    WHERE cm.conversation_id = conversations.id
      AND cm.user_id = auth.uid()
  )
);

-- Conversation Members
CREATE POLICY insert_conversation_member ON conversation_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY select_conversation_members ON conversation_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_members cm
    WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
  )
);

-- Messages: insert only if member
CREATE POLICY insert_message_for_member ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversation_members cm
    WHERE cm.conversation_id = messages.conversation_id
      AND cm.user_id = auth.uid()
  )
);

-- Messages: select only if member
CREATE POLICY select_messages_for_member ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_members cm
    WHERE cm.conversation_id = messages.conversation_id
      AND cm.user_id = auth.uid()
  )
);

-- Typing Status
CREATE POLICY upsert_typing_own ON typing_status FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Presence Status
CREATE POLICY upsert_presence_own ON presence_status FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Get User Conversations (with last message + members)
-- ============================================
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  title TEXT,
  last_message JSONB,
  member_ids UUID[]
)
LANGUAGE sql AS $$
  SELECT
    c.id,
    c.title,
    jsonb_build_object(
      'id', m.id,
      'sender_id', m.sender_id,
      'text', m.text,
      'created_at', m.created_at
    ) AS last_message,
    array_agg(cm.user_id) AS member_ids
  FROM conversations c
  JOIN conversation_members cm ON cm.conversation_id = c.id
  LEFT JOIN LATERAL (
    SELECT id, sender_id, text, created_at
    FROM messages
    WHERE conversation_id = c.id
    ORDER BY created_at DESC
    LIMIT 1
  ) m ON true
  WHERE c.id IN (
    SELECT conversation_id FROM conversation_members WHERE user_id = p_user_id
  )
  GROUP BY c.id, c.title, m.id, m.sender_id, m.text, m.created_at
  ORDER BY m.created_at DESC NULLS LAST;
$$;

-- ============================================
-- FUNCTION: Append read_by to message
-- ============================================
CREATE OR REPLACE FUNCTION append_read_by(p_message_id uuid, p_user_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE messages
  SET read_by = (
    SELECT jsonb_agg(DISTINCT elem)
    FROM (
      SELECT jsonb_array_elements_text(COALESCE(read_by, '[]')) AS elem
      UNION
      SELECT p_user_id::text
    ) u
  )
  WHERE id = p_message_id;
END;
$$;
