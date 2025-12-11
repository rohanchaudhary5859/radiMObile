import { createClient } from "@supabase/supabase-js";
import dayjs from 'dayjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Request body: { reel_id }
 * Returns retention buckets (e.g. % users who watched >= 1s,5s,10s,50%,100%)
 */
export default async (req) => {
  try {
    const { reel_id } = await req.json();
    if (!reel_id) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });

    // fetch watch_seconds values
    const { data } = await supabase.from('reel_views').select('watch_seconds').eq('reel_id', reel_id);

    const seconds = (data || []).map(r => r.watch_seconds || 0);

    // buckets
    const buckets = [
      { label: '>=1s', count: seconds.filter(s => s >= 1).length },
      { label: '>=3s', count: seconds.filter(s => s >= 3).length },
      { label: '>=7s', count: seconds.filter(s => s >= 7).length },
      { label: '>=15s', count: seconds.filter(s => s >= 15).length },
      { label: 'full', count: seconds.filter(s => s >= 30).length } -- 
    ];

    const total = seconds.length || 1;
    const result = buckets.map(b => ({ label: b.label, percentage: Math.round((b.count / total) * 100) }));

    return new Response(JSON.stringify({ retention: result }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
