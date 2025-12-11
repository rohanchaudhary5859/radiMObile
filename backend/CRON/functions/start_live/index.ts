import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { userId, title } = await req.json();

    const { data } = await sb
      .from("live_sessions")
      .insert([{ host_id: userId, title }])
      .select()
      .single();

    return new Response(JSON.stringify({ success: true, session: data }), { status: 200 });
  } 
  catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
