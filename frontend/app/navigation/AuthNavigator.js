/**
 * AuthNavigator.js
 * Screens required before login
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../src/screens/Auth/LoginScreen';
import RegisterScreen from '../../src/screens/Auth/RegisterScreen';
import OTPVerify from '../../src/screens/Auth/OTPVerify';
import TwoFAScreen from '../../src/screens/Auth/TwoFAScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OTPVerify} />
      <Stack.Screen name="TwoFA" component={TwoFAScreen} />
    </Stack.Navigator>
  );
}
