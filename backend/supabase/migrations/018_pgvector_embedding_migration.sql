-- 018_pgvector_embedding_migration.sql
-- Enable pgvector extension and add a native vector column for fast similarity search.
-- Run this migration in your Supabase DB (requires database-level permissions).
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.search_index
ADD COLUMN IF NOT EXISTS embedding_vector vector(1536);

-- Optional helper: convert existing JSON numeric arrays stored in 'embedding' to embedding_vector
CREATE OR REPLACE FUNCTION embedding_json_to_vector(arr jsonb)
RETURNS vector AS $$
DECLARE
  vals float8[] := ARRAY[]::float8[];
  v text;
BEGIN
  IF arr IS NULL OR arr = '[]' THEN
    RETURN NULL;
  END IF;
  FOR v IN SELECT jsonb_array_elements_text(arr)
  LOOP
    vals := vals || (v::float8);
  END LOOP;
  RETURN vals::vector;
END;
$$ LANGUAGE plpgsql STRICT;

-- Populate embedding_vector from existing embedding jsonb if present
UPDATE public.search_index
SET embedding_vector = embedding_json_to_vector(embedding)
WHERE embedding IS NOT NULL AND embedding <> '[]';