/**
 * ChatBubble.js
 * - Used in ChatRoom.js
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatBubble({ message, isMe }) {
  return (
    <View
      style={[
        styles.bubble,
        isMe ? styles.me : styles.them,
      ]}
    >
      {message.text && <Text style={styles.text}>{message.text}</Text>}
      {message.media && (
        <Text style={styles.mediaPlaceholder}>📎 Media</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    marginVertical: 4,
    maxWidth: '75%',
    borderRadius: 14,
  },
  me: {
    backgroundColor: '#d1e7ff',
    alignSelf: 'flex-end',
  },
  them: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  text: { fontSize: 15 },
  mediaPlaceholder: { color: '#666', fontSize: 12 },
});
