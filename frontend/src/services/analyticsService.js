export async function recordEvent(type, target_id, user_id, extra) {
  return fetch(`${process.env.FUNCTIONS_URL||''}/recordevent`, {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({type, target_id, user_id, extra})
  });
}
export async function getPostInsights(postId) {
  return fetch(`${process.env.FUNCTIONS_URL||''}/getpostinsights`,{method:'POST',headers:{'content-type':'application/json'}, body: JSON.stringify({post_id:postId})});
}
