import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { user_id, is_online } = await req.json();
    await supabase.from('presence_status').upsert({
      user_id,
      is_online,
      last_seen: new Date()
    });

    const payload = { user_id, is_online, last_seen: new Date() };
    await supabase.from('realtime_events').insert([{ channel: 'presence', payload }]);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
