import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { message_id, user_id } = await req.json();
    if (!message_id || !user_id) return new Response(JSON.stringify({ error: "missing" }), { status: 400 });

    const { data, error } = await supabase.rpc('append_read_by', { p_message_id: message_id, p_user_id: user_id });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
