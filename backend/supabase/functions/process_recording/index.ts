import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const { stream_id, recording_url } = await req.json();

  await supabase
    .from("live_streams")
    .update({ recording_url })
    .eq("id", stream_id);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
