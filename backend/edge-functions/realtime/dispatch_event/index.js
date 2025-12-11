// dispatch_event: insert event row and notify via pg_notify (service-role)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const body = await req.json(); // { channel: 'new_message', payload: {...} }
    const { channel, payload } = body;
    if (!channel || !payload) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });

    // Insert into events table (trigger function notify_realtime_event will pg_notify)
    const { data, error } = await supabase
      .from('realtime_events')
      .insert([{ channel, payload }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, event: data }), { status: 200 });
  } catch (e) {
    console.error('dispatch_event err', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
