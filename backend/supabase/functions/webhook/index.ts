// webhook
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async (req) => {
  const buf = await req.arrayBuffer();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    // Handle relevant events: checkout.session.completed, invoice.payment_succeeded, customer.subscription.updated, customer.subscription.deleted
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const user_id = session.metadata?.user_id;

      // Retrieve subscription
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        // upsert subscription into DB
        await supabase.from('subscriptions').upsert([{
          user_id,
          plan_id: null,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          metadata: sub
        }], { onConflict: ['stripe_subscription_id'] });
      }
    }

    if (event.type === 'invoice.payment_succeeded' || event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const stripeSubscriptionId = invoice.subscription;
      const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

      await supabase.from('subscriptions').update({
        status: sub.status,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        metadata: sub
      }).eq('stripe_subscription_id', stripeSubscriptionId);
    }

    if (event.type === 'customer.subscription.deleted') {
      const subObj = event.data.object;
      await supabase.from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', subObj.id);
    }

    // record raw event (optional)
    await supabase.from('subscription_events').insert([{
      subscription_id: null,
      event_type: event.type,
      payload: event.data.object
    }]).catch(()=>{});

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error('webhook processing err', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
