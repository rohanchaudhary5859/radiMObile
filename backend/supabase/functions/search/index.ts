import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  const { query } = await req.json();

  const embed = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query
  });

  const vector = embed.data[0].embedding;

  const { data } = await supabase.rpc("match_posts", {
    query_embedding: vector,
    match_count: 20
  });

  return new Response(JSON.stringify({ results: data }), { status: 200 });
};
