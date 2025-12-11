import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const FCM_KEY = process.env.FCM_SERVER_KEY;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id, title, body, data } = await req.json();

    const { data: user } = await supabase
      .from("profiles")
      .select("fcm_token")
      .eq("id", user_id)
      .single();

    if (!user?.fcm_token)
      return new Response(JSON.stringify({ error: "No token found" }), { status: 400 });

    const payload = {
      to: user.fcm_token,
      notification: { title, body },
      data
    };

    await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${FCM_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
