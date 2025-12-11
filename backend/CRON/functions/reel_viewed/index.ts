import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { reelId, userId, watchDurationMs } = await req.json();
    if(!reelId) return new Response(JSON.stringify({ error: 'missing reelId' }), { status: 400 });

    // upsert view record (if you track per-user views) - optional
    await sb.from('reel_views').insert([{ reel_id: reelId, user_id: userId, duration_ms: watchDurationMs || 0 }]);

    // increment counters
    await sb.rpc('increment_reel_view', { r_id: reelId }).catch(()=>{ /* fallback */ });

    // fallback manual update
    await sb.from('reel_insights').update({ views: sb.raw('views + 1') }).eq('reel_id', reelId);

    return new Response(JSON.stringify({ ok:true }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
