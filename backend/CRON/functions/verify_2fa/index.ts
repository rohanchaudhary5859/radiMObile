import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const { user_id, code } = await req.json();

  const { data } = await supabase
    .from("twofa_codes")
    .select("*")
    .eq("user_id", user_id)
    .eq("code", code)
    .single();

  if (!data) {
    return new Response(JSON.stringify({ verified: false }), { status: 400 });
  }

  return new Response(JSON.stringify({ verified: true }), { status: 200 });
};
