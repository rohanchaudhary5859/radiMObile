import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const body = await req.json();
    const {
      user_id,
      full_name,
      username,
      specialization,
      about,
      education,
      experience,
      profile_url,
      cover_url,
      is_verified
    } = body;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "User ID missing" }), { status: 400 });
    }

    // Username must be unique
    if (username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user_id)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: "Username already taken" }), { status: 409 });
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name,
        username,
        specialization,
        about,
        education,
        experience,
        profile_url,
        cover_url,
        is_verified
      })
      .eq("id", user_id);

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
