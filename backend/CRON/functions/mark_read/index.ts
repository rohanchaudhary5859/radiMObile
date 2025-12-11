import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { chatId, userId } = await req.json();

    await sb
      .from("messages")
      .update({ seen: true })
      .eq("chat_id", chatId)
      .neq("sender_id", userId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
