import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const body = await req.json();
    const { user_id, file_path, type } = body;

    if (!user_id || !file_path || !type)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    let updateData = {};

    if (type === "avatar") updateData.avatar_url = file_path;
    if (type === "cover") updateData.cover_url = file_path;
    if (type === "certificate") updateData.certificate_url = file_path;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user_id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("upload_media error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
