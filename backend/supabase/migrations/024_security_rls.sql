
-- RLS Example (posts table)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_can_insert_posts
ON posts FOR INSERT
WITH CHECK ( auth.uid() = author_id );

CREATE POLICY user_can_view_public_or_own_posts
ON posts FOR SELECT
USING ( is_public = true OR auth.uid() = author_id );

CREATE POLICY user_can_update_own_posts
ON posts FOR UPDATE
USING ( auth.uid() = author_id );

CREATE POLICY user_can_delete_own_posts
ON posts FOR DELETE
USING ( auth.uid() = author_id );

-- Select only public stories or your own
CREATE POLICY "select stories"
ON stories FOR SELECT
USING (
  user_id = auth.uid() 
  OR is_public = true
);

-- Insert story only for own user
CREATE POLICY "insert story"
ON stories FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Delete only own story
CREATE POLICY "delete story"
ON stories FOR DELETE
USING (user_id = auth.uid());

ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

-- Anyone can view public reels
CREATE POLICY "select reels"
ON reels FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Upload reel
CREATE POLICY "insert reels"
ON reels FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update own reel only
CREATE POLICY "update reels"
ON reels FOR UPDATE
USING (auth.uid() = user_id);

-- Delete own reel
CREATE POLICY "delete reels"
ON reels FOR DELETE
USING (auth.uid() = user_id);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can create posts for themselves only
CREATE POLICY insert_posts
ON posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Users can read their own or public posts
CREATE POLICY select_posts
ON posts FOR SELECT
USING (
  is_public = true
  OR author_id = auth.uid()
);

-- Users can edit their own posts
CREATE POLICY update_posts
ON posts FOR UPDATE
USING (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY delete_posts
ON posts FOR DELETE
USING (auth.uid() = author_id);

CREATE TABLE follows (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE
);
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Follow someone
CREATE POLICY insert_follow
ON follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- Unfollow someone
CREATE POLICY delete_follow
ON follows FOR DELETE
USING (auth.uid() = follower_id);

-- View follower lists
CREATE POLICY select_follow
ON follows FOR SELECT
USING (true);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin table
CREATE POLICY select_admin_users
ON admin_users FOR SELECT
USING (is_admin(auth.uid()));

-- Only admin can modify admin rights (optional)
CREATE POLICY modify_admin_users
ON admin_users FOR ALL
USING (is_admin(auth.uid()));

-- Admin can delete any post
CREATE POLICY admin_delete_posts
ON posts FOR DELETE
USING (is_admin(auth.uid()));

-- Admin can delete any reel
CREATE POLICY admin_delete_reels
ON reels FOR DELETE
USING (is_admin(auth.uid()));

-- Admin can delete any story
CREATE POLICY admin_delete_stories
ON stories FOR DELETE
USING (is_admin(auth.uid()));

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Plans: select public plans for everyone
CREATE POLICY plans_select ON public.plans FOR SELECT USING ( active = true );

-- Subscriptions: user can manage their own subscription rows
CREATE POLICY subscriptions_select ON public.subscriptions FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY subscriptions_insert ON public.subscriptions FOR INSERT WITH CHECK ( auth.uid() = user_id );
CREATE POLICY subscriptions_update ON public.subscriptions FOR UPDATE USING ( auth.uid() = user_id );
CREATE POLICY subscriptions_delete ON public.subscriptions FOR DELETE USING ( auth.uid() = user_id );

-- Events: only service-role will insert, users may read their events if needed
CREATE POLICY subscription_events_select ON public.subscription_events FOR SELECT USING ( true );
ALTER TABLE follow_relationships ENABLE ROW LEVEL SECURITY;

-- User can follow
CREATE POLICY user_can_follow
ON follow_relationships
FOR INSERT
WITH CHECK ( auth.uid() = follower_id );

-- User can unfollow
CREATE POLICY user_can_unfollow
ON follow_relationships
FOR DELETE
USING ( auth.uid() = follower_id );

-- User can view who they follow
CREATE POLICY user_can_view_follows
ON follow_relationships
FOR SELECT
USING ( auth.uid() = follower_id OR auth.uid() = following_id );
