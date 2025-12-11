import { createClient } from "@supabase/supabase-js";

export default async (req) => {
  try {
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { userId, mediaUrls, caption, mentions } = await req.json();

    if (!mediaUrls || mediaUrls.length === 0) {
      return new Response(JSON.stringify({ error: "No story media provided" }), { status: 400 });
    }

    const { data: story } = await sb
      .from("stories")
      .insert([{
        user_id: userId,
        caption,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }])
      .select()
      .single();

    const slides = mediaUrls.map(url => ({
      story_id: story.id,
      media_url: url,
    }));

    await sb.from("story_slides").insert(slides);

    // Mention notifications
    if (mentions?.length) {
      for (const m of mentions) {
        const { data: profile } = await sb
          .from("profiles")
          .select("id")
          .eq("username", m)
          .single();

        if (profile) {
          await fetch(process.env.SUPABASE_FUNCTIONS_ENDPOINT + "/send_notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: profile.id,
              type: "story_mention",
              title: "You were mentioned",
              body: "You were mentioned in a story",
            }),
          });
        }
      }
    }

    return new Response(JSON.stringify({ story }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
