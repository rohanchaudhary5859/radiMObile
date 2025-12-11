import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const b = await req.json(); // { type, target_id, user_id, extra }
    if (b.type === 'post_view') {
      await supabase.from('post_views').insert([{ post_id: b.target_id, user_id: b.user_id, watch_seconds: b.extra?.watch_seconds || 0 }]);
    } else if (b.type === 'reel_view') {
      await supabase.from('reel_views').insert([{ reel_id: b.target_id, user_id: b.user_id, watch_seconds: b.extra?.watch_seconds || 0 }]);
    } else if (b.type === 'profile_visit') {
      await supabase.from('profile_visits').insert([{ profile_id: b.target_id, visitor_id: b.user_id }]);
    }
    return new Response(JSON.stringify({ok:true}), {status:200});
  } catch(e){ return new Response(JSON.stringify({error:e.message}), {status:500}); }
}
