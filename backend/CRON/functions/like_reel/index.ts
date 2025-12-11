import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { reelId, userId } = await req.json();
    if(!reelId || !userId) return new Response(JSON.stringify({ error:'missing params' }), { status:400 });

    // toggle like: check if exists
    const { data: exists } = await sb.from('reel_likes').select('*').eq('reel_id', reelId).eq('user_id', userId).maybeSingle();
    if(exists){
      await sb.from('reel_likes').delete().eq('id', exists.id);
      await sb.from('reel_insights').update({ likes: sb.raw('likes - 1') }).eq('reel_id', reelId);
      return new Response(JSON.stringify({ liked:false }), { status: 200 });
    } else {
      await sb.from('reel_likes').insert([{ reel_id: reelId, user_id: userId }]);
      await sb.from('reel_insights').update({ likes: sb.raw('likes + 1') }).eq('reel_id', reelId);
      // notify owner
      const { data: reel } = await sb.from('reels').select('user_id').eq('id', reelId).single();
      if(reel?.user_id){
        await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + '/send_notification', {
          method:'POST', headers:{ 'content-type':'application/json' },
          body: JSON.stringify({ userId: reel.user_id, type:'reel_like', title:'Your reel got a like', body:'Someone liked your reel' })
        });
      }
      return new Response(JSON.stringify({ liked:true }), { status: 200 });
    }
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
