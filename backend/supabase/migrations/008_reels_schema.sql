-- 008_reels_schema.sql
CREATE TABLE IF NOT EXISTS public.reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  caption text,
  hashtags text[],
  music_url text,
  music_title text,
  audio_source_reel uuid,
  processed_video_path text,
  processed_thumbnail text,
  raw_video_path text,
  duration int,
  views bigint DEFAULT 0,
  likes bigint DEFAULT 0,
  comments bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reel_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid REFERENCES public.reels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(reel_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.reel_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid REFERENCES public.reels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reel_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid REFERENCES public.reels(id) ON DELETE CASCADE,
  retention jsonb DEFAULT '{}',
  impressions int DEFAULT 0,
  shares int DEFAULT 0,
  saves int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);