import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { userId, caption, videoUrl, thumbnailUrl, hashtags, musicMeta, duration } = await req.json();

    if(!userId || !videoUrl) return new Response(JSON.stringify({ error: 'missing params' }), { status: 400 });

    const { data } = await sb
      .from('reels')
      .insert([{
        user_id: userId,
        caption,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        hashtags: hashtags || [],
        music_meta: musicMeta || {},
        duration: duration || 0
      }])
      .select()
      .single();

    // Initialize insights
    await sb.from('reel_insights').insert([{ reel_id: data.id }]);

    // Index content for search
    await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + '/index_content', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ source:'reel', sourceId: data.id, title: caption || '', body: caption || '', tags: hashtags || [] })
    });

    return new Response(JSON.stringify({ reel: data }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
