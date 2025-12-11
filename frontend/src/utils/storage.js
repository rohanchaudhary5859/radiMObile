/**
 * storage.js
 * Secure async-storage wrapper (Expo SecureStore)
 */

import * as SecureStore from 'expo-secure-store';

export async function saveItem(key, value) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    console.log("Storage save error:", e);
  }
}

export async function getItem(key) {
  try {
    const val = await SecureStore.getItemAsync(key);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.log("Storage load error:", e);
    return null;
  }
}

export async function deleteItem(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.log("Storage delete error:", e);
  }
}
