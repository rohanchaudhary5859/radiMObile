import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../../config/supabase";

export default function AdminVerificationReview() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const { data } = await supabase.from("doctor_verification").select("*").eq("status", "pending");
    setRequests(data || []);
  };

  const handleAction = async (reqId, action) => {
    await supabase.functions.invoke("verifydoctor", {
      body: { request_id: reqId, admin_id: "ADMIN_ID", action }
    });

    loadRequests();
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.heading}>Doctor Verification Requests</Text>

      {requests.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text>User ID: {r.user_id}</Text>
          <Text>Certificate: {r.certificate_url}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#4CAF50" }]}
              onPress={() => handleAction(r.id, "approved")}
            >
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "red" }]}
              onPress={() => handleAction(r.id, "rejected")}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { padding: 15, borderWidth: 1, borderRadius: 10, marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { padding: 10, borderRadius: 8 },
  btnText: { color: "white", fontWeight: "bold" }
});
