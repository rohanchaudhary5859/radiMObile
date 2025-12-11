/**
 * exploreService.js
 * - Search and explore related functions
 * - Calls search edge function which uses pgvector under the hood
 */

import { SUPABASE_FUNCTIONS_URL } from '../config/supabase';

export async function search(query, type = 'all', limit = 20) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, type, limit })
  });
  return res.json();
}

export async function getTrendingTopics(limit = 20) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/trending`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit })
  });
  return res.json();
}
import { supabase } from "../config/supabase";

export async function search(query) {
  return supabase.functions.invoke("search", {
    body: { query },
  });
}

export async function getTrending() {
  return supabase.functions.invoke("trending");
}

export async function getSuggestions(userId) {
  return supabase.functions.invoke("suggestions", {
    body: { user_id: userId },
  });
}


