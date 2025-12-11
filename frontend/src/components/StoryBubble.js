/**
 * StoryBubble.js
 * - Used in FeedScreen or Story row
 */

import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function StoryBubble({ story, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.circle}>
        <Image
          source={{ uri: story?.profiles?.avatar_url || 'https://placekitten.com/200/200' }}
          style={styles.avatar}
        />
      </View>
      <Text numberOfLines={1} style={styles.name}>
        {story?.profiles?.fullname || 'User'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 6, alignItems: 'center' },
  circle: {
    padding: 3,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#f20089',
  },
  avatar: { width: 60, height: 60, borderRadius: 40 },
  name: { marginTop: 4, fontSize: 12, width: 70, textAlign: 'center' },
});
