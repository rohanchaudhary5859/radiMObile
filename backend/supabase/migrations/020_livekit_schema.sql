-- 020_livekit_schema.sql

CREATE TABLE IF NOT EXISTS public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES auth.users(id),
  title text,
  description text,
  is_public boolean DEFAULT true,
  status text DEFAULT 'scheduled', -- scheduled | live | ended
  stream_key text,
  livekit_room_name text,
  viewer_count int DEFAULT 0,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.live_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audio_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES auth.users(id),
  title text,
  is_public boolean DEFAULT true,
  status text DEFAULT 'open', -- open | closed | archived
  livekit_room_name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audio_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.audio_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  role text DEFAULT 'listener', -- listener | speaker | moderator
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.webinar_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  file_path text,
  title text,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id),
  stream_key TEXT UNIQUE,
  room_name TEXT UNIQUE,
  is_live BOOLEAN DEFAULT false,
  playback_url TEXT,
  recording_url TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS live_viewers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP
);
