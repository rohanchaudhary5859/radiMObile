import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { action, user_id } = await req.json();
    // fetch subscription row
    const { data: subs } = await supabase.from('subscriptions').select('*').eq('user_id', user_id).limit(1).single();
    if (!subs) return new Response(JSON.stringify({ error: 'no_subscription' }), { status: 404 });

    if (action === 'cancel') {
      await stripe.subscriptions.update(subs.stripe_subscription_id, { cancel_at_period_end: true });
      await supabase.from('subscriptions').update({ cancel_at_period_end: true }).eq('id', subs.id);
    } else if (action === 'resume') {
      await stripe.subscriptions.update(subs.stripe_subscription_id, { cancel_at_period_end: false });
      await supabase.from('subscriptions').update({ cancel_at_period_end: false }).eq('id', subs.id);
    } else if (action === 'cancel_now') {
      await stripe.subscriptions.del(subs.stripe_subscription_id);
      await supabase.from('subscriptions').update({ status: 'canceled' }).eq('id', subs.id);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('manage subscription err', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
