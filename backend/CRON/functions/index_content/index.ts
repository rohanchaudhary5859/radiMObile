import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async (req) => {
  try {
    const { source, sourceId, text } = await req.json()

    if (!source || !sourceId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
    }

    // Generate Embedding
    const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text ?? ""
      })
    })

    const embedJSON = await embedRes.json()
    const embedding = embedJSON.data[0].embedding

    await supabase.from("search_index").upsert([
      {
        source,
        source_id: sourceId,
        text,
        embedding
      }
    ])

    return new Response(JSON.stringify({ indexed: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
