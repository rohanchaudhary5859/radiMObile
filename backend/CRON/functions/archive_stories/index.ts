import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const sb = createClient(url, key);

    const now = new Date().toISOString();

    // Get expired stories
    const { data: expired, error: expiredErr } = await sb
      .from("stories")
      .select("*")
      .lte("expires_at", now);

    if (expiredErr) {
      return new Response(JSON.stringify({ error: expiredErr.message }), { status: 500 });
    }

    if (expired && expired.length > 0) {
      // Archive stories properly
      const archivePayload = expired.map((s) => ({
        ...s,
        archived_at: now,
      }));

      const { error: archiveErr } = await sb
        .from("story_archive")
        .insert(archivePayload);

      if (archiveErr) {
        return new Response(JSON.stringify({ error: archiveErr.message }), { status: 500 });
      }

      // Delete expired from active table
      const { error: deleteErr } = await sb
        .from("stories")
        .delete()
        .lte("expires_at", now);

      if (deleteErr) {
        return new Response(JSON.stringify({ error: deleteErr.message }), { status: 500 });
      }
    }

    return new Response(
      JSON.stringify({ archived_count: expired?.length ?? 0, status: "success" }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
