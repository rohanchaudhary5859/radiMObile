// frontend/src/config/supabase.js
import 'react-native-get-random-values'; // required for RN + supabase JS
import { createClient } from '@supabase/supabase-js';
import env from './env.json';

// Basic Supabase client used across the app
// Use anon key for client-side calls; for protected server operations use service role on server.
export const SUPABASE_URL = env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;
export const SUPABASE_FUNCTIONS_URL = env.SUPABASE_FUNCTIONS_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase keys missing in src/config/env.json');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  // optional global settings
  auth: {
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      // optional: enable presence or other params
    }
  }
});

// helper to call edge functions
export async function callFunction(name, payload = {}) {
  const url = `${SUPABASE_FUNCTIONS_URL}/${name}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
