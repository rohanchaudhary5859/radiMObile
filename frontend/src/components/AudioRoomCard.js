/**
 * AudioRoomCard.js
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AudioRoomCard({ room, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{room.title}</Text>
      <Text style={styles.subtitle}>
        {room.participants?.length || 0} listeners
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowOpacity: 0.07,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#777', marginTop: 4 },
});
