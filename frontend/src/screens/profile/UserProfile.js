// frontend/src/screens/Profile/UserProfile.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { followUser, unfollowUser, isFollowing } from "../../services/followService";
import { supabase } from "../../config/supabase";

export default function UserProfile({ route, navigation }) {
  const { user } = useAuth(); // logged-in user
  const profile = route.params?.profile; // passed profile object (id, name, avatar,...)
  const profileId = profile?.id;
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !profileId) return;
    checkFollowing();
  }, [user, profileId]);

  async function checkFollowing() {
    setLoading(true);
    const res = await isFollowing(user.id, profileId);
    setFollowing(!!res);
    setLoading(false);
  }

  async function handleFollowToggle() {
    if (!user || !profileId) return;
    setLoading(true);
    try {
      if (!following) {
        await followUser(user.id, profileId);
        // optional: send notification
        await supabase.functions.invoke("send_notification", {
          body: {
            to_user: profileId,
            type: "follow",
            title: `${user.user_metadata?.full_name || user.email} followed you`,
            body: "Tap to view profile",
            data: { follower_id: user.id }
          }
        }).catch(()=>{});
        setFollowing(true);
      } else {
        await unfollowUser(user.id, profileId);
        setFollowing(false);
      }
    } catch (err) {
      console.error("follow toggle err", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{profile?.full_name || profile?.username}</Text>
          <Text style={styles.info}>{profile?.specialization}</Text>
        </View>

        {/* Follow / Following button */}
        {user.id !== profileId && (
          <TouchableOpacity
            style={[styles.followBtn, following ? styles.following : styles.notFollowing]}
            onPress={handleFollowToggle}
            disabled={loading}
          >
            <Text style={styles.followText}>{loading ? "..." : following ? "Following" : "Follow"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* rest of profile UI ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  name: { fontSize: 18, fontWeight: "700" },
  info: { fontSize: 13, color: "#666" },
  followBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  following: { backgroundColor: "#e7f3ff" },
  notFollowing: { backgroundColor: "#0a84ff" },
  followText: { color: "#fff", fontWeight: "600" }
});
