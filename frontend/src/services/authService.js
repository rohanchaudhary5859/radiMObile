import { supabase, SUPABASE_FUNCTIONS_URL } from '../config/supabase';

// sign in with email
export async function emailSignIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

// sign in with otp (phone)
export async function sendOtp(phone) {
  return supabase.auth.signInWithOtp({ phone });
}

// call edge function
export async function fetchLivekitToken(payload) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/livekit_token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
