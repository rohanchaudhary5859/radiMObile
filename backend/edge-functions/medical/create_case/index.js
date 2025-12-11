import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export default async (req) => {
  try{
    const { author_id, title, body, attachments } = await req.json();
    const { data, error } = await sb.from('cases').insert([{ author_id, title, body, attachments }]).select().single();
    if(error) throw error;
    return new Response(JSON.stringify({case: data}),{status:200});
  }catch(e){return new Response(JSON.stringify({error:e.message}),{status:500});}
}
