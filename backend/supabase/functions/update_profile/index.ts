import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const body = await req.json();
    const { user_id, full_name, bio, specialization, website, cover_url } = body;

    if (!user_id)
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      });

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name,
        bio,
        specialization,
        website,
        cover_url,
      })
      .eq("id", user_id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("update_profile error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
