-- 012_admin_schema.sql

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  role text CHECK (role IN ('superadmin', 'moderator', 'analyst')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text,
  permission text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.admin_permissions (role, permission)
VALUES
('superadmin', 'ban_user'),
('superadmin', 'hide_post'),
('superadmin', 'view_reports'),
('superadmin', 'view_stats'),
('moderator', 'hide_post'),
('moderator', 'view_reports'),
('analyst', 'view_stats')
ON CONFLICT DO NOTHING;

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req) => {
  try {
    const { user_id, full_name, specialization, certificate_url } =
      await req.json();

    if (!user_id || !certificate_url)
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });

    await supabase.from("verification_requests").insert([
      {
        user_id,
        full_name,
        specialization,
        certificate_url,
      },
    ]);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};


CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql;
