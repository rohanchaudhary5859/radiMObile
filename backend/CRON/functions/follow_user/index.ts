import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { follower_id, following_id } = await req.json();

    if (!follower_id || !following_id) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    await sb.from("follows").insert([{ follower_id, following_id }]);

    // Send notification
    await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + "/send_notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: following_id,
        type: "new_follower",
        title: "New Follower",
        body: "Someone followed you"
      })
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
