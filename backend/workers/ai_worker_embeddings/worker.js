import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function generateEmbedding(text) {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({ input: text, model: "text-embedding-3-small" }),
  });

  const j = await r.json();
  return j.data[0].embedding;
}

async function processJob(job) {
  try {
    const embedding = await generateEmbedding(job.text);

    await supabase.from("search_index").upsert([
      {
        source: job.source,
        source_id: job.source_id,
        text: job.text,
        embedding,
      },
    ]);

    await supabase
      .from("ai_jobs")
      .update({ status: "done" })
      .eq("id", job.id);
  } catch (err) {
    console.log("Job failed", err);
    await supabase
      .from("ai_jobs")
      .update({ status: "error" })
      .eq("id", job.id);
  }
}

async function loop() {
  while (true) {
    const { data } = await supabase
      .from("ai_jobs")
      .select("*")
      .eq("status", "pending")
      .limit(10);

    if (!data.length) {
      await new Promise((r) => setTimeout(r, 3000));
      continue;
    }

    for (const job of data) {
      await supabase
        .from("ai_jobs")
        .update({ status: "processing" })
        .eq("id", job.id);

      await processJob(job);
    }
  }
}

loop();
