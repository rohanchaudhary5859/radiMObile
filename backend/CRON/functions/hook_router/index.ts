import { createClient } from "@supabase/supabase-js";

export default async () => {
  const sb = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: events } = await sb
    .from("hook_events")
    .select("*")
    .eq("processed", false)
    .limit(10);

  if (!events || events.length === 0)
    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  for (const evt of events) {
    try {
      const type = evt.event_type;
      const payload = evt.payload;

      if (type === "post_created") {
        await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + "/index_content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await sb
        .from("hook_events")
        .update({ processed: true })
        .eq("id", evt.id);
    } catch (e) {
      console.log("ERROR:", e);
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
