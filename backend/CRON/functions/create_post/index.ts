import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async (req) => {
  try {
    const body = await req.json()
    const { author_id, caption, media_urls, location, tags, is_public = true } = body

    if (!author_id || !media_urls) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
    }

    const hashtags = caption?.match(/#\w+/g) || []

    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id,
        caption,
        media_urls,
        location,
        tags,
        hashtags,
        is_public
      })
      .select()
      .single()

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 400 })
    }

    // Index for Explore feed (AI)
    await fetch(`${process.env.SUPABASE_EDGE_FUNCTION_URL}/index_content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "post",
        sourceId: data.id,
        text: caption ?? ""
      })
    })

    return new Response(JSON.stringify({ success: true, post: data }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
