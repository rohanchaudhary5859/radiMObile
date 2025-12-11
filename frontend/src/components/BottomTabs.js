import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { supabase } from "../src/config/supabase";
import { useAuth } from "../src/hooks/useAuth";

import HomeScreen from "../src/screens/Home";
import SearchScreen from "../src/screens/Search";
import ReelsScreen from "../src/screens/ReelsScreen";
import MessagesScreen from "../src/screens/Messages";
import NotificationsScreen from "../src/screens/Notifications";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Realtime unread notifications listener
    const channel = supabase
      .channel("notif")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => setUnread((prev) => prev + 1)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Search" component={SearchScreen} />

      <Tab.Screen name="Reels" component={ReelsScreen} />

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge: unread > 0 ? unread : null,
        }}
      />
    </Tab.Navigator>
  );
}
