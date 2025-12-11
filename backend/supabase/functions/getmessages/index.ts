import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { conversation_id, limit = 50, before } = await req.json();
    if (!conversation_id) return new Response(JSON.stringify({ error: "missing" }), { status: 400 });

    let query = supabase.from("messages").select("*").eq("conversation_id", conversation_id).order("created_at", { ascending: false }).limit(limit);

    if (before) {
      query = query.lt("created_at", before);
    }

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify({ messages: data.reverse() }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
