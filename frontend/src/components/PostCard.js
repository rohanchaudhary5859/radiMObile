/**
 * PostCard.js
 * - Used in FeedScreen
 * - Displays post, author, time, like button
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import formatTime from '../utils/formatTime';
import { Ionicons } from '@expo/vector-icons';

export default function PostCard({ post, onPress, onLike }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={{ uri: post?.profiles?.avatar_url || 'https://placekitten.com/200/200' }}
          style={styles.avatar}
        />
        <Text style={styles.author}>{post?.profiles?.fullname || 'User'}</Text>
        <Text style={styles.time}>{formatTime(post.created_at)}</Text>
      </View>

      {post.media?.length > 0 && (
        <Image source={{ uri: post.media[0] }} style={styles.media} />
      )}

      <Text style={styles.body}>{post.body}</Text>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike}>
          <Ionicons name="heart-outline" size={22} color="#f55" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 4 }}>{post.likes_count || 0}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 20, marginRight: 10 },
  author: { fontWeight: '700', fontSize: 15, flex: 1 },
  time: { color: '#888', fontSize: 11 },
  media: { width: '100%', height: 250, borderRadius: 10, marginVertical: 10 },
  body: { marginTop: 6, fontSize: 14 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
});
