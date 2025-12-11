import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { storyId, userId, reaction } = await req.json();

    await sb.from("story_reactions").insert([{ story_id: storyId, user_id: userId, reaction }]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
