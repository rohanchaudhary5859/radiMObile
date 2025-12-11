import { supabase } from "../config/supabase";

export async function registerPushToken(userId, token) {
  return supabase.functions.invoke("register_token", {
    body: { user_id: userId, token },
  });
}

export async function fetchNotifications(userId) {
  return supabase.from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}
