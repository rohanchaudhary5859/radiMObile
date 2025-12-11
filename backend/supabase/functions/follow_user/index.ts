import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { follower_id, following_id } = await req.json();

    if (!follower_id || !following_id)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    if (follower_id === following_id)
      return new Response(JSON.stringify({ error: "Cannot follow yourself" }), {
        status: 400,
      });

    await supabase.from("follows").insert([
      {
        follower_id,
        following_id,
      },
    ]);

    // Send follow notification
    await supabase.functions.invoke("send_notification", {
      body: {
        user_id: following_id,
        title: "New Follower",
        message: "Someone started following you!",
      },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
