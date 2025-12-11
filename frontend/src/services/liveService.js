import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  const { host_id, title } = await req.json();

  const { data } = await sb
    .from("audio_rooms")
    .insert([{ host_id, title }])
    .select()
    .single();

  return new Response(JSON.stringify({ room: data }), { status: 200 });
};
