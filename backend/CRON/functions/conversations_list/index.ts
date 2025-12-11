import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { userId } = await req.json();

    const { data: chats } = await sb
      .from("chats")
      .select("*, messages(*)")
      .or(`user1.eq.${userId}, user2.eq.${userId}`);

    // Last message extraction
    const final = chats.map(c => {
      const lastMsg = c.messages?.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
      return { ...c, last_message: lastMsg || null };
    });

    return new Response(JSON.stringify({ conversations: final }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
