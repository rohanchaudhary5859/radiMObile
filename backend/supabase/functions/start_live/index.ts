import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { host_id } = await req.json();

    const { data: stream } = await supabase
      .from("live_streams")
      .select("*")
      .eq("host_id", host_id)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET, {
      identity: host_id,
    });

    at.addGrant({
      roomJoin: true,
      room: stream.room_name,
      canPublish: true,
      canPublishData: true,
    });

    // mark as live
    await supabase
      .from("live_streams")
      .update({ is_live: true, started_at: new Date() })
      .eq("id", stream.id);

    return new Response(
      JSON.stringify({ token: at.toJwt(), roomName: stream.room_name }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
