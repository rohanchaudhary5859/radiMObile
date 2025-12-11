import { createClient } from "@supabase/supabase-js";
import dayjs from 'dayjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { post_id, days = 7 } = await req.json();

    if (!post_id) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });

    // total impressions (raw)
    const { count: impressions } = await supabase
      .from('post_views')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', post_id);

    // total watch seconds
    const { data: watchSum } = await supabase.rpc('sum_watch_seconds_post', { p_post_id: post_id });

    // saves, likes from posts table
    const { data: postRow } = await supabase.from('posts').select('saves_count, likes_count').eq('id', post_id).single();

    // last N days breakdown
    const start = dayjs().subtract(days - 1, 'day').startOf('day').toISOString();
    const { data: daily } = await supabase.rpc('post_daily_metrics', { p_post_id: post_id, p_start: start });

    return new Response(JSON.stringify({
      impressions: impressions || 0,
      total_watch_seconds: (watchSum?.sum || 0),
      saves: postRow?.saves_count || 0,
      likes: postRow?.likes_count || 0,
      daily
    }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
