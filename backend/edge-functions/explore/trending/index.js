import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async () => {
  try {
    const { data: posts } = await supabase
      .from("posts")
      .select("id, caption, likes, saves")
      .order("likes", { ascending: false })
      .limit(20);

    const { data: reels } = await supabase
      .from("reels")
      .select("id, title, views")
      .order("views", { ascending: false })
      .limit(20);

    return new Response(
      JSON.stringify({ posts, reels }), 
      { status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
