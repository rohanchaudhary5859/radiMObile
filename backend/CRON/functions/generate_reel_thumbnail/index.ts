import { createClient } from '@supabase/supabase-js';

/**
 * Placeholder: ideally use a worker that fetches video, extracts frame and uploads to storage.
 * This function updates the reels.thumbnail_url after processing externally.
 * Payload: { reelId, thumbnailUrl }  -- if you have external service create thumbnail and call this.
 */
export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { reelId, thumbnailUrl } = await req.json();
    if(!reelId || !thumbnailUrl) return new Response(JSON.stringify({ error: 'missing params' }), { status: 400 });

    await sb.from('reels').update({ thumbnail_url: thumbnailUrl }).eq('id', reelId);

    return new Response(JSON.stringify({ ok:true }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
