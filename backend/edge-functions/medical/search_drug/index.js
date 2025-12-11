import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async (req) => {
  const { q } = await req.json();
  const { data } = await sb.from('drug_db').select('*').ilike('name', `%${q}%`).limit(20);
  return new Response(JSON.stringify({results: data}), {status:200});
}
