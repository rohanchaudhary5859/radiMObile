/**
 * storyService.js
 * - Create story metadata (media uploaded to storage)
 * - Fetch active stories for feed
 * - Mark story viewed
 */

import { supabase } from '../config/supabase';

export async function createStory(userId, mediaPath, type = 'image', text = '', meta = {}) {
  const payload = { user_id: userId, media_url: mediaPath, type, text, meta };
  return supabase.from('stories').insert([payload]).select().single();
}

export async function fetchActiveStories() {
  // Stories should be filtered server-side by expiry; here just simple fetch
  const { data, error } = await supabase.from('stories').select('*, profiles(*)').order('created_at', { ascending: false }).limit(200);
  return { data, error };
}

export async function markStoryViewed(storyId, userId) {
  return supabase.from('story_views').insert([{ story_id: storyId, user_id: userId }]);
}
