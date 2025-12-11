import { supabase } from "../config/supabase";

export async function followUser(follower, followTo) {
  return supabase.functions.invoke("follow_user", {
    body: { follower_id: follower, following_id: followTo },
  });
}

export async function unfollowUser(follower, followTo) {
  return supabase.functions.invoke("unfollow_user", {
    body: { follower_id: follower, following_id: followTo },
  });
}

export async function setRestricted(follower, followTo, restricted) {
  return supabase.functions.invoke("restricted_follow", {
    body: { follower_id: follower, following_id: followTo, restricted },
  });
}
