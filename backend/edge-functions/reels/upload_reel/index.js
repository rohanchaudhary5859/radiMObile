import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Generate thumbnail frame from video URL (Supabase Storage)
async function generateThumbnail(videoUrl) {
  return videoUrl + "?format=jpg&frame=1"; 
}

// AI caption generator (optional)
async function aiCaption(text) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Write a caption for: ${text}` }],
    }),
  });

  const json = await response.json();
  return json.choices[0].message.content;
}

export default async (req) => {
  try {
    const { user_id, video_url, caption } = await req.json();

    if (!user_id || !video_url)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    const thumbnail = await generateThumbnail(video_url);
    const ai_caption = await aiCaption(caption || "Medical reel");

    // Insert into DB
    const { data, error } = await supabase.from("reels").insert([
      {
        user_id,
        video_url,
        caption: caption || ai_caption,
        thumbnail,
      },
    ]);

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, reel: data }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
