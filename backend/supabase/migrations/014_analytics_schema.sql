
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);

CREATE TABLE reel_analytics (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reel_id BIGINT REFERENCES reels(id),
  user_id UUID,
  watched_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
-- 014_analytics_schema.sql

-- Tables to track raw events
CREATE TABLE IF NOT EXISTS post_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID, -- nullable for anonymous
  viewed_at TIMESTAMP DEFAULT NOW(),
  watch_seconds INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reel_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
  user_id UUID,
  viewed_at TIMESTAMP DEFAULT NOW(),
  watch_seconds INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS story_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id UUID,
  viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile_visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  visitor_id UUID,
  visited_at TIMESTAMP DEFAULT NOW()
);

-- Aggregates (daily)
CREATE TABLE IF NOT EXISTS analytics_daily_post (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  impressions BIGINT DEFAULT 0,
  total_watch_seconds BIGINT DEFAULT 0,
  saves BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  UNIQUE(post_id, day)
);

CREATE TABLE IF NOT EXISTS analytics_daily_reel (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  impressions BIGINT DEFAULT 0,
  avg_watch_seconds DOUBLE PRECISION DEFAULT 0,
  retention_sample jsonb DEFAULT '[]'::jsonb, -- optional retention points
  UNIQUE(reel_id, day)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_post_views_postid ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_reel_views_reelid ON reel_views(reel_id);
CREATE INDEX IF NOT EXISTS idx_profile_visits_profileid ON profile_visits(profile_id);

-- RLS for analytics tables (basic)
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_post ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_reel ENABLE ROW LEVEL SECURITY;

CREATE POLICY analytics_service_insert_post_views
ON post_views FOR INSERT
WITH CHECK ( true );

CREATE POLICY analytics_service_insert_reel_views
ON reel_views FOR INSERT
WITH CHECK ( true );

CREATE POLICY analytics_service_select_daily_post
ON analytics_daily_post FOR SELECT
USING ( true );

CREATE POLICY analytics_service_select_daily_reel
ON analytics_daily_reel FOR SELECT
USING ( true );
-- Sum watch seconds for a post (RPC)
CREATE OR REPLACE FUNCTION sum_watch_seconds_post(p_post_id uuid)
RETURNS TABLE(sum bigint) LANGUAGE sql AS $$
  SELECT COALESCE(SUM(watch_seconds),0) as sum FROM post_views WHERE post_id = p_post_id;
$$;

-- Post daily metrics RPC (last N days)
CREATE OR REPLACE FUNCTION post_daily_metrics(p_post_id uuid, p_start timestamptz)
RETURNS TABLE(day date, impressions bigint, total_watch_seconds bigint) LANGUAGE sql AS $$
  SELECT
    date_trunc('day', viewed_at)::date as day,
    COUNT(*) as impressions,
    COALESCE(SUM(watch_seconds),0) as total_watch_seconds
  FROM post_views
  WHERE post_id = p_post_id AND viewed_at >= p_start
  GROUP BY 1
  ORDER BY 1;
$$;
