/**
 * postService.js
 * - Create post (text / media path)
 * - Fetch feed (paginated)
 * - Get single post, like/unlike, comment
 */

import { supabase } from '../config/supabase';

export async function createPost(authorId, body, media = [], meta = {}) {
  const payload = { author_id: authorId, body, media, meta };
  const { data, error } = await supabase.from('posts').insert([payload]).select().single();
  return { data, error };
}

export async function fetchFeed({ limit = 20, cursor = null } = {}) {
  let q = supabase.from('posts').select('*, profiles(*)').order('created_at', { ascending: false }).limit(limit);
  if (cursor) q = q.gt('created_at', cursor);
  const { data, error } = await q;
  return { data, error };
}

export async function getPost(id) {
  return supabase.from('posts').select('*, profiles(*)').eq('id', id).single();
}

export async function likePost(postId, userId) {
  return supabase.from('post_likes').insert([{ post_id: postId, user_id: userId }]);
}

export async function unlikePost(postId, userId) {
  return supabase.from('post_likes').delete().match({ post_id: postId, user_id: userId });
}

export async function addComment(postId, userId, text) {
  const { data, error } = await supabase.from('comments').insert([{ post_id: postId, user_id: userId, text }]).select().single();
  return { data, error };
}
