import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { admin_id, type, id } = await req.json();

    // Check admin role
    const { data: isAdmin } = await supabase.rpc("is_admin", {
      user_id: admin_id,
    });

    if (!isAdmin)
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });

    // Determine table based on type
    const table =
      type === "post"
        ? "posts"
        : type === "reel"
        ? "reels"
        : type === "story"
        ? "stories"
        : null;

    if (!table)
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
      });

    await supabase.from(table).delete().eq("id", id);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
