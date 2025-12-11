import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id, fcm_token } = await req.json();

    if (!user_id || !fcm_token)
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    await supabase.from("profiles").update({
      fcm_token
    }).eq("id", user_id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
