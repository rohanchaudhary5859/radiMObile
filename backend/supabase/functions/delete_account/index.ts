import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id } = await req.json();

    // Delete profile
    await supabase.from("profiles").delete().eq("id", user_id);

    // Delete auth user
    await supabase.auth.admin.deleteUser(user_id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
