import { AccessToken } from "livekit-server-sdk";

export default async (req) => {
  try {
    const { userId, name, roomName, role } = await req.json();

    const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity: String(userId),
      name
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: role === "host",
      canPublishSources: role === "host",
      canSubscribe: true,
    });

    return new Response(JSON.stringify({ token: at.toJwt() }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 });
  }
};
