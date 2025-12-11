import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { conversation_id, sender_id, text, media } = await req.json();

    if (!conversation_id || !sender_id || (!text && !media))
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });

    // Insert message
    const { data, error } = await supabase
      .from("messages")
      .insert([{
        conversation_id,
        sender_id,
        text: text || null,
        media: media || []
      }])
      .select()
      .single();

    if (error) throw error;

    // Find conversation members excluding sender
    const { data: members } = await supabase
      .from("conversation_members")
      .select("user_id")
      .eq("conversation_id", conversation_id);

    const memberIds = members.map(m => m.user_id).filter(id => id !== sender_id);

    // Create in-app notifications for each member (async)
    for (const uid of memberIds) {
      await supabase.from("notifications").insert([{
        user_id: uid,
        type: "message",
        title: "New Message",
        body: (text || 'Sent a message'),
        data: { conversation_id, sender_id, message_id: data.id },
      }]).catch(() => {});
    }

    // Optionally send push to all members (via sendpush function)
    for (const uid of memberIds) {
      await supabase.functions.invoke("sendpush", {
        body: {
          user_id: uid,
          title: "New Message",
          body: text || 'Sent a message',
          data: { conversation_id, sender_id, message_id: data.id }
        }
      }).catch(()=>{});
    }

    // Return inserted message
    return new Response(JSON.stringify({ message: data }), { status: 200 });

  } catch (err) {
    console.error("sendmessage error", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
