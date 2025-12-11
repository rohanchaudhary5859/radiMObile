CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT,
  price_cents INT,
  currency TEXT DEFAULT 'usd',
  stripe_price_id TEXT
);
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  plan_id TEXT REFERENCES plans(id),
  status TEXT,
  current_period_end TIMESTAMPTZ
);
