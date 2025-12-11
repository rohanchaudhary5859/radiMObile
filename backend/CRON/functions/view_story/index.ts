import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { storyId, viewerId } = await req.json();

    await sb.from("story_views").upsert([{ story_id: storyId, viewer_id: viewerId }]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
