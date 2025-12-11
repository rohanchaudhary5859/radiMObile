-- 006_stories_schema.sql
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  slides jsonb DEFAULT '[]', -- array of { media_path, media_type, caption, filters, mentions }
  thumbnail text,
  is_highlight boolean DEFAULT false,
  highlight_id uuid,
  viewers jsonb DEFAULT '[]',
  hide_list jsonb DEFAULT '[]',
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.story_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  cover_media text,
  story_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.story_viewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE,
  viewer_id uuid REFERENCES auth.users(id),
  viewed_at timestamptz DEFAULT now()
);