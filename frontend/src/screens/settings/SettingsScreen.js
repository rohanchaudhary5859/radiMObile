import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function SettingsScreen({ navigation }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    push_enabled: true,
    email_enabled: true,
    privacy_mode: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) setSettings(data);
  };

  const toggleSetting = async (key) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });

    await supabase.functions.invoke("updatesettings", {
      body: {
        user_id: user.id,
        settings: { [key]: newValue },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={settings.push_enabled}
          onValueChange={() => toggleSetting("push_enabled")}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Email Notifications</Text>
        <Switch
          value={settings.email_enabled}
          onValueChange={() => toggleSetting("email_enabled")}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Private Account</Text>
        <Switch
          value={settings.privacy_mode}
          onValueChange={() => toggleSetting("privacy_mode")}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PrivacySettings")}
      >
        <Text style={styles.buttonText}>Privacy Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NotificationSettings")}
      >
        <Text style={styles.buttonText}>Notification Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={async () => {
          await supabase.functions.invoke("deleteaccount", {
            body: { user_id: user.id },
          });
        }}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  label: { fontSize: 18 },
  button: {
    padding: 15,
    backgroundColor: "#333",
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});

const updateSettings = async (newSettings) => {
  await supabase.functions.invoke("updatesettings", {
    body: {
      user_id: user.id,
      settings: newSettings
    }
  });
};
