import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { admin_id, user_id, reason } = await req.json();

    // Allow only admin
    const { data: isAdmin } = await supabase.rpc("is_admin", {
      user_id: admin_id,
    });

    if (!isAdmin)
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });

    // Ban user
    await supabase.from("profiles").update({
      is_banned: true,
      ban_reason: reason,
    })
    .eq("id", user_id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
