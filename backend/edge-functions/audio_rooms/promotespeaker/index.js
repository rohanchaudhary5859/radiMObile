import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  const { room_id, user_id } = await req.json();

  await supabase
    .from("audio_room_members")
    .update({ is_speaker: true })
    .eq("room_id", room_id)
    .eq("user_id", user_id);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
