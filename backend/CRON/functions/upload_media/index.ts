import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { bucket, fileName, fileData } = await req.json();

    if (!bucket || !fileName || !fileData) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    const buffer = Buffer.from(fileData, "base64");

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError }), { status: 400 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return new Response(JSON.stringify({ url: urlData.publicUrl }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
