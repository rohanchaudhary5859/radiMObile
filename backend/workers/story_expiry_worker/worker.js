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
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

async function run() {
  const expire = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data } = await sb
    .from("stories")
    .select("*")
    .lt("created_at", expire);

  for (const s of data) {
    await sb.from("stories").delete().eq("id", s.id);
  }
}

run();

