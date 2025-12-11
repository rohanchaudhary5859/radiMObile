CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS search_index (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source TEXT NOT NULL,
  source_id UUID NOT NULL,
  text TEXT,
  embedding vector(384),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (source, source_id)
);

CREATE INDEX IF NOT EXISTS search_index_embedding_idx
ON search_index USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
CREATE OR REPLACE FUNCTION semantic_search(
  search_vector vector(384),
  match_count int
)
RETURNS TABLE (
  source TEXT,
  source_id UUID,
  text TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    si.source,
    si.source_id,
    si.text,
    1 - (si.embedding <=> search_vector) AS similarity
  FROM search_index si
  ORDER BY si.embedding <=> search_vector
  LIMIT match_count;
END;
$$;
