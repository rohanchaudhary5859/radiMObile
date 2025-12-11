import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { supabase } from "../../config/supabase";

export default function AdminDashboard({ navigation }) {
  const [stats, setStats] = useState({ users: 0, posts: 0, reports: 0 });

  async function loadStats() {
    const u = await supabase.from("profiles").select("id", { count: "exact" });
    const p = await supabase.from("posts").select("id", { count: "exact" });
    const r = await supabase.from("reports").select("id", { count: "exact" });

    setStats({
      users: u.count || 0,
      posts: p.count || 0,
      reports: r.count || 0,
    });
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Admin Dashboard</Text>

      <View style={{ marginTop: 20 }}>
        <Text>Total Users: {stats.users}</Text>
        <Text>Total Posts: {stats.posts}</Text>
        <Text>Reports: {stats.reports}</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("VerifyDoctors")}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: "#007bff",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Review Doctor Verification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("BanUsers")}
        style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: "#ff4444",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Ban a User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
