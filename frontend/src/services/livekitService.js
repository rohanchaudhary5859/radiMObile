/**
 * livekitService.js
 * - Request LiveKit token from edge function
 * - Request generate stream key / start live / end live
 * Note: LiveKit SDK usage (join/subscribe) happens in screens using the token returned by these functions.
 */

import { SUPABASE_FUNCTIONS_URL } from '../config/supabase';

async function callFn(fnName, payload = {}) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/${fnName}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getLivekitToken(userId, name, roomName, role = 'listener') {
  return callFn('livekit_token', { userId, name, roomName, role });
}

export async function generateStreamKey(sessionId, hostId) {
  return callFn('generate_stream_key', { sessionId, hostId });
}

export async function startLive(sessionId, hostId) {
  return callFn('start_live', { sessionId, hostId });
}

export async function endLive(sessionId) {
  return callFn('end_live', { sessionId });
}
