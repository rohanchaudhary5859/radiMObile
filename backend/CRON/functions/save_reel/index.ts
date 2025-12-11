import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { reelId, userId } = await req.json();
    if(!reelId || !userId) return new Response(JSON.stringify({ error:'missing params' }), { status:400 });

    const { data: exists } = await sb.from('reel_saves').select('*').eq('reel_id', reelId).eq('user_id', userId).maybeSingle();
    if(exists){
      await sb.from('reel_saves').delete().eq('id', exists.id);
      await sb.from('reel_insights').update({ saves: sb.raw('saves - 1') }).eq('reel_id', reelId);
      return new Response(JSON.stringify({ saved:false }), { status: 200 });
    } else {
      await sb.from('reel_saves').insert([{ reel_id: reelId, user_id: userId }]);
      await sb.from('reel_insights').update({ saves: sb.raw('saves + 1') }).eq('reel_id', reelId);
      return new Response(JSON.stringify({ saved:true }), { status: 200 });
    }
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
