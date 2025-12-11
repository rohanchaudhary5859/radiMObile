/**
 * LiveBadge.js
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#e10000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
