import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    const { query } = await req.json();

    const { data } = await sb
      .from("profiles")
      .select("*")
      .ilike("username", `%${query}%`);

    return new Response(JSON.stringify({ results: data }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
