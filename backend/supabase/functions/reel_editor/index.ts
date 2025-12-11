import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { reel_id, caption, audio_url, speed } = await req.json();

    const { error } = await supabase
      .from("reels")
      .update({
        caption,
        audio_url,
        speed: speed || 1.0,
      })
      .eq("id", reel_id);

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
