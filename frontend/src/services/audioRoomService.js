export async function createRoom(host_id, title) {
  const r = await fetch(`${process.env.FUNCTION_URL}/create_room`, {
    method: "POST",
    body: JSON.stringify({ host_id, title }),
  });
  return await r.json();
}
