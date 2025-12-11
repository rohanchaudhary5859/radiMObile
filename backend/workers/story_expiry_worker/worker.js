import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function loop() {
  while (true) {
    const now = new Date().toISOString();

    await supabase.from("stories").delete().lt("expires_at", now);

    await new Promise((r) => setTimeout(r, 60000)); // check every 60s
  }
}

loop();
