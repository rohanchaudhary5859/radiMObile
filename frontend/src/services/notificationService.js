/**
 * notificationService.js
 * - Register device push token
 * - Fetch notifications
 * - Mark notifications read / delete
 */

import { supabase } from '../config/supabase';
import env from '../config/env.json';

export async function registerPushToken(userId, token, provider = 'expo') {
  // token example: Expo push token or FCM token
  return supabase.from('push_tokens').upsert([{ user_id: userId, token, provider }]);
}

export async function fetchNotifications(userId, { limit = 50 } = {}) {
  return supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
}

export async function markRead(notificationId) {
  return supabase.from('notifications').update({ read: true }).eq('id', notificationId);
}

export async function sendPushViaExpo(toToken, title, body, extra = {}) {
  // client-side demo only — in production call your server/edge fn to send push
  const payload = { to: toToken, title, body, data: extra };
  const res = await fetch(env.EXPO_PUSH_SERVER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}
