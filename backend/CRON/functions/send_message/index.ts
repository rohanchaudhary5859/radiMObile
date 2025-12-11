import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  try {
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { chatId, senderId, type, content, mediaUrl } = await req.json();

    const { data } = await sb
      .from("messages")
      .insert([{ 
        chat_id: chatId,
        sender_id: senderId,
        type,          
        content,
        media_url: mediaUrl 
      }])
      .select()
      .single();

    // Send notification to receiver  
    const { data: chat } = await sb
      .from("chats")
      .select("user1,user2")
      .eq("id", chatId)
      .single();

    const receiver = chat.user1 === senderId ? chat.user2 : chat.user1;

    await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + "/send_notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: receiver,
        type: "new_message",
        title: "New Message",
        body: content || "Sent a media message"
      })
    });

    return new Response(JSON.stringify({ message: data }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
