import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { reelId, userId, text } = await req.json();
    if(!reelId || !userId || !text) return new Response(JSON.stringify({ error:'missing params' }), { status:400 });

    const { data } = await sb.from('reel_comments').insert([{ reel_id: reelId, user_id: userId, text }]).select().single();

    // increment insights (optional)
    await sb.from('reel_insights').update({ comments: sb.raw('COALESCE((comments)::int,0) + 1') }).eq('reel_id', reelId).catch(()=>{});

    // notify owner
    const { data: reel } = await sb.from('reels').select('user_id').eq('id', reelId).single();
    if(reel?.user_id){
      await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + '/send_notification', {
        method:'POST', headers:{ 'content-type':'application/json' },
        body: JSON.stringify({ userId: reel.user_id, type:'reel_comment', title:'New comment', body: text })
      });
    }

    return new Response(JSON.stringify({ comment: data }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
