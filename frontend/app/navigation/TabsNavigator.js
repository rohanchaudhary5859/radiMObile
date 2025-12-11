/**
 * TabsNavigator.js
 * Bottom tab navigation for main UI
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import FeedScreen from '../../src/screens/Home/FeedScreen';
import ExploreScreen from '../../src/screens/Home/ExploreScreen';
import ReelsScreen from '../../src/screens/Reels/ReelsScreen';
import NotificationCenter from '../../src/screens/Notifications/NotificationCenter';
import MyProfile from '../../src/screens/Profile/MyProfile';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', height: 55 }
      })}
    >
      <Tab.Screen
        name="Home"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={26} />
          )
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" color={color} size={24} />
          )
        }}
      />

      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="play-circle" color={color} size={30} />
          )
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationCenter}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" color={color} size={25} />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={MyProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" color={color} size={28} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

import { supabase } from "../../src/config/supabase";
import { useAuth } from "../../src/hooks/useAuth";
import React, { useState, useEffect } from "react";

export default function TabsNavigator() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Listen for live notifications
    const channel = supabase
      .channel('notif')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => setUnread(prev => prev + 1)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <Tab.Navigator>
      {/* other tabs */}

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
