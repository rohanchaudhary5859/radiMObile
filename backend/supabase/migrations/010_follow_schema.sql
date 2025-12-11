-- 010_follow_schema.sql
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower uuid REFERENCES auth.users(id),
  following uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower, following)
);

CREATE TABLE IF NOT EXISTS public.follow_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester uuid REFERENCES auth.users(id),
  target uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending', -- pending, accepted, rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.follow_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  suggested_user_id uuid REFERENCES auth.users(id),
  score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
backend/supabase/migrations/010_follow_schema.sql

