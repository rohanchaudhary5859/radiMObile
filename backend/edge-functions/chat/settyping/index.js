import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { conversation_id, user_id, is_typing } = await req.json();
    if (!conversation_id || !user_id) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });

    await supabase.from('typing_status').upsert({
      conversation_id,
      user_id,
      is_typing,
      updated_at: new Date()
    });

    // notify via pg_notify
    const payload = { conversation_id, user_id, is_typing, updated_at: new Date() };
    await supabase.from('realtime_events').insert([{ channel: 'typing_status', payload }]);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
