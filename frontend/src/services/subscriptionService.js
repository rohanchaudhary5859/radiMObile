// frontend/src/services/subscriptionService.js
const FUNCTIONS_URL = 'https://YOUR-PROJECT.functions.supabase.co';

export async function createCheckout(userId, priceId) {
  const res = await fetch(`${FUNCTIONS_URL}/create_checkout_session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, price_id: priceId })
  });
  return res.json();
}

export async function cancelSubscription(userId) {
  const res = await fetch(`${FUNCTIONS_URL}/cancel_subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  return res.json();
}