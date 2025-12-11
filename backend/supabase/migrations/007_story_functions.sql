-- 007_story_functions.sql
CREATE OR REPLACE FUNCTION append_story_viewer(sid uuid, vid uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.stories
  SET viewers = (CASE WHEN viewers IS NULL THEN to_jsonb(ARRAY[vid]::uuid[]) ELSE (viewers || to_jsonb(ARRAY[vid]::uuid[])) END)
  WHERE id = sid AND NOT (viewers @> to_jsonb(ARRAY[vid]::uuid[]));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;