// create_checkout_session
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const ORIGIN = process.env.FRONTEND_ORIGIN || 'exp://localhost';

export default async (req) => {
  try {
    const body = await req.json();
    const { user_id, price_id, success_url, cancel_url } = body;
    if (!user_id || !price_id) return new Response(JSON.stringify({ error: 'missing' }), { status: 400 });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: success_url || `${ORIGIN}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${ORIGIN}`,
      metadata: { user_id },
    });

    // You may optionally create a local placeholder subscription row (status: incomplete)
    await supabase.from('subscriptions').insert([{
      user_id,
      plan_id: null,
      stripe_subscription_id: null,
      status: 'incomplete',
      metadata: { checkout_session: session.id }
    }]).catch(() => {});

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), { status: 200 });
  } catch (err) {
    console.error('create_checkout_session err', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
