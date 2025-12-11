import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { post_id, user_id } = await req.json();

    // Ownership check
    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", post_id)
      .single();

    if (post.author_id !== user_id)
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });

    // Delete
    await supabase.from("posts").delete().eq("id", post_id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
