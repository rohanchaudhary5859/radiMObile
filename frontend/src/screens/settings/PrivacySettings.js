import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function PrivacySettings() {
  const { user } = useAuth();
  const [state, setState] = useState({
    privacy_mode: false,
    restricted_mode: false,
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

    if (data) setState(data);
  };

  const toggle = async (key) => {
    const updated = { [key]: !state[key] };
    setState({ ...state, ...updated });

    await supabase.functions.invoke("updatesettings", {
      body: { user_id: user.id, settings: updated },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Privacy Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Private Account</Text>
        <Switch
          value={state.privacy_mode}
          onValueChange={() => toggle("privacy_mode")}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Restricted Mode</Text>
        <Switch
          value={state.restricted_mode}
          onValueChange={() => toggle("restricted_mode")}
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
