/**
 * App.js
 * + Supabase Support
 * + New Navigation System
 * + Safe Area + Gesture Handler
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Must be at top
import 'react-native-gesture-handler';

// Supabase environment
import env from '../src/config/env.json';
import { supabase } from '../src/lib/supabase';
import * as Notifications from 'expo-notifications';

// Navigation
import MainNavigator from './navigation/MainNavigator';

console.log('Supabase URL:', env.SUPABASE_URL);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <MainNavigator />
    </SafeAreaProvider>
  );
}

// -------------------------------------------------------
// SAVE TOKEN FUNCTION  
// Call this ONLY after login: saveToken(user.id)
// -------------------------------------------------------
export async function saveToken(userId) {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    const { data, error } = await supabase.functions.invoke("registertoken", {
      body: {
        user_id: userId,
        fcm_token: token
      }
    });

    if (error) {
      console.log("Token save error:", error);
    } else {
      console.log("Token saved:", data);
    }

  } catch (err) {
    console.log("saveToken error:", err);
  }
}
