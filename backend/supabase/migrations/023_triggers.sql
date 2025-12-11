
-- Example trigger: when a post is created, insert hook_event
CREATE OR REPLACE FUNCTION trg_post_created()
RETURNS trigger AS $$
BEGIN
  INSERT INTO hook_events(event_type,payload)
  VALUES('post_created', jsonb_build_object('id',NEW.id,'author_id',NEW.author_id,'title',NEW.title,'body',NEW.body,'tags',NEW.tags));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_created_trigger
AFTER INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION trg_post_created();
-- Update follower count
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET follower_count = (
    SELECT COUNT(*) FROM follows WHERE following_id = NEW.following_id
  )
  WHERE id = NEW.following_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_follower_count
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION update_follower_count();


-- Update following count
CREATE OR REPLACE FUNCTION update_following_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET following_count = (
    SELECT COUNT(*) FROM follows WHERE follower_id = NEW.follower_id
  )
  WHERE id = NEW.follower_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_following_count
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION update_following_count();

CREATE OR REPLACE FUNCTION notify_follow()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications(user_id, type, message)
  VALUES (NEW.following_id, 'follow', 'You have a new follower');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_follow
AFTER INSERT ON follow_relationships
FOR EACH ROW EXECUTE PROCEDURE notify_follow();
