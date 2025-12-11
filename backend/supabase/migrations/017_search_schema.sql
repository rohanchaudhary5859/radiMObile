-- 017_search_schema.sql
-- NOTE: For best results enable the pgvector extension in your Supabase DB:
-- CREATE EXTENSION IF NOT EXISTS vector;
-- Example table with pgvector: vector_column vector(1536)
-- This migration uses a jsonb 'embedding' column as a portable fallback if pgvector isn't enabled.

CREATE TABLE IF NOT EXISTS public.search_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text, -- 'post','reel','profile','story'
  source_id uuid, -- original entity id
  title text,
  body text,
  tags text[],
  location text,
  embedding jsonb DEFAULT '[]', -- store numeric array or leave empty; use pgvector if available
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trending_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE,
  score numeric DEFAULT 0,
  last_seen timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_title_body ON public.search_index USING gin((to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))));
CREATE OR REPLACE FUNCTION search_by_vector(
  query_embedding vector,
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  source TEXT,
  source_id UUID,
  text TEXT,
  score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.source,
    s.source_id,
    s.text,
    1 - (s.embedding <=> query_embedding) AS score
  FROM search_index s
  WHERE 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
