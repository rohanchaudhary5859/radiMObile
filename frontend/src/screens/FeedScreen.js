import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchFeed, likePost, savePost } from "../services/postsService";

export default function FeedScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => { load(); }, []);

  async function load(){
    const p = await fetchFeed();
    setPosts(p);
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(i)=>i.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10, backgroundColor:"#fff", marginBottom:10 }}>
          <Text>{item.content}</Text>

          {item.media?.length > 0 && (
            <Image source={{ uri:`${item.media[0].path}` }} style={{ height:300, borderRadius:10, marginTop:6 }} />
          )}

          <View style={{ flexDirection:"row", marginTop:10 }}>
            <TouchableOpacity onPress={()=>likePost(item.id, route.params.userId)}>
              <Text>❤️ {item.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>savePost(item.id, route.params.userId)} style={{ marginLeft:20 }}>
              <Text>💾 Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}
useEffect(() => {
  const channel = supabase
    .channel('posts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
      console.log("New Post:", payload.new);
      setPosts(prev => [payload.new, ...prev]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
