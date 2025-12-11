import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { supabase } from "../../config/supabase";

export default function AdminAnalyticsDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: users } = await supabase.from("profiles").select("*");
    const { data: posts } = await supabase.from("posts").select("*");
    const { data: doctors } = await supabase.from("profiles").select("*").eq("verified", true);

    setStats({
      totalUsers: users?.length || 0,
      totalPosts: posts?.length || 0,
      verifiedDoctors: doctors?.length || 0,
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Admin Analytics</Text>

      <View style={{ marginTop: 20 }}>
        <Text>Total Users: {stats.totalUsers}</Text>
        <Text>Total Posts: {stats.totalPosts}</Text>
        <Text>Verified Doctors: {stats.verifiedDoctors}</Text>
      </View>
    </ScrollView>
  );
}
