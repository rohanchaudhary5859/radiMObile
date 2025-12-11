import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const FUNCTIONS_URL = process.env.SUPABASE_FUNCTIONS_URL;

async function loop() {
  while (true) {
    const { data } = await supabase
      .from('realtime_events')
      .select('*')
      .eq('processed', false)
      .limit(10)
      .order('created_at', { ascending: true });

    if (!data || data.length === 0) {
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    for (const ev of data) {
      try {
        // Example: if channel === 'new_message' -> send push to receiver via notifications worker
        if (ev.channel === 'new_message') {
          const receiverId = ev.payload.receiver_id;
          await fetch(`${FUNCTIONS_URL}/notifications-sendpush`, { // your notifications function
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ user_id: receiverId, title: 'New message', body: ev.payload.text })
          });
        }
        // mark processed
        await supabase.from('realtime_events').update({ processed: true }).eq('id', ev.id);
      } catch (err) {
        console.error('worker event process err', err);
        // increase attempts or leave unprocessed for retry
      }
    }
  }
}

loop().catch(e => { console.error('worker fatal', e); process.exit(1); });
