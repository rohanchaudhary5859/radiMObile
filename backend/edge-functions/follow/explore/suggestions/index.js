import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id } = await req.json();

    // Find people the user does NOT follow
    const { data: following } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user_id);

    const followingIds = following.map((f) => f.following_id);

    const { data: suggestions } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, specialization")
      .neq("id", user_id)
      .not("id", "in", `(${followingIds.join(",")})`)
      .limit(20);

    return new Response(JSON.stringify({ suggestions }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
