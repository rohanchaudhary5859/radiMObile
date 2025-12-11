import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id, full_name, specialization, certificate_url } =
      await req.json();

    if (!user_id || !certificate_url)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    await supabase.from("verification_requests").insert([
      {
        user_id,
        full_name,
        specialization,
        certificate_url,
      },
    ]);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
