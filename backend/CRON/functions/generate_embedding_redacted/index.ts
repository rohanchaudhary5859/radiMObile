import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body = await req.json();
    const { source, sourceId } = body;

    if (!source || !sourceId) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    const { data: item } = await supabase
      .from(source)
      .select("*")
      .eq("id", sourceId)
      .single();

    if (!item) {
      return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    // PHI/PII REDACTION
    let text = `${item.title || ""}\n\n${item.body || ""}`
      .replace(/[0-9]{10,}/g, "[PHONE]")
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[EMAIL]")
      .replace(/[A-Za-z ]{3,20} Hospital/gi, "[HOSPITAL]");

    // Call OpenAI embedding API
    const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-large",
        input: text
      })
    });

    const embedJson = await embedRes.json();
    const embedding = embedJson.data[0].embedding;

    await supabase
      .from("ai_embeddings")
      .upsert({
        record_id: sourceId,
        record_type: source,
        embedding
      });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
