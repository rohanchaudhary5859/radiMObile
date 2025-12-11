import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getFollowers } from '../services/followService';

export default function ProfileFollowers({ route }) {
  const { userId } = route.params;
  const [followers, setFollowers] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){ const f = await getFollowers(userId); setFollowers(f); }

  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>Followers</Text>
      <FlatList data={followers} keyExtractor={(i)=>i.id} renderItem={({item}) => (
        <View style={{padding:12,backgroundColor:'#fff',marginTop:8,borderRadius:8}}>
          <Text>{item.follower}</Text>
        </View>
      )}/>
    </View>
  );
}