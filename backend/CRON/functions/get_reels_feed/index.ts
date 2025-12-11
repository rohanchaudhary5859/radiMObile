import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { limit=20, offset=0, userId } = await req.json();

    // Simple ranking: newest + trending boost (likes+views)
    const sql = `
      SELECT r.*, ri.views, ri.likes,
        (COALESCE(ri.views,0) * 0.3 + COALESCE(ri.likes,0) * 0.7) AS score
      FROM reels r
      LEFT JOIN reel_insights ri ON ri.reel_id = r.id
      WHERE r.is_public = true
      ORDER BY score DESC, r.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const { data } = await sb.rpc('sql', { q: sql }).catch(()=>({ data: [] }));
    return new Response(JSON.stringify({ reels: data }), { status: 200 });
  } catch(e){
    console.error(e);
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
};
