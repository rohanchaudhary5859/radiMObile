import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function NotificationSettings() {
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) setSettings(data);
  };

  const toggle = async (key) => {
    const updated = { [key]: !settings[key] };

    setSettings({ ...settings, ...updated });

    await supabase.functions.invoke("updatesettings", {
      body: { user_id: user.id, settings: updated },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notification Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={settings.push_enabled}
          onValueChange={() => toggle("push_enabled")}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Email Notifications</Text>
        <Switch
          value={settings.email_enabled}
          onValueChange={() => toggle("email_enabled")}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>SMS Notifications</Text>
        <Switch
          value={settings.sms_enabled}
          onValueChange={() => toggle("sms_enabled")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  label: { fontSize: 18 },
});
