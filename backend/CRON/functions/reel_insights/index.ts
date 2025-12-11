import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { reelId } = await req.json();
    if(!reelId) return new Response(JSON.stringify({ error:'missing reelId' }), { status:400 });

    const { data } = await sb.from('reel_insights').select('*').eq('reel_id', reelId).maybeSingle();
    return new Response(JSON.stringify({ insights: data || {} }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
