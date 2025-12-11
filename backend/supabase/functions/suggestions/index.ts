import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const { user_id } = await req.json();

  const { data } = await supabase.rpc("get_suggested_users", {
    uid: user_id
  });

  return new Response(JSON.stringify({ suggestions: data }), { status: 200 });
};
