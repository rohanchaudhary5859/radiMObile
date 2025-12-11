import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { user_id } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: "missing" }), { status: 400 });

    // get conversations where user is member + last message
    const { data } = await supabase.rpc('get_user_conversations', { p_user_id: user_id });
    return new Response(JSON.stringify({ conversations: data }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
