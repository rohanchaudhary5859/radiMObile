/**
 * MainNavigator.js
 * Chooses between Auth flow or Main app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import TabsNavigator from './TabsNavigator';

import useAuth from '../../src/hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // splash or loader can be shown here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="App" component={TabsNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
