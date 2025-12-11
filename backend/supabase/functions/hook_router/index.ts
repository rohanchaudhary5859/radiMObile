// hook_router: validate incoming webhook / external events and route to dispatch_event
import fetch from 'node-fetch';

const FUNCTIONS_URL = process.env.SUPABASE_FUNCTIONS_URL; // e.g. https://.../functions/v1

// simple HMAC check optional (if you set HOOK_SECRET)
function verifySignature(body, signature) {
  const secret = process.env.HOOK_SECRET;
  if (!secret) return true;
  // implement HMAC verify if you want; placeholder returns true for now
  return true;
}

export default async (req) => {
  try {
    const raw = await req.text();
    const signature = req.headers.get('x-hook-signature') || '';
    if (!verifySignature(raw, signature)) {
      return new Response(JSON.stringify({ error: 'invalid_signature' }), { status: 401 });
    }

    const payload = JSON.parse(raw);
    // example payload mapping: { type: 'new_message', data: {...} }
    const channel = payload.type;
    const eventPayload = payload.data;

    // forward to dispatch_event
    await fetch(`${FUNCTIONS_URL}/dispatchevent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ channel, payload: eventPayload }),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    console.error('hook_router err', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
