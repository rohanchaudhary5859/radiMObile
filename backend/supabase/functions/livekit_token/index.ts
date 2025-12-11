import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const body = await req.json();
    const { stream_id, user_id, room } = body;

    let roomName = room;

    // ---------- 1️⃣ SUPABASE STREAM LOOKUP (IF stream_id PROVIDED) ----------
    let stream = null;
    if (stream_id) {
      const { data, error } = await supabase
        .from("live_streams")
        .select("*")
        .eq("id", stream_id)
        .single();

      if (error) throw error;

      stream = data;
      roomName = stream.room_name;
    }

    // ---------- 2️⃣ RECORD VIEWER (OPTIONAL) ----------
    if (stream_id && user_id) {
      await supabase.from("live_viewers").insert([
        { stream_id, user_id }
      ]);
    }

    // ---------- 3️⃣ LIVEKIT SERVER SDK TOKEN ----------
    const livekitAccessToken = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_SECRET,
      {
        identity: user_id,
      }
    );

    livekitAccessToken.addGrant({
      roomJoin: true,
      room: roomName,
      canSubscribe: true,
    });

    const livekitToken = livekitAccessToken.toJwt();

    // ---------- 4️⃣ JWT TOKEN (SECOND TYPE) ----------
    const jwtToken = jwt.sign(
      {
        sub: user_id,
        room: roomName,
        permissions: ["join", "publish", "subscribe"],
      },
      process.env.LIVEKIT_SECRET,
      { expiresIn: "1h" }
    );

    // ---------- 5️⃣ SUCCESS RESPONSE ----------
    return new Response(
      JSON.stringify({
        roomName,
        livekitToken,
        jwtToken,
        url: process.env.LIVEKIT_URL,
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
};
