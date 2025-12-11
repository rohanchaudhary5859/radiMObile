// unified_embedding_handler.ts

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// ---------------------------------------------
// 🔹 Generate embedding using OpenAI API
// ---------------------------------------------
async function generateEmbedding(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return res.data[0].embedding;
}

// ---------------------------------------------
// 🔹 Unified Edge Function
// Handles:
//    1) Search indexing
//    2) Post embedding updates
// ---------------------------------------------
export default async (req) => {
  try {
    const body = await req.json();

    const { source, sourceId, text, post_id, content } = body;

    // ──────────────────────────────────────────────
    // CASE 1: Search Indexing
    // Parameters required → source, sourceId, text
    // ──────────────────────────────────────────────
    if (source && sourceId && text) {
      const embedding = await generateEmbedding(text);

      await supabase.from("search_index").upsert([
        {
          source,
          source_id: sourceId,
          text,
          embedding,
        },
      ]);

      return new Response(JSON.stringify({ ok: true, type: "search_index" }), {
        status: 200,
      });
    }

    // ──────────────────────────────────────────────
    // CASE 2: Update Post Embedding
    // Parameters required → post_id, content
    // ──────────────────────────────────────────────
    if (post_id && content) {
      const embedding = await generateEmbedding(content);

      await supabase
        .from("posts")
        .update({ embedding })
        .eq("id", post_id);

      return new Response(JSON.stringify({ ok: true, type: "post_update" }), {
        status: 200,
      });
    }

    // ──────────────────────────────────────────────
    // Missing required fields
    // ──────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        error: "Invalid request. Provide either {source, sourceId, text} OR {post_id, content}",
      }),
      { status: 400 }
    );

  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
