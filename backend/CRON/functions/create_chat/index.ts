import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { user1, user2 } = await req.json();

    // Check if chat exists already
    const existing = await sb
      .from("chats")
      .select("*")
      .or(`user1.eq.${user1},user2.eq.${user2}`)
      .or(`user1.eq.${user2},user2.eq.${user1}`)
      .maybeSingle();

    if (existing.data) {
      return new Response(JSON.stringify({ chat: existing.data }), { status: 200 });
    }

    const { data } = await sb
      .from("chats")
      .insert([{ user1, user2 }])
      .select()
      .single();

    return new Response(JSON.stringify({ chat: data }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
