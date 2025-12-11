import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FUNCTIONS_URL = process.env.SUPABASE_FUNCTIONS_URL;

export default async (req) => {
  try {
    const { user_id, caption, media_urls, location, tags } = await req.json();

    if (!user_id || !media_urls?.length)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    // Insert post
    const { data: post, error } = await supabase
      .from("posts")
      .insert([
        {
          author_id: user_id,
          caption,
          media_urls,
          location,
          tags,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // AI Caption (optional)
    await fetch(`${FUNCTIONS_URL}/ai/caption_generator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: post.id, caption }),
    });

    // AI Embedding for Explore Search
    await fetch(`${FUNCTIONS_URL}/index_content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "post",
        sourceId: post.id,
        text: caption || "",
      }),
    });

    return new Response(JSON.stringify({ ok: true, post }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
