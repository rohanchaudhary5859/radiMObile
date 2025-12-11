import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { comment, user_id, post_id } = await req.json();

    const prompt = `Moderate this comment: "${comment}". 
Classify as: safe, spam, hate, abuse. 
Return ONLY one word.`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const label = res.choices[0].message.content.toLowerCase();

    if (label !== "safe") {
      await supabase.from("notifications").insert([
        {
          user_id,
          type: "comment_blocked",
          title: "Comment Blocked",
          body: `Your comment was blocked for: ${label}`,
          data: { post_id },
        },
      ]);
    }

    return new Response(JSON.stringify({ status: label }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
