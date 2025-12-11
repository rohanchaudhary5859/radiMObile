import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { request_id, approved, admin_id } = await req.json();

    const new_status = approved ? "approved" : "rejected";

    const { data } = await supabase
      .from("verification_requests")
      .update({
        status: new_status,
        reviewer_id: admin_id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", request_id)
      .select()
      .single();

    // If approved → update profile badge
    if (approved) {
      await supabase
        .from("profiles")
        .update({ is_verified: true, verified_badge: data.specialization })
        .eq("id", data.user_id);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
