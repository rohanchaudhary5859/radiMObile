/**
 * reelService.js
 * - Upload reel metadata (video should be uploaded to storage separately)
 * - Fetch reels feed (paginated)
 * - Reel interactions (like, view)
 */

import { supabase } from '../config/supabase';

export async function uploadReel(userId, videoPath, caption = '', hashtags = []) {
  const payload = { user_id: userId, video_url: videoPath, caption, hashtags };
  return supabase.from('reels').insert([payload]).select().single();
}

export async function fetchReels({ limit = 20, cursor = null } = {}) {
  let q = supabase.from('reels').select('*, profiles(*)').order('created_at', { ascending: false }).limit(limit);
  if (cursor) q = q.gt('created_at', cursor);
  const { data, error } = await q;
  return { data, error };
}

export async function likeReel(reelId, userId) {
  return supabase.from('reel_likes').insert([{ reel_id: reelId, user_id: userId }]);
}

export async function recordReelView(reelId, userId = null) {
  return supabase.from('reel_views').insert([{ reel_id: reelId, user_id: userId }]);
}
