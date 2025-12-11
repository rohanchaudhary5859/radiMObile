import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { originalReelId, creatorId, videoUrl, thumbnailUrl, caption } = await req.json();
    if(!originalReelId || !creatorId || !videoUrl) return new Response(JSON.stringify({ error: 'missing params' }), { status: 400 });

    const { data } = await sb.from('reels').insert([{
      user_id: creatorId,
      caption: caption || '',
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || '',
      hashtags: [],
      duration: 0
    }]).select().single();

    await sb.from('reel_duets').insert([{ original_reel_id: originalReelId, duet_reel_id: data.id, creator_id: creatorId }]);
    await sb.from('reel_insights').insert([{ reel_id: data.id }]);

    return new Response(JSON.stringify({ duetReel: data }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
