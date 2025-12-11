import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const { user_id, ip, device } = await req.json();

  await supabase.from("login_alerts").insert({
    user_id,
    ip,
    device,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
