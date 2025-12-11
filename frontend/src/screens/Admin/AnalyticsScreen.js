import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { supabase } from "../../config/supabase";

export default function AnalyticsScreen({ route }) {
  const { postId, reelId, profileId } = route.params || {};
  const [postStats, setPostStats] = useState(null);
  const [reelRetention, setReelRetention] = useState(null);

  useEffect(() => {
    if (postId) fetchPost();
    if (reelId) fetchReel();
  }, []);

  const fetchPost = async () => {
    const res = await fetch(`${process.env.FUNCTIONS_URL || ''}/getpostinsights`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ post_id: postId, days: 7 })
    });
    const json = await res.json();
    setPostStats(json);
  };

  const fetchReel = async () => {
    const res = await fetch(`${process.env.FUNCTIONS_URL || ''}/getreelretention`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reel_id: reelId })
    });
    const json = await res.json();
    setReelRetention(json.retention || []);
  };

  return (
    <ScrollView style={styles.container}>
      {postStats && (
        <View style={styles.card}>
          <Text style={styles.title}>Post Insights</Text>
          <Text>Impressions: {postStats.impressions}</Text>
          <Text>Total Watch (s): {postStats.total_watch_seconds}</Text>
          <Text>Likes: {postStats.likes}</Text>
          <Text>Saves: {postStats.saves}</Text>
          <Text style={{marginTop:10}}>Daily:</Text>
          {postStats.daily?.map(d => (
            <Text key={d.day}>{d.day} — {d.impressions} views — {d.total_watch_seconds}s</Text>
          ))}
        </View>
      )}

      {reelRetention && (
        <View style={styles.card}>
          <Text style={styles.title}>Reel Retention</Text>
          {reelRetention.map(r => (
            <Text key={r.label}>{r.label}: {r.percentage}%</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  card: { padding: 16, borderRadius: 8, backgroundColor: '#f8f8f8', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 }
});
