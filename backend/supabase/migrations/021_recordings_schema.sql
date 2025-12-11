-- 021_recordings_schema.sql
CREATE TABLE IF NOT EXISTS public.recording_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.live_sessions(id),
  status text DEFAULT 'pending',
  result jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.live_sessions(id),
  path text,
  created_at timestamptz DEFAULT now()
);