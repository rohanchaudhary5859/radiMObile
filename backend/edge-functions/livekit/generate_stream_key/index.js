import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { host_id } = await req.json();

    const roomName = `live_${host_id}_${Date.now()}`;
    const streamKey = `${host_id}_${Math.random().toString(36).substring(2,10)}`;

    // Save to DB
    await supabase
      .from("live_streams")
      .insert([{ host_id, stream_key: streamKey, room_name: roomName }]);

    return new Response(JSON.stringify({ streamKey, roomName }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
