import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { userId, type, title, body, data } = await req.json();

    const { data: tokens } = await supabase
      .from("push_tokens")
      .select("token")
      .eq("user_id", userId);

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ error: "No device token found" }), { status: 404 });
    }

    const messages = tokens.map(t => ({
      to: t.token,
      title,
      body,
      data: { type, ...data }
    }));

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages)
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
