CREATE TABLE IF NOT EXISTS audio_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id),
  title TEXT,
  is_live BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_room_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id UUID REFERENCES audio_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  is_speaker BOOLEAN DEFAULT false
);
-- Admin table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin', -- super_admin / admin / reviewer
  created_at TIMESTAMP DEFAULT NOW()
);

-- Doctor verification requests
CREATE TABLE IF NOT EXISTS doctor_verification (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  certificate_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES admin_users(id),
  reviewed_at TIMESTAMP
);

-- Ban table
CREATE TABLE IF NOT EXISTS banned_users (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  reason TEXT,
  banned_at TIMESTAMP DEFAULT NOW()
);

-- Admin analytics cache
CREATE TABLE IF NOT EXISTS admin_stats (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key TEXT UNIQUE,
  value BIGINT DEFAULT 0
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

-- Allow SELECT to admins only
CREATE POLICY admin_select ON admin_users
FOR SELECT USING (auth.jwt()->>'role' = 'admin');

CREATE POLICY doctor_verification_manage ON doctor_verification
FOR SELECT USING (auth.jwt()->>'role' = 'admin');
