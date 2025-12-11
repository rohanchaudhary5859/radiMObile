import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async (req) => {
  try {
    const { post_id, user_id } = await req.json()

    const { data: post, error: fetchErr } = await supabase
      .from("posts")
      .select("*")
      .eq("id", post_id)
      .single()

    if (fetchErr || !post) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 })
    }

    if (post.author_id !== user_id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 })
    }

    await supabase.from("posts").delete().eq("id", post_id)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
