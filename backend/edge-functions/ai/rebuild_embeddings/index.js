// rebuild_embeddings: Re-index all posts + reels using OpenAI embeddings

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async () => {
  try {
    const items = [];

    // -----------------------
    // 1. FETCH POSTS
    // -----------------------
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, body")
      .limit(10000);

    if (postsError) throw postsError;

    posts.forEach((p) =>
      items.push({
        source: "post",
        id: p.id,
        text: p.body || "",
      })
    );

    // -----------------------
    // 2. FETCH REELS
    // -----------------------
    const { data: reels, error: reelsError } = await supabase
      .from("reels")
      .select("id, caption")
      .limit(10000);

    if (reelsError) throw reelsError;

    reels.forEach((r) =>
      items.push({
        source: "reel",
        id: r.id,
        text: r.caption || "",
      })
    );

    // -----------------------
    // 3. GENERATE + STORE EMBEDDINGS
    // -----------------------
    for (const item of items) {
      const embed = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: item.text,
      });

      const vector = embed.data[0].embedding;

      if (item.source === "post") {
        await supabase
          .from("posts")
          .update({ embedding: vector })
          .eq("id", item.id);
      } else if (item.source === "reel") {
        await supabase
          .from("reels")
          .update({ embedding: vector })
          .eq("id", item.id);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        total_indexed: items.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Embedding Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
