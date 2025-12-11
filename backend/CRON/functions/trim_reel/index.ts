import { createClient } from '@supabase/supabase-js';

/**
 * Enqueue trim job. A worker (Cloud Run) should process trim_jobs table and update video_url.
 * Payload: { reelId, startMs, endMs }
 */
export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { reelId, startMs, endMs } = await req.json();
    if(!reelId) return new Response(JSON.stringify({ error: 'missing reelId' }), { status: 400 });

    await sb.from('trim_jobs').insert([{ reel_id: reelId, start_ms: startMs || 0, end_ms: endMs || null, status:'pending' }]);
    return new Response(JSON.stringify({ ok:true }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
index