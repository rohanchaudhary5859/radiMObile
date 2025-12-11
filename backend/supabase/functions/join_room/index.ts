import { createClient } from "@supabase/supabase-js";
import { AccessToken } from "livekit-server-sdk";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async (req) => {
  try {
    const { room_id, user_id } = await req.json();

    // Fetch room
    const { data: room } = await supabase
      .from("audio_rooms")
      .select("*")
      .eq("id", room_id)
      .single();

    if (!room || room.is_live === false)
      return new Response(JSON.stringify({ error: "Room closed" }), { status: 400 });

    // Check if user already in room
    const { data: existing } = await supabase
      .from("audio_room_members")
      .select("*")
      .eq("room_id", room_id)
      .eq("user_id", user_id)
      .single();

    if (!existing) {
      await supabase
        .from("audio_room_members")
        .insert([{ room_id, user_id, is_speaker: false }]);
    }

    // Generate listener token
    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET, {
      identity: user_id,
    });
    at.addGrant({
      roomJoin: true,
      room: room_id,
      canSubscribe: true,
      canPublish: false,
    });

    return new Response(
      JSON.stringify({
        token: at.toJwt(),
        roomName: room_id,
        isSpeaker: existing?.is_speaker ?? false,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
