-- 019_embedding_jobs.sql
CREATE TABLE IF NOT EXISTS public.embedding_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid, -- search_index.id
  text text,
  status text DEFAULT 'pending', -- pending | done | failed
  result jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);