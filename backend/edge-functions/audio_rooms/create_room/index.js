import { createClient } from "@supabase/supabase-js";
import { AccessToken } from "livekit-server-sdk";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { host_id, title } = await req.json();
    const roomName = `audio_${host_id}_${Date.now()}`;

    // Create room entry
    const { data: room } = await supabase
      .from("audio_rooms")
      .insert([{ host_id, title, is_live: true }])
      .select()
      .single();

    // Add host as speaker
    await supabase.from("audio_room_members").insert([
      { room_id: room.id, user_id: host_id, is_speaker: true }
    ]);

    // LiveKit access token
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET, {
      identity: host_id,
    });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    return new Response(
      JSON.stringify({
        roomId: room.id,
        title,
        token: at.toJwt(),
        roomName,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
