// frontend/src/services/followService.js
import { supabase } from "../config/supabase";

/**
 * Call edge functions if you deployed them, otherwise directly manipulate table using service role or client.
 * Here we try supabase.functions.invoke first; fallback to direct table insert/delete.
 */

export async function followUser(follower, following) {
  try {
    // try edge function
    if (supabase.functions) {
      const res = await supabase.functions.invoke("follow_user", {
        body: { follower_id: follower, following_id: following },
      });
      return res;
    }
  } catch (e) { console.warn("edge follow failed, fallback", e); }

  // fallback direct insert (client must have rights)
  return supabase.from("follow_relationships").insert([{ follower_id: follower, following_id: following }]);
}

export async function unfollowUser(follower, following) {
  try {
    if (supabase.functions) {
      const res = await supabase.functions.invoke("unfollow_user", {
        body: { follower_id: follower, following_id: following },
      });
      return res;
    }
  } catch (e) { console.warn("edge unfollow failed, fallback", e); }

  return supabase
    .from("follow_relationships")
    .delete()
    .eq("follower_id", follower)
    .eq("following_id", following);
}

export async function isFollowing(follower, following) {
  // quick check on DB
  const { data, error } = await supabase
    .from("follow_relationships")
    .select("*")
    .eq("follower_id", follower)
    .eq("following_id", following)
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "No rows" type — ignore if single returns no rows
    // but just return false on error
    return false;
  }
  return !!data;
}
