/**
 * chatService.js
 * - Create chat room / fetch chat list
 * - Send message (text / media path)
 * - Fetch messages (paginated)
 * - Mark seen, delete
 */

import { supabase } from '../config/supabase';

export async function getOrCreateDm(userA, userB) {
  // simplistic approach: attempt to find existing DM room with both participants
  const { data } = await supabase
    .from('chat_rooms')
    .select('*')
    .contains('participants', [userA, userB])
    .limit(1)
    .single();
  if (data) return data;
  const payload = { participants: [userA, userB], created_at: new Date().toISOString() };
  const res = await supabase.from('chat_rooms').insert([payload]).select().single();
  return res.data;
}

export async function sendMessage(roomId, userId, text = '', media = null) {
  const payload = { room_id: roomId, sender_id: userId, text, media };
  const { data, error } = await supabase.from('messages').insert([payload]).select().single();
  return { data, error };
}

export async function fetchMessages(roomId, { limit = 50, before = null } = {}) {
  let q = supabase.from('messages').select('*, profiles(*)').eq('room_id', roomId).order('created_at', { ascending: true }).limit(limit);
  if (before) q = q.lt('created_at', before);
  return q;
}

export async function markMessagesSeen(roomId, userId) {
  return supabase.from('messages_seen').upsert([{ room_id: roomId, user_id: userId, seen_at: new Date().toISOString() }]);
}
export async function sendMessage(senderId, receiverId, text) {
  // Save message in DB
  const { data, error } = await supabase.from("messages").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    text
  }).select().single();

  if (error) throw error;

  // 🔔 In-app notification
  await supabase.functions.invoke("send_notification", {
    body: {
      user_id: receiverId,
      type: "message",
      title: "New Message",
      body: text,
      data: { sender_id: senderId }
    }
  });

  // 🔔 Push notification (lock screen)
  await supabase.functions.invoke("sendpush", {
    body: {
      user_id: receiverId,
      title: "New Message",
      body: text,
      data: {
        screen: "ChatRoom",
        sender_id: senderId
      }
    }
  });

  return data;
}
