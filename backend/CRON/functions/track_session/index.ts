import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const { user_id, device, ip } = await req.json();

  await supabase.from("session_tracking").insert({
    user_id,
    device,
    ip,
    created_at: new Date(),
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
