CREATE OR REPLACE FUNCTION append_read_by(p_message_id uuid, p_user_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE messages
  SET read_by = (SELECT COALESCE(array_to_json(array_agg(distinct x)), '[]'::jsonb)
                 FROM (
                   SELECT jsonb_array_elements_text(coalesce(read_by, '[]'::jsonb)) AS x
                   UNION
                   SELECT p_user_id::text
                 ) s
                 ),
      -- set read_by as json array of unique ids
      -- simpler approach: push and dedupe in application; for now update raw
      -- keep created_at unchanged
      read_by = (
        SELECT to_jsonb(array_agg(distinct (elem::uuid))) FROM (
          SELECT jsonb_array_elements_text(coalesce(read_by,'[]'::jsonb)) AS elem FROM messages WHERE id = p_message_id
        ) t
      )
  WHERE id = p_message_id;

  -- A simpler upsert can be done from edge function (read + push unique)
END;
$$;
