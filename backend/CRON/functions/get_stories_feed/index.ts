import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    const { userId } = await req.json();

    const { data: stories } = await sb
      .from("stories")
      .select("*, story_slides(*)")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    return new Response(JSON.stringify({ stories }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
