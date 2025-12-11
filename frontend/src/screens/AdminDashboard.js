import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AdminDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminVerificationReview")}
      >
        <Text style={styles.text}>Verify Doctors</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminAnalyticsDashboard")}
      >
        <Text style={styles.text}>Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AdminPlans")}
      >
        <Text style={styles.text}>Manage Plans</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: {
    padding: 15,
    backgroundColor: "#0A66C2",
    marginBottom: 15,
    borderRadius: 10
  },
  text: { color: "white", fontSize: 16, textAlign: "center" }
});
