import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req) => {
  const { user_id, price_id } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: `${user_id}@radiapp.com`,
    line_items: [{ price: price_id, quantity: 1 }],
    success_url: "radi://success",
    cancel_url: "radi://cancel",
  });

  return new Response(JSON.stringify({ url: session.url }), { status: 200 });
};
