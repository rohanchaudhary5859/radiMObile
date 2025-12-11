import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { query } = await req.json();

    // first embed the query
    const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-large",
        input: query
      })
    });

    const embedJson = await embedRes.json();
    const vector = embedJson.data[0].embedding;

    // pgvector search
    const { data: results } = await sb.rpc("match_posts", {
      query_embedding: vector,
      similarity_threshold: 0.75,
      match_count: 10
    });

    return new Response(JSON.stringify({ results }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
