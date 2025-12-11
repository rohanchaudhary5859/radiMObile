import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { fetchActiveStories, markStoryViewed } from '../services/storiesService';

export default function StoryViewer({ navigation, route }) {
  const [stories, setStories] = useState([]);

  useEffect(()=>{ load(); }, []);

  async function load() {
    const s = await fetchActiveStories();
    setStories(s);
  }

  async function onView(story) {
    // mark first slide viewed for demo
    await markStoryViewed(story.id, route.params.userId);
  }

  return (
    <View style={{flex:1,backgroundColor:'#000'}}>
      <FlatList data={stories} keyExtractor={(i)=>i.id} renderItem={({item})=>(
        <TouchableOpacity onPress={()=>{ onView(item); navigation.navigate('SingleStory', { story: item }); }}>
          <Image source={{ uri: item.thumbnail }} style={{height:120,width:80,margin:6,borderRadius:8}}/>
        </TouchableOpacity>
      )} horizontal/>
    </View>
  )
}