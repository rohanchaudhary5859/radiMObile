CREATE TABLE verification_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  specialization TEXT,
  certificate_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewer_id UUID
);

ALTER TABLE verification_requests
ADD FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
