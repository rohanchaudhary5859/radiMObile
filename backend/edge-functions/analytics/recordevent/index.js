import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Expected body:
 * { type: 'post_view'|'reel_view'|'story_view'|'profile_visit'|'post_save'|'post_like',
 *   user_id, target_id, extra: { watch_seconds: number } }
 *
 * target_id = post_id|reel_id|story_id|profile_id
 */

export default async (req) => {
  try {
    const body = await req.json();
    const { type, user_id, target_id, extra } = body;

    if (!type || !target_id) return new Response(JSON.stringify({ error: "missing" }), { status: 400 });

    if (type === "post_view") {
      await supabase.from("post_views").insert([{
        post_id: target_id,
        user_id: user_id || null,
        watch_seconds: (extra?.watch_seconds || 0)
      }]);
    } else if (type === "reel_view") {
      await supabase.from("reel_views").insert([{
        reel_id: target_id,
        user_id: user_id || null,
        watch_seconds: (extra?.watch_seconds || 0)
      }]);
    } else if (type === "story_view") {
      await supabase.from("story_views").insert([{
        story_id: target_id,
        viewer_id: user_id || null
      }]);
    } else if (type === "profile_visit") {
      await supabase.from("profile_visits").insert([{
        profile_id: target_id,
        visitor_id: user_id || null
      }]);
    } else if (type === "post_save") {
      // increment saving count in posts table (fast)
      await supabase.from("posts").update({ saves_count: (supabase.literal('coalesce(saves_count,0) + 1')) }).eq('id', target_id);
    } else if (type === "post_like") {
      await supabase.from("posts").update({ likes_count: (supabase.literal('coalesce(likes_count,0) + 1')) }).eq('id', target_id);
    } else {
      return new Response(JSON.stringify({ error: "unknown type" }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("recordevent err", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
