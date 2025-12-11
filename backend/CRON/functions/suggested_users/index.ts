import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { userId } = await req.json();

    // Get users you already follow
    const { data: following } = await sb
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    const followingIds = following?.map(f => f.following_id) || [];

    // Suggested = people you do NOT follow
    const { data: suggestions } = await sb
      .from("profiles")
      .select("*")
      .neq("id", userId)
      .not("id", "in", `(${followingIds.join(",") || "NULL"})`)
      .limit(10);

    return new Response(JSON.stringify({ suggestions }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
