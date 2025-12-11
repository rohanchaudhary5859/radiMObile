/**
 * ReelCard.js
 * - Used in ReelsScreen
 * - Autoplay controlled from screen's FlatList
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function ReelCard({ reel, isActive, onLike }) {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: reel.video_url }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={isActive}
        isLooping
      />

      <View style={styles.overlay}>
        <Text style={styles.caption}>{reel.caption}</Text>

        <TouchableOpacity style={styles.likeBtn} onPress={onLike}>
          <Ionicons name="heart" size={26} color="#ff0055" />
          <Text style={{ color: '#fff' }}>{reel.reel_likes?.length || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
  video: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    flexDirection: 'column',
  },
  caption: { color: '#fff', fontSize: 16, marginBottom: 10 },
  likeBtn: { alignItems: 'center' },
});
