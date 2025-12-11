import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id, media_url, media_type } = await req.json();

    if (!user_id || !media_url)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    const { data, error } = await supabase.from("stories").insert([
      {
        user_id,
        media_url,
        media_type,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, story: data }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
