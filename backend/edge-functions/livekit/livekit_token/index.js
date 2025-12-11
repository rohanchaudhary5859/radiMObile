import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { stream_id, user_id } = await req.json();

    const { data: stream } = await supabase
      .from("live_streams")
      .select("*")
      .eq("id", stream_id)
      .single();

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET, {
      identity: user_id,
    });

    at.addGrant({
      roomJoin: true,
      room: stream.room_name,
      canSubscribe: true,
    });

    // record viewer
    await supabase.from("live_viewers").insert([
      {
        stream_id,
        user_id,
      },
    ]);

    return new Response(
      JSON.stringify({ token: at.toJwt(), roomName: stream.room_name }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
