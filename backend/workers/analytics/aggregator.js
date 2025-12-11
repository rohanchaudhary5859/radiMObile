import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function aggregateDay(dayDateStr) {
  // aggregate posts
  const { data: posts } = await supabase.from('posts').select('id').limit(10000);
  for (const p of posts) {
    const { data: imp } = await supabase
      .from('post_views')
      .select('id, watch_seconds', { count: 'exact' })
      .eq('post_id', p.id)
      .gte('viewed_at', `${dayDateStr} 00:00:00`)
      .lte('viewed_at', `${dayDateStr} 23:59:59`);

    // sum watch_seconds manually
    const { data: rows } = await supabase.from('post_views').select('watch_seconds').eq('post_id', p.id).gte('viewed_at', `${dayDateStr} 00:00:00`).lte('viewed_at', `${dayDateStr} 23:59:59`);
    const totalWatch = (rows || []).reduce((s, r) => s + (r.watch_seconds || 0), 0);

    await supabase.from('analytics_daily_post').upsert([{
      post_id: p.id,
      day: dayDateStr,
      impressions: imp?.length || 0,
      total_watch_seconds: totalWatch
    }], { onConflict: ['post_id','day'] });
  }

  // reels aggregation similar...
}

async function run() {
  const day = new Date();
  day.setDate(day.getDate() - 1); // aggregate yesterday
  const dayStr = day.toISOString().slice(0,10);
  await aggregateDay(dayStr);
  setTimeout(run, 1000 * 60 * 60); // run hourly
}

run().catch(e=>{console.error(e); process.exit(1);});
