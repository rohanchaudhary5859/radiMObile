import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  const { follower_id, following_id, restricted } = await req.json();

  const { error } = await supabase
    .from("follow_relationships")
    .update({ restricted })
    .eq("follower_id", follower_id)
    .eq("following_id", following_id);

  if (error) return new Response(JSON.stringify({ error }), { status: 400 });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
