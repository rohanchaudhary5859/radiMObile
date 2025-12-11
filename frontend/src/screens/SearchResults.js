import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

export default function SearchResults({ route, navigation }) {
  const { results, query } = route.params;
  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>Results for: {query}</Text>
      <FlatList data={results} keyExtractor={(i)=>i.id} renderItem={({item})=> (
        <TouchableOpacity style={{padding:12,backgroundColor:'#fff',marginTop:8,borderRadius:8}} onPress={() => {
          if(item.source === 'profile') navigation.navigate('Profile', { userId: item.source_id });
          else if(item.source === 'post') navigation.navigate('PostDetail', { postId: item.source_id });
        }}>
          <Text style={{fontWeight:'700'}}>{item.title || item.body?.slice(0,80)}</Text>
          <Text style={{color:'#666'}}>{item.tags?.join(', ')}</Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}